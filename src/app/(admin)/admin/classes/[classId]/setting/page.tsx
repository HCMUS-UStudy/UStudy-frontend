"use client";

import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import { Button } from "@/app/ui/components/_common/Button";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import TextArea from "@/app/ui/components/_common/text-field/TextArea";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { getClassById, updateClass } from "@/app/lib/services/class";
import { convertToVietnameseText, daysInWeekMap } from "@/app/lib/utils";
import { Check, Edit, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import { useAppSelector } from "@/app/store/store";
import { getSessionByBranchId } from "@/app/lib/services/session";
import ClassSettingLoading from "@/app/ui/components/_common/loading/ClassSettingLoading";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEncodedRoute } from "@/app/lib/hooks";
import { useParams } from "next/navigation";
// import { classSessions } from "@/app/types";
// import { getAvailableRooms } from "@/app/lib/services/room";

const updateClassSchema = z
  .object({
    name: z.string().min(1, "Tên lớp không được để trống"),
    description: z.string().optional(),
    courseId: z.string().min(1, "Vui lòng chọn môn học"),
    gradeId: z.string().min(1, "Vui lòng chọn khối học"),
    fee: z.number().min(0, "Học phí không được âm"),
    startDate: z.string(),
    endDate: z.string(),
  })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        path: ["endDate"],
      });
    }
  });

export type updateClassFormInputs = z.infer<typeof updateClassSchema>;

export default function ClassSetting() {
  // const params = useParams<{ classId: string }>();
  // const { decryptedId } = useEncodedRoute({ paramName: "classId" });
  // const classId = decryptedId;

  const params = useParams<{ classId: string }>();
  const { decodeId } = useEncodedRoute();
  const classId = decodeId(params?.classId as string);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const selectedBranchId =
    useAppSelector((state) => state.branch.selectedBranchId) ?? "";
  const [fee, setFee] = useState<{
    value: number;
    formatted: string;
    text: string;
  }>({
    value: 0,
    formatted: "",
    text: "",
  });

  // const [selectedClassSession, setSelectedClassSession] =
  //   useState<classSessions>();

  const [isSelectingRoom, setIsSelectingRoom] = useState<boolean>(false);

  const results = useQueries({
    queries: [
      {
        queryKey: ["ClassDetails", classId],
        queryFn: () => getClassById(classId),
      },
      {
        queryKey: ["Sessions", selectedBranchId],
        queryFn: () => getSessionByBranchId(selectedBranchId),
        enabled: selectedBranchId !== null,
      },
      // {
      //   queryKey: ["Rooms"],
      //   queryFn: () =>
      //     getAvailableRooms(
      //       selectedBranchId,
      //       selectedClassSession?.day,
      //       selectedClassSession?.id,
      //       classDetail?.startDate,
      //     ),
      //     enabled: selectedBranchId !== null &&
      // },
    ],
  });
  const classDetail = results[0].data;
  // const sessions = results[1].data;

  console.log(classDetail);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<updateClassFormInputs>({
    resolver: zodResolver(updateClassSchema),
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    if (classDetail) {
      reset({
        name: classDetail.name,
        courseId: classDetail.course.id,
        description: classDetail.description,
        startDate: classDetail.startDate,
        endDate: classDetail.endDate,
        fee: classDetail.fee,
        gradeId: classDetail.grade.id,
      });
      setFee({
        value: classDetail.fee,
        formatted: new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "VND",
        })
          .format(classDetail.fee)
          .replace("VND", "")
          .trim(),
        text: convertToVietnameseText(classDetail.fee),
      });
    }
  }, [classDetail, reset]);

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFee = e.target.value.replace(/[^0-9]/g, "");
    const value = Number(inputFee);
    const formatted = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "VND",
    })
      .format(Number(inputFee))
      .replace("VND", "")
      .trim();

    setFee({ value, formatted, text: convertToVietnameseText(value) });
  };

  // console.log(classDetail);
  const queryClient = useQueryClient();
  const useUpdateClassMutation = useMutation({
    mutationFn: (data: updateClassFormInputs) => updateClass(classId, data),
    onError: (error) => {
      console.log(error);
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
      });
    },
    onSuccess: (res) => {
      console.log(res);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["ClassDetails"] });
      toast.success("Chỉnh sửa lớp học thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
  });

  const onSubmit = (data: updateClassFormInputs) => {
    console.log(data);
    useUpdateClassMutation.mutate({
      name: data.name,
      description: data.description ?? "",
      startDate: data.startDate,
      endDate: data.endDate,
      fee: data.fee,
      courseId: data.courseId,
      gradeId: data.gradeId,
    });
    // console.log(data);
  };

  if (results[0].status === "pending") {
    return <ClassSettingLoading />;
  }

  return (
    <div className=" mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-3 md:flex-row justify-between items-center text-lg md:text-xl">
            <span className="">Thông tin lớp học</span>
            <div className="flex flex-row gap-1 md:gap-3 w-full md:w-auto">
              <Button
                className="flex-1"
                form="edit-class-form"
                disabled={!isEditing}
                isPending={useUpdateClassMutation.status === "pending"}
                type="submit"
              >
                <span className="hidden md:flex">Hoàn tất</span>
                <Check className="flex md:hidden size-5" />
              </Button>
              <Button
                className="md:w-auto flex-1 md:px-5"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                <span className="hidden md:flex text-nowrap">Chỉnh sửa</span>
                <Pencil className="flex md:hidden size-5" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="edit-class-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 mb-3 gap-4 md:gap-8">
              <div className="flex flex-col gap-4 mb-3">
                <Input
                  id="name"
                  disabled={!isEditing}
                  label="Tên lớp"
                  isError={errors.name !== undefined}
                  errorMsg={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  id="course"
                  disabled
                  label="Môn học"
                  isError={errors.courseId !== undefined}
                  errorMsg={errors.courseId?.message}
                  {...register("courseId")}
                />
                <Input
                  id="name"
                  defaultValue={classDetail?.grade.name}
                  disabled
                  label="Khối học"
                  isError={errors.gradeId !== undefined}
                  errorMsg={errors.gradeId?.message}
                  {...register("gradeId")}
                />
                <div className="flex w-full gap-3">
                  <Input
                    id="startDate"
                    className="w-full"
                    defaultValue={new Date(
                      classDetail?.startDate || "",
                    ).toLocaleDateString("VI")}
                    disabled
                    label="Ngày bắt đầu"
                  />
                  <Input
                    id="endDate"
                    className="w-full"
                    defaultValue={new Date(
                      classDetail?.endDate || "",
                    ).toLocaleDateString("VI")}
                    disabled
                    label="Ngày kết thúc"
                  />
                </div>
                <div>
                  <Input
                    id="fee"
                    value={fee.formatted}
                    onChange={handleFeeChange}
                    disabled={!isEditing}
                    isError={errors.fee !== undefined}
                    errorMsg={errors.fee?.message}
                    label="Học phí"
                  />
                  <span className="text-primary-darkest text-sm">
                    {fee.text}
                  </span>
                </div>
              </div>

              <div className="h-full">
                <TextArea
                  id="description"
                  disabled={!isEditing}
                  label="Mô tả lớp học"
                  className="h-full min-h-52 max-h-52 overflow-y-auto"
                  {...register("description")}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Lịch học</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {classDetail?.classSessions.map((session) => (
                  <Card
                    key={session.id}
                    onClick={() => setIsSelectingRoom(true)}
                    className="relative hover:bg-primary-lighter hover:border-primary-dark transition-colors cursor-pointer group"
                  >
                    <div className="absolute flex justify-center items-center w-full h-full group-hover:bg-primary-light/40 transition-all">
                      <Edit className="size-8 md:size-10 text-primary-darkest opacity-0 group-hover:opacity-100 transition-all" />
                    </div>

                    <CardContent className=" pt-6 transition-colors text-sm md:text-base">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Ngày trong tuần:</span>
                          <span>{daysInWeekMap[session.day]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Ca học:</span>
                          <span>{session.session.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Giờ học:</span>
                          <span>
                            {session.session.startTime.slice(0, 5)} -{" "}
                            {session.session.endTime.slice(0, 5)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Phòng học:</span>
                          {session.room ? (
                            <span>{session.room.name}</span>
                          ) : (
                            <span className="text-sm text-error">
                              Chưa có phòng học
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* <div>
                  <Tooltip text="Thêm ca học mới" position="top">
                    <Plus
                      className="size-10 border-2 border-slate-200 hover:border-primary p-1 text-gray-700 hover:text-primary-darker rounded-lg cursor-pointer hover:bg-primary-lighter transition-all"
                      // onClick={() => setIsAddingSession(true)}
                    />
                  </Tooltip>
                </div> */}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* <Dialog
        isOpen={isAddingSession}
        onClose={() => setIsAddingSession(false)}
        className="w-1/4"
      >
        <DialogHeader>Thêm ca học mới</DialogHeader>
        <DialogContent className="h-52">
          <div className="space-y-4">
            <Select
              defaultValue={selectedDay || ""}
              onValueChange={(value: string | number) =>
                setNewSessionsRoom((prev) => ({
                  ...prev,
                  day: value as DaysInWeek,
                }))
              }
              label="Chọn thứ"
            >
              {Object.entries(daysInWeekMap).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </Select>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn ca học</label>
              <Selector
                items={
                  sessions?.map((session) => ({
                    id: session.id,
                    label: `${session.session.name} (${session.session.startTime.slice(0, 5)} - ${session.session.endTime.slice(0, 5)})`,
                    value: session.id,
                  })) || []
                }
                className="w-full"
                selectedValue={selectedSession}
                onChange={(value) => setSelectedSession(value as string)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
      <Dialog
        className="h-1/2"
        isOpen={isSelectingRoom}
        onClose={() => setIsSelectingRoom(false)}
      >
        <DialogHeader>Chọn phòng học</DialogHeader>
        <DialogContent>
          <Select>
            <SelectItem value={1}>Phòng 1</SelectItem>
            <SelectItem value={1}>Phòng 1</SelectItem>
            <SelectItem value={1}>Phòng 1</SelectItem>
          </Select>
        </DialogContent>
      </Dialog>
    </div>
  );
}
