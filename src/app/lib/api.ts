import { AccountData, ClassData, ClassSchema, CourseData, TimeItem } from "../types/type";
import { Branch } from "../types/type";
import axiosInstance from "./axios";

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

export const getCoursesByGradeId = async (gradeId: string) => {
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

export const getAllBranches = async (page: number, limit: number) => {
    try {
        const response = await axiosInstance.get('/branch/clerk/get-all', {
            params: {
                page: page,
                limit: limit
            },
        });
        return response;
    } catch(error) {
        throw error;
    }
}

export const addBranch = async (branch: Branch) => {
    try {
        const response = await axiosInstance.post('/branch/admin/add', branch);
        return response;
    } catch(error) {
        throw error;
    }
}

export const getAvailableRooms = async (branchId: string, times: TimeItem[], startDate: string, endDate: string) => {
    try {
        const body = {
            branchId: branchId,
            times: times,
            startDate: startDate,
            endDate: endDate
        }
        const response = await axiosInstance.post('/room/clerk/available', body)
        return await response.data
    } catch(error) {
        throw error;
    }
}

export const userLogin = async (genId: string, password: string) => {
    try {
        const response = await axiosInstance.post('/auth/user/login', {
            genId: genId,
            password: password
        });
        return response.data;
    } catch(error) {
        throw error;
    }
}

export const createNewClass = async (data: ClassSchema) => {
    try {
        const response = await axiosInstance.post('/class/clerk/add', data);
        // console.log(response);
        return response;
    } catch(error) {
        throw error;
    }
}

export const handleRefreshToken = async (refreshToken: string | null) => {
    try {
        const response = await axiosInstance.post('/auth/refresh-token', {
            refreshToken: refreshToken
        });
        return response.data;
    } catch(error) {
        throw error;
    }
}

export const adminLogin = async (genId: string, password: string) => {
    try {
        const response = await axiosInstance.post('/auth/admin/login', {
            genId: genId,
            password: password
        });
        return response;
    } catch(error) {
        throw error;
    }
}

export const getAllCourses = async (query: string, currentPage: number): Promise<CourseData> => {
    try {
        const response = await axiosInstance.get('/course/admin/get-list-course', {
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

export const getGradesByCourseId = async (query: string, currentPage: number, courseId: string) => {
    try {
        const response = await axiosInstance.get('/grade/admin/get-grades-by-course', {
            params: {
                page: currentPage,
                limit: 5,
                filter: query,
                courseId: courseId
            }
        });
        return response.data;
    } catch(error) {
        throw error;       
    }
}

export const getChapterByCourse_GradeId = async (query: string, currentPage: number, courseId: string, gradeId: string) => {
    try {
        const response = await axiosInstance.get('/chapter/clerk/get-list-chapter', {
            params: {
                page: currentPage,
                limit: 5,
                filter: query,
                courseId: courseId,
                gradeId: gradeId
            }
        });
        return response.data;
    } catch(error) {
        throw error;       
    }
}

export const getMaterialsByChapterId = async (query: string, currentPage: number, chapterId: string) => {
    try {
        const response = await axiosInstance.get('/material/all/get-materials', {
            params: {
                page: currentPage,
                limit: 5,
                filter: query,
                chapterId: chapterId
            }
        });
        return response.data;
    } catch(error) {
        throw error;       
    }
}

export const getAllAccount = async (query: string, currentPage: number): Promise<AccountData> => {
    try {
        const response = await axiosInstance.get('/user/clerk/get-list-user', {
            params: {
                page: currentPage,
                limit: 5,
                role: 'STUDENT',
                filter: query
            }
        });
        return response.data;
    } catch(error) {
        throw error;
    }
}