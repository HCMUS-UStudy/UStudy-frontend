'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {z} from 'zod';
import axiosInstance from './axios';

let errorData: string | null = null;
let accessToken: string | null = null;
let refreshToken: string | null = null;
let role: string | null = null;

const LogInFormSchema = z.object({
    genID: z.string().min(1, {message: '(*) Vui lòng nhập ID'}),
    password: z.string().min(1, {message: '(*) Vui lòng nhập mật khẩu'})
});

export type LoginFormState = {
    errors?: {
        genID?: string[] | null;
        password?: string[] | null;
    }
    message?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
}

export async function logIn(previousState: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const validationResult = LogInFormSchema.safeParse({
        genID: formData.get('genID'),
        password: formData.get('password')
    });
    // console.log(formData);
    if(!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        console.log(errors);
        return {
            ...previousState,
            message: 'Invalid form',
            errors: errors,
        }
    }
    await axiosInstance.post('/auth/user/login', {
        genId: formData.get('genID'),
        password: formData.get('password')
    })
    .then((response) => {
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
        role = response.data.user.role;
    })
    .catch((error) => {
        console.log(error);
        errorData = error.status === 400 ? error.data : null;
    });
    if(errorData) {
        return {
            ...previousState,
            message: 'Login failed',
            errors: {
                genID: [errorData],
                password: [errorData],
            }
        }
    }
    if(accessToken) {
        // (await cookies()).set('accessToken', accessToken);
        switch(role) {
            case 'STUDENT':
                redirect('/');
            case 'CLERK':     
                return {
                    ...previousState,
                    message: 'Login successfully',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    errors: {}
                }
            case 'TEACHER':
                redirect('/teacher');
        }
    }
    return {
        ...previousState,
        message: 'Login failed',
    }
}

export type CreateClassFormState = {
    errors?: {
        name?: string[] | null,
        teacher?: string[] | null,
        subject?: string[] | null,
        date?: string[] | null,
        description?: string[] | null,
        fee?: string[] | null,
        grade?: string[] | null,
        duration?: string[] | null
    }
    message?: string | null;
}

const CreateClassFormSchema = z.object({
    name: z.string().min(1, {message: '(*) Vui lòng nhập tên lớp'}),
    teacher: z.string().min(1, {message:'(*) Vui lòng chọn giáo viên'}),
    subject: z.string().min(1, {message:'(*) Vui lòng chọn môn'}).refine((data) => data !== 'Môn học', {message: '(*) Vui lòng chọn môn'}),
    date: z.string().min(1, {message: '(*) Chọn ngày bắt đầu'}).transform((str) => new Date(str)).refine((data) => data >= new Date(), {message: '(*) Ngày bắt đầu phải lớn hơn hôm nay'}),
    fee: z.number({message: '(*) Vui lòng nhập học phí'}).positive({message: '(*) Học phí phải lớn hơn 100.000 VNĐ'}).gt(100000, {message: '(*) Học phí phải lớn hơn 100.000 VNĐ'}),
    grade: z.string().min(1, {message: '(*) Vui lòng chọn khối'}).refine((data) => data !== 'Khối', {message: '(*) Vui lòng chọn khối'}),
    duration: z.string().min(1, {message: '(*) Chọn thời gian học'}).refine((data) => data !== 'Thời gian học', {message: '(*) Chọn thời gian'}),
})

export async function createClass(previousState: CreateClassFormState, formData: FormData): Promise<CreateClassFormState>{
    console.log(formData);
    const validationResult = CreateClassFormSchema.safeParse({
        name: formData.get('className'),
        teacher: formData.get('teacher'),
        subject: formData.get('subject'),
        description: formData.get('description'),
        fee: Number(formData.get('fee')) || "",
        date: formData.get('startDate'),
        grade: formData.get('grade'),
        duration: formData.get('duration')
    })
    if(!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        console.log(errors);
        return {
            message: "Invalid form",
            errors: errors
        }
    }
    return {
        message: 'Success',
        errors: {}
    }
    revalidatePath('/staff/classes');
    redirect('/staff/classes');
}