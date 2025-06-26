import {
  ClassData,
  RegisterClassData,
  ClassChooseData,
  UserClassData,
  ClassDetail,
  ApproveResponse,
  ClassToRegisterResponse,
  ClassItem,
  GenderType,
  UserSummary,
  ClassSchema,
  UpdateSchedule,
  BaseResponse,
  StudentClassCount,
  StudentClassWithStats,
  StudentClassWithGrades,
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
  console.log("response", response.data);
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
  classId: string | string[] | undefined,
  query: string,
  currentPage: number,
  limit: number,
  role?: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN",
): Promise<MemberData> => {
  try {
    const response = await axiosInstance.get(`/class-member/list/${classId}`, {
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

export const removeMembers = async (
  classId: string | string[] | undefined,
  listUserIds?: string[],
): Promise<MemberData> => {
  try {
    const response = await axiosInstance.delete(
      `/class-member/remove/${classId}`,
      {
        data: listUserIds,
      },
    );
    return response.data;
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
  classId: string | string[] | undefined,
  role: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN",
): Promise<ApproveResponse> => {
  try {
    const response = await axiosInstance.post(
      `/class-member/add/${classId}`,
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

export const getListClassToRegister = async (
  query: string,
  page: number,
  limit: number,
  courseId?: string,
  gradeId?: string,
  status?: "OVERDUE" | "PENDING" | "COMPLETED" | "",
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

export const updateClass = async (
  classId: string,
  data: Pick<
    ClassSchema,
    "name" | "description" | "courseId" | "gradeId" | "fee"
  >,
): Promise<
  ClassItem & {
    teacher: (UserSummary & { gender: GenderType })[];
  }
> => {
  try {
    const response = await axiosInstance.patch(
      `/class/update/${classId}`,
      data,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateSchedule = async ({
  classId,
  data,
}: {
  classId: string;
  data: UpdateSchedule;
}): Promise<BaseResponse> => {
  try {
    const response = await axiosInstance.patch(
      `/class/update-schedule/${classId}`,
      data,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentClassCount = async (): Promise<StudentClassCount> => {
  try {
    const response = await axiosInstance.get("/class/count-student-classes");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentClassesWithStats = async (): Promise<
  StudentClassWithStats[]
> => {
  try {
    const response = await axiosInstance.get("/class/my-classes-with-stats");
    console.log(response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentClassesWithGrades = async (): Promise<
  StudentClassWithGrades[]
> => {
  try {
    const response = await axiosInstance.get("/class/my-classes-with-grades");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
