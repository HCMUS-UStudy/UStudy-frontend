"use client";

import React, { useCallback } from "react";

import {
  QueryClient,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";

import ClassSettingLoading from "@/app/ui/components/_common/loading/ClassSettingLoading";
import { useParams } from "next/navigation";
import {
  getAllCourses,
  getAllGrades,
  getClassById,
  updateClass,
  // updateSchedule,
} from "@/app/lib/services";
import ClassForm from "@/app/ui/components/admin/classes/setting/ClassForm";
import { ClassSchema } from "@/app/types";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import ClassSessions from "@/app/ui/components/admin/classes/setting/ClassSessions";
// import ClassSessions from "@/app/ui/components/admin/classes/setting/ClassSessions";

export type UpdateClassType = Pick<
  ClassSchema,
  "name" | "description" | "courseId" | "gradeId" | "fee"
>;

export default function ClassSetting() {
  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;
  const queryClient = new QueryClient();

  const { data: classDetail, status } = useQuery({
    queryKey: ["ClassDetails", classId],
    queryFn: () => getClassById(classId),
    refetchOnWindowFocus: false,
    enabled: !!classId,
  });
  console.log(classDetail);

  const results = useQueries({
    queries: [
      {
        queryKey: ["Courses"],
        queryFn: () => getAllCourses("", 100, 0),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["Grades"],
        queryFn: () => getAllGrades("", 100, 0),
        refetchOnWindowFocus: false,
      },
    ],
  });
  const grades = results[1].data;
  const courses = results[0].data;

  const { addToast } = useCustomToast();

  const updateClassMutation = useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: UpdateClassType;
    }) => updateClass(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ClassDetails"] });
      addToast.success("Chỉnh sửa lớp học thành công");
    },
    onError: (error) => {
      addToast.error(error.message);
    },
  });

  const handleUpdate = useCallback(
    ({ classId, data }: { classId: string; data: UpdateClassType }) => {
      updateClassMutation.mutate({ classId, data });
    },
    [],
  );

  if (status === "pending") {
    return <ClassSettingLoading />;
  } else if (new Date() > new Date(classDetail?.endDate || "")) {
    return (
      <div className="flex justify-center items-center mt-10 mx-20 h-60 bg-red-50 border-2 border-red-300 rounded-lg">
        <div className="text-red-500 lg:text-lg">
          Không thể chỉnh sửa lớp đã kết thúc
        </div>
      </div>
    );
  } else if (status === "success") {
    return (
      <>
        <ClassForm
          classDetail={classDetail}
          grades={grades?.content || []}
          courses={courses?.content || []}
          handleUpdate={handleUpdate}
        />
        <div className="space-y-3">
          <ClassSessions classDetail={classDetail} />
        </div>
      </>
    );
  } else {
    <div>Cant fetch class</div>;
  }
}
