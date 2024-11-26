import { ClassData } from "../types/type";
import axiosInstance from "./axios";

export const getAllBranch = async () => {
    try {
        const response = await axiosInstance.get('/branch/clerk/get-all', {
            params: {
                page: 0,
                limit: 10
            }
        });
        return response.data.content;
    } catch(error) {
        console.log(error);
    }
}

export const getAllGrades = async () => {
    try {
        const response = await axiosInstance.get('/grade/clerk/get-all', {
            params: {
                page: 0,
                limit: 10
            }
        });
        return response.data.content;
    } catch(error) {
        throw error;       
    }
}

export const getCoursesByGrade = async (gradeId: string) => {
    try {
        const response = await axiosInstance.get('/course/clerk/get-course-by-grade-id', {
            params: {
                page: 0,
                limit: 10,
                gradeId: gradeId
            }
        });
        return response.data.content;
    } catch(error) {
        throw error;       
    }
}

export const getAllClasses = async (query: string, currentPage: number): Promise<ClassData> => {
    try {
        const response = await axiosInstance.get('/user/all/get-list-class', {
            params: {
                page: currentPage,
                limit: 5,
                filter: query
            }
        });
        return response.data;
    } catch(error) {
        throw error;
    }
}
