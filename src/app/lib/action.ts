'use server';
import { redirect } from 'next/navigation';
import {z} from 'zod';

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
    console.log(formData);
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
    redirect('/staff'); // nếu là giáo vụ
}

export type CreateClassFormState = {
    errors?: {
        name?: string[],
        teacher?: string[],
        subject?: string[],
        date?: string[],
        description?: string[],
        fee?: string[]
    }
    message?: string | null;
}

const CreateClassFormSchema = z.object({
    name: z.string().min(1, {message: '(*) Vui lòng nhập tên lớp'}),
    teacher: z.string().min(1, {message:'(*) Vui lòng chọn giáo viên'}),
    subject: z.string().min(1, {message:'(*) Vui lòng chọn môn học'}),
    date: z.date({message: '(*) Vui lòng chọn ngày bắt đầu'}).refine((data) => data > new Date(), {message: '(*) Ngày bắt đầu phải lớn hơn hôm nay'}),
    fee: z.number({message: '(*) Vui lòng nhập học phí'}).positive({message: '(*) Học phí phải lớn hơn 100.000 VNĐ'}).gt(100000, {message: '(*) Học phí phải lớn hơn 100.000 VNĐ'})
})

export async function createClass(previousState: CreateClassFormState, formData: FormData) {
    // console.log(formData);
    const validationResult = CreateClassFormSchema.safeParse({
        name: formData.get('className'),
        teacher: formData.get('teacher'),
        subject: formData.get('subject'),
        description: formData.get('description'),
        fee: formData.get('fee')
    })
    if(!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        console.log(errors);
        return {
            message: 'Invalid form',
            errors: errors
        }
    }
    return {
        message: '',
        errors: {}
    }
}