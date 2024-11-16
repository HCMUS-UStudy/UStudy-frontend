'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {z} from 'zod';
import axiosInstance from './axios';
import { cookies } from 'next/headers';

let errorData: string | null = null;
let accessToken: string | null = null;
let role: string | null = null;

const LogInFormSchema = z.object({
    email: z.string({message: '(*) Email is required'}).trim().email({message: '(*) Invalid email address'}),
    password: z.string().min(1, {message: '(*) Password is required'})
});

export type LoginFormState = {
    errors?: {
        email?: string[] | null;
        password?: string[] | null;
    }
    message?: string | null;
}

export async function logIn(previousState: LoginFormState, formData: FormData) {
    const validationResult = LogInFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    });
    if(!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        console.log(errors);
        return {
            message: 'Invalid form',
            errors: errors
        }
    }
    await axiosInstance.post('/api/auth/user/login', {
        email: formData.get('email'),
        password: formData.get('password')
    })
    .then((response) => {
        accessToken = response.data.access_token;
        role = response.data.user.role;
    })
    .catch((error) => {
        console.log(error);
        errorData = error.status === 400 ? error.data : null;
    });
    if(errorData) {
        return {
            message: 'Login failed',
            errors: {
                email: [errorData],
                password: [errorData]
            }
        }
    }
    if(accessToken) {
        (await cookies()).set('accessToken', accessToken);
        switch(role) {
            case 'STUDENT':
                redirect('/');
            case 'CLERK':
                redirect('/staff');
            case 'TEACHER':
                redirect('/teacher');
        }
    }
    return {
        message: null,
        errors: {}
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
        grade?: string[] | null
    }
    message?: string | null;
}

const CreateClassFormSchema = z.object({
    name: z.string().min(1, {message: '(*) Vui lòng nhập tên lớp'}),
    teacher: z.string().min(1, {message:'(*) Vui lòng chọn giáo viên'}),
    subject: z.string().min(1, {message:'(*) Vui lòng chọn môn học'}).refine((data) => data !== 'Môn học', {message: '(*) Vui lòng chọn môn học'}),
    date: z.string().min(1, {message: '(*) Vui lòng chọn ngày bắt đầu'}).transform((str) => new Date(str)).refine((data) => data >= new Date(), {message: '(*) Ngày bắt đầu phải lớn hơn hôm nay'}),
    fee: z.number({message: '(*) Vui lòng nhập học phí'}).positive({message: '(*) Học phí phải lớn hơn 100.000 VNĐ'}).gt(100000, {message: '(*) Học phí phải lớn hơn 100.000 VNĐ'}),
    grade: z.string().min(1, {message: '(*) Vui lòng chọn khối'}).refine((data) => data !== 'Khối', {message: '(*) Vui lòng chọn khối'})
})

export async function createClass(previousState: CreateClassFormState, formData: FormData) {
    console.log(formData);
    const validationResult = CreateClassFormSchema.safeParse({
        name: formData.get('className'),
        teacher: formData.get('teacher'),
        subject: formData.get('subject'),
        description: formData.get('description'),
        fee: Number(formData.get('fee')) || "",
        date: formData.get('startDate'),
        grade: formData.get('grade')
    })
    if(!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        console.log(errors);
        return {
            message: "Invalid form",
            errors: errors
        }
    }
    revalidatePath('/staff/classes');
    redirect('/staff/classes');
}