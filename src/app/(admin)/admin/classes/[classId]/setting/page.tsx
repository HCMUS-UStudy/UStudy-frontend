"use client";

import React, { useCallback } from "react";

import {
  QueryClient,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";

import ClassSettingLoading from "@/app/ui/components/_common/loading/ClassSettingLoading";
import { useEncodedRoute } from "@/app/lib/hooks";
import { useParams } from "next/navigation";
import {
  getAllCourses,
  getAllGrades,
  getClassById,
  updateClass,
  updateSchedule,
} from "@/app/lib/services";
import ClassForm from "@/app/ui/components/admin/classes/setting/ClassForm";
import { ClassSchema, UpdateSchedule } from "@/app/types";
import { toast } from "react-toastify";
import ClassSessions from "@/app/ui/components/admin/classes/setting/ClassSessions";

export type UpdateClassType = Pick<
  ClassSchema,
  "name" | "description" | "courseId" | "gradeId" | "fee"
>;

export default function ClassSetting() {
  const params = useParams<{ classId: string }>();
  const { decodeId } = useEncodedRoute();
  const classId = decodeId(params?.classId as string);

  const queryClient = new QueryClient();

  const { data: classDetail, status } = useQuery({
    queryKey: ["ClassDetails", classId],
    queryFn: () => getClassById(classId),
    enabled: !!classId,
  });

  const results = useQueries({
    queries: [
      {
        queryKey: ["Courses"],
        queryFn: () => getAllCourses("", 100, 0),
      },
      {
        queryKey: ["Grades"],
        queryFn: () => getAllGrades("", 100, 0),
      },
    ],
  });
  const grades = results[1].data;
  const courses = results[0].data;

  const updateClassMutation = useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: UpdateClassType;
    }) => updateClass(classId, data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["ClassDetails"] });
      toast.success("Chỉnh sửa lớp học thành công", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    },
  });

  const handleUpdate = useCallback(
    ({ classId, data }: { classId: string; data: UpdateClassType }) => {
      console.log("here");
      updateClassMutation.mutate({ classId, data });
    },
    [],
  );

  const updateScheduleMutation = useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: UpdateSchedule;
    }) => updateSchedule({ classId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ClassDetails"] });
      toast.success("Chỉnh sửa lớp học thành công", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    },
  });

  const handleUpdateSchedule = useCallback(
    ({ classId, data }: { classId: string; data: UpdateSchedule }) => {
      updateScheduleMutation.mutate({ classId, data });
    },
    [],
  );

  if (status === "pending") {
    return <ClassSettingLoading />;
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
          <ClassSessions
            classSessions={classDetail.classSessions}
            handleUpdateSchedule={handleUpdateSchedule}
          />
        </div>
      </>
    );
  } else {
    <div>Cant fetch class</div>;
  }
}
