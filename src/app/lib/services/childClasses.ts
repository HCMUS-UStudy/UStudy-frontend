import axiosInstance from "@/app/lib/axios";
import { Child } from "@/app/store/ChildrenSlice";
import { ChildClassScore } from "@/app/types/childClasses";

export const getListChildClasses = async (
  childId: string,
  page: number,
  limit: number,
  filter: string = "",
) => {
  const response = await axiosInstance.get(`/parent/child-classes/${childId}`, {
    params: {
      page,
      limit,
      filter,
    },
  });
  return response.data.data;
};

export const getChildScores = async (
  childId: string,
): Promise<ChildClassScore[]> => {
  const response = await axiosInstance.get(`/parent/child-scores/${childId}`);
  return response.data.data;
};

export const getChildClassDetails = async (
  studentId: string,
  classId: string,
) => {
  const response = await axiosInstance.get(`/parent/child-class-details`, {
    params: {
      studentId,
      classId,
    },
  });
  return response.data.data;
};

export const getAllChildrenOfParent = async (): Promise<Child[]> => {
  try {
    const response = await axiosInstance.get("/parent/children");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
