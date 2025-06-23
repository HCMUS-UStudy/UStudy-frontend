import React, { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../../_common/Dialog";
import { Select, SelectItem } from "../../../_common/Select";
import { useQueries } from "@tanstack/react-query";
import { getAllGrades, getCoursesByGradeId } from "@/app/lib/services";
import { Button } from "../../../_common/Button";

interface Props {
  gradeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { gradeId: string; courseId: string }) => void;
}

const GradeAndCourseSelector = ({
  gradeId,
  isOpen,
  onClose,
  onSave,
}: Props) => {
  const [selectedData, setSelectedData] = useState<{
    gradeId: string;
    courseId: string;
  }>({
    gradeId,
    courseId: "",
  });
  const [message, setMessage] = useState<string>("");

  const results = useQueries({
    queries: [
      {
        queryKey: ["Grades"],
        queryFn: () => getAllGrades("", 100, 0),
      },
      {
        queryKey: ["Courses", selectedData.gradeId],
        queryFn: () => getCoursesByGradeId(selectedData.gradeId),
        enabled: !!selectedData.gradeId,
      },
    ],
  });
  const grades = results[0];
  const courses = results[1];

  const handleSave = () => {
    if (!selectedData.courseId) {
      setMessage("Vui lòng chọn môn học");
      return;
    }
    if (
      !courses.data?.content.some((item) => item.id === selectedData.courseId)
    ) {
      setMessage("Môn học hiện đang không có trong khối này");
      return;
    }
    onSave(selectedData);
    onClose();
  };

  return (
    <Dialog className="w-1/4" isOpen={isOpen} onClose={onClose}>
      <DialogHeader>Thay đổi khối và môn học</DialogHeader>
      <DialogContent className="flex flex-col gap-4">
        <Select
          defaultLabel="Chọn khối học"
          label="Chọn khối học"
          defaultValue={selectedData.gradeId}
          onValueChange={(value) => {
            setSelectedData({
              gradeId: value as string,
              courseId: "",
            });
          }}
          showClearButton={false}
        >
          {grades.data?.content.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </Select>
        {courses.data?.totalElements === 0 ? (
          <div className="px-3 py-2 text-error text-sm border border-error rounded-md">
            Chưa có môn học cho khối này
          </div>
        ) : (
          <Select
            defaultLabel="Chọn môn học tương ứng"
            label="Chọn môn học tương ứng"
            defaultValue={selectedData.courseId}
            onValueChange={(value) => {
              setSelectedData((prev) => ({
                ...prev,
                courseId: value as string,
              }));
              setMessage("");
            }}
            isLoading={courses.status === "pending"}
            showClearButton={false}
          >
            {courses.data?.content.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </Select>
        )}
        {message && (
          <div className="px-3 py-2 text-error text-sm border border-error rounded-md">
            {message}
          </div>
        )}
      </DialogContent>
      <DialogFooter className="mt-20 w-full">
        <Button onClick={handleSave} className="w-full">
          Xác nhận
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default memo(GradeAndCourseSelector);
