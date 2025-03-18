import {
  ClassData,
  RegisterClassData,
  MemberData,
  ClassChooseData,
  UserClassData,
} from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";
import { CreateClassInputs } from "@/app/(admin)/admin/classes/create/page";

export const getAllClasses = async (
  nameQuery: string,
  courseQuery: string,
  gradeQuery: string,
  currentPage: number,
  limit: number,
): Promise<ClassData> => {
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
  nameQuery: string,
  courseQuery: string,
  gradeQuery: string,
  currentPage: number,
  limit: number,
): Promise<UserClassData> => {
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
};

export const createNewClass = async (data: CreateClassInputs) => {
  try {
    const response = await axiosInstance.post("/class/create", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getClassById = async (classId: string) => {
  const response = await axiosInstance.get(`/class/details/${classId}`);
  return response.data;
};

export const getClassesForTeacher = async () => {
  const response = await axiosInstance.get("/class/list", {
    params: {
      page: 0,
      limit: 10,
      name: "",
      course: "",
      grade: "",
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
  role: string,
): Promise<MemberData> => {
  const response = await axiosInstance.get(`/class/list-members/${classId}`, {
    params: {
      page: currentPage,
      limit: limit,
      role: role,
      filter: query,
    },
  });
  return response.data.data;
};

export const getListAvailableTea = async (
  classId: string,
  query: string,
  currentPage: number,
  limit: number,
): Promise<RegisterClassData> => {
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
};

export const addMembers = async (
  userIds: string[],
  classId: string,
  role: string,
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
  return response.data;
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

// export const getOneClass = async (classId: string): Promise<ClassTeacher> => {
//   const response = await axiosInstance.get(`/classes/all/get-one/${classId}`);
//   return response.data.data;
// };
