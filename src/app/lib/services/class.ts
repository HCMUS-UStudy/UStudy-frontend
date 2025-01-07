import { ClassData, ClassSchema, ClassTeacher } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const getAllClasses = async (
  query: string,
  currentPage: number,
  limit: number,
): Promise<ClassData> => {
  const response = await axiosInstance.get("/class/all/get-list-class", {
    params: {
      page: currentPage,
      limit: limit,
      filter: query,
    },
  });
  return response.data.data;
};

export const createNewClass = async (data: ClassSchema) => {
  const response = await axiosInstance.post("/class/clerk/add", data);
  // console.log(response);
  return response.data;
};

export const getClassById = async (classId: string) => {
  const response = await axiosInstance.get(`/class/all/get-one/${classId}`);
  return response.data;
};

export const getClassesForTeacher = async () => {
  const response = await axiosInstance.get("/class/all/get-list-class", {
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
    `/class/clerk/${classId}/add-teacher`,
    {},
    {
      params: {
        teacherId,
      },
    },
  );
  return response.data;
};

// export const getOneClass = async (classId: string): Promise<ClassTeacher> => {
//   const response = await axiosInstance.get(`/class/all/get-one/${classId}`);
//   return response.data.data;
// };
