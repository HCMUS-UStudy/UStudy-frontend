import { AccountData, AccountSchema, ClassData, ClassSchema, CourseData, CourseSchema, RegisterAccountData, TimeItem, ClassTeacher } from "../types/type";
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
	} catch (error) {
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
	} catch (error) {
		throw error;
	}
}

export const getAllClasses = async (query: string, currentPage: number): Promise<ClassData> => {
	try {
		const response = await axiosInstance.get('/class/all/get-list-class', {
			params: {
				page: currentPage,
				limit: 5,
				filter: query
			}
		});
		return response.data;
	} catch (error) {
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
	} catch (error) {
		throw error;
	}
}

export const addBranch = async (branch: Branch) => {
	try {
		const response = await axiosInstance.post('/branch/admin/add', branch);
		return response;
	} catch (error) {
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
	} catch (error) {
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
	} catch (error) {
		throw error;
	}
}

export const createNewClass = async (data: ClassSchema) => {
	try {
		const response = await axiosInstance.post('/class/clerk/add', data);
		// console.log(response);
		return response;
	} catch (error) {
		throw error;
	}
}

export const createNewAccount = async (data: AccountSchema) => {
	try {
		const response = await axiosInstance.post('/user/admin/add', data);
		// console.log(response);
		return response;
	} catch (error) {
		throw error;
	}
}

export const createNewCourse = async (data: CourseSchema) => {
	try {
		const response = await axiosInstance.post('/course/admin/add', data);
		// console.log(response);
		return response;
	} catch (error) {
		throw error;
	}
}

export const handleRefreshToken = async (refreshToken: string | null) => {
	try {
		const response = await axiosInstance.post('/auth/refresh-token', {
			refreshToken: refreshToken
		});
		return response.data;
	} catch (error) {
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
	} catch (error) {
		throw error;
	}
}

export const getClassById = async (classId: string) => {
	try {
		const response = await axiosInstance.get("/class/all/get-one", {
			params: {
				classId,
			},
		});
		return response;
	} catch (error) {
		throw error;
	}
}

export const getListChapter = async (courseId: string, gradeId: string, page: number, limit: number, filter: string = "") => {
	try {
		const response = await axiosInstance.get('/chapter/clerk/get-list-chapter', {
			params: {
				courseId,
				gradeId,
				page,
				limit,
				filter
			}
		});
		return response;
	} catch (error) {
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
	} catch (error) {
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
	} catch (error) {
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
	} catch (error) {
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
	} catch (error) {
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
	} catch (error) {
		throw error;
	}
}

export const getRegister = async (role: string, currentPage: number): Promise<RegisterAccountData> => {
	try {
		const response = await axiosInstance.get('/register/clerk/waiting-register', {
			params: {
				page: currentPage,
				limit: 5,
				role
			}
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const confirmRegister = async (userId: string) => {
	try {
		const response = await axiosInstance.put(`/register/admin/confirm?registerId=${userId}`, {
		});
		return response;
	} catch (error) {
		throw error;
	}
}

export const rejectRegister = async (userId: string) => {
	try {
		const response = await axiosInstance.put(`/register/admin/reject?registerId=${userId}`, {
		});
		return response;
	} catch (error) {
		throw error;
	}
}

export const getAvailableTeacher = async (classId: string) => {
	try {
		const response = await axiosInstance.get('/user/clerk/available-teachers', {
			params: {
				classId
			}
		});
		return response;
	} catch(error) {
		throw error;
	}
}

export const getClassesForTeacher = async () => {
	try {
		const response = await axiosInstance.get('/class/all/get-list-class', {
			params: {
				page: 0,
				limit: 10,
				filter: ''
			}
		});
		return response.data.content;
	} catch (error) {
		throw error;
	}
}

export const addTeacherToClass = async (classId: string, teacherId: string) => {
	try {
		const response = await axiosInstance.post(`/class/clerk/${classId}/add-teacher`, {}, {
			params: {
				teacherId
			}
		})
		return response;
	} catch(error) {
		throw error;
	}
}


export const getOneClass = async (classId: string): Promise<ClassTeacher> => {
	try {
		const response = await axiosInstance.get('/class/all/get-one', {
			params: {
				classId: classId
			}
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
