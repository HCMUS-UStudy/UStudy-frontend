import {
  ClassData,
  RegisterClassData,
  ClassChooseData,
  UserClassData,
  ClassDetail,
  ApproveResponse,
  ClassToRegisterResponse,
} from "@/app/types";
import axiosInstance from "@/app/lib/axios";
import { MemberData } from "@/app/types/member";
import { CreateClassInputs } from "@/app/ui/components/admin/classes/create/CreateClass";

export const getAllClasses = async (
  nameQuery: string,
  currentPage: number,
  limit: number,
  courseQuery?: string,
  gradeQuery?: string,
): Promise<ClassData> => {
  try {
    const response = await axiosInstance.get("/class/list", {
      params: {
        page: currentPage,
        limit: limit,
        name: nameQuery,
        course: courseQuery,
        grade: gradeQuery,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getAllChooseClasses = async (
  query: string,
  currentPage: number,
  limit: number,
): Promise<ClassChooseData> => {
  const response = await axiosInstance.get("/class/list", {
    params: {
      page: currentPage,
      limit: limit,
      filter: query,
    },
  });
  return response.data.data;
};

export const getAllStudentClasses = async (
  currentPage: number,
  limit: number,
  name?: string,
  courseId?: string,
  gradeId?: string,
): Promise<UserClassData> => {
  try {
    const response = await axiosInstance.get("/class/list", {
      params: {
        page: currentPage,
        limit,
        name,
        courseId,
        gradeId,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createNewClass = async (data: CreateClassInputs) => {
  try {
    const response = await axiosInstance.post("/class/create", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getClassById = async (classId: string): Promise<ClassDetail> => {
  try {
    const response = await axiosInstance.get(`/class/details/${classId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getClassesForTeacher = async () => {
  const response = await axiosInstance.get("/class/list", {
    params: {
      page: 0,
      limit: 10,
      name: "",
      courseId: "",
      gradeId: "",
    },
  });
  return response.data.data.content;
};

export const addTeacherToClass = async (classId: string, teacherId: string) => {
  const response = await axiosInstance.post(
    `/class/assign-teacher/${classId}`,
    {},
    {
      params: {
        teacherId,
      },
    },
  );
  return response.data;
};

export const getListMembers = async (
  classId: string,
  query: string,
  currentPage: number,
  limit: number,
  role: "STUDENT" | "TEACHER",
): Promise<MemberData> => {
  try {
    const response = await axiosInstance.get(`/class/list-members/${classId}`, {
      params: {
        page: currentPage,
        limit: limit,
        role: role,
        filter: query,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getListAvailableTea = async (
  classId: string,
  query: "",
  currentPage: number,
  limit: number,
): Promise<RegisterClassData> => {
  try {
    const response = await axiosInstance.get(
      `/class/list-available-teachers/${classId}`,
      {
        params: {
          page: currentPage,
          limit: limit,
          filter: query,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const addMembers = async (
  userIds: string[],
  classId: string,
  role: "STUDENT" | "TEACHER" | "PARENT",
): Promise<ApproveResponse> => {
  try {
    const response = await axiosInstance.post(
      `/class/add-members/${classId}`,
      userIds,
      {
        params: {
          role: role,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListUserClass = async (
  userId: string,
  query: string,
  currentPage: number,
  limit: number,
): Promise<UserClassData> => {
  const response = await axiosInstance.get(
    `/class/list-user-classes/${userId}`,
    {
      params: {
        page: currentPage,
        limit: limit,
        filter: query,
      },
    },
  );
  return response.data.data;
};

export const addMembersToClass = async (
  userIds: string[],
  classId: string,
  role: "STUDENT" | "TEACHER" | "PARENT",
) => {
  const response = await axiosInstance.post(
    `/class/add-members/${classId}`,
    userIds,
    {
      params: {
        role: role,
      },
    },
  );
  return response.data.data;
};

export const getListClassToRegister = async (
  query: string,
  page: number,
  limit: number,
  courseId?: string,
  gradeId?: string,
  status?: "ACCEPTED" | "WAITING" | "",
): Promise<ClassToRegisterResponse> => {
  try {
    const response = await axiosInstance.get("/register-class/list-class", {
      params: {
        name: query,
        page,
        limit,
        status,
        courseId,
        gradeId,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// export const getOneClass = async (classId: string): Promise<ClassTeacher> => {
//   const response = await axiosInstance.get(`/classes/all/get-one/${classId}`);
//   return response.data.data;
// };
