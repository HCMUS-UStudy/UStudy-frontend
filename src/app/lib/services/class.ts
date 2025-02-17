import { ClassData, ClassSchema, StudentData } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const getAllClasses = async (
  query: string,
  currentPage: number,
  limit: number,
): Promise<ClassData> => {
  const response = await axiosInstance.get("/class/list", {
    params: {
      page: currentPage,
      limit: limit,
      filter: query,
    },
  });
  return response.data.data;
};

export const createNewClass = async (data: ClassSchema) => {
  const response = await axiosInstance.post("/class/create", data);
  // console.log(response);
  return response.data;
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
      filter: "",
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

export const getListStudent = async (
  classId: string,
  query: string,
  currentPage: number,
  limit: number,
): Promise<StudentData> => {
  const response = await axiosInstance.get(`/class/list-students/${classId}`, {
    params: {
      page: currentPage,
      limit: limit,
      filter: query,
    },
  });
  return response.data.data;
};

// export const getOneClass = async (classId: string): Promise<ClassTeacher> => {
//   const response = await axiosInstance.get(`/classes/all/get-one/${classId}`);
//   return response.data.data;
// };
