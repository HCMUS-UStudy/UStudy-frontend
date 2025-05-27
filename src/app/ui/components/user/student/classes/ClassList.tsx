"use client";
import React from "react";
import StudentClassesLoading from "../../../_common/loading/StudentClassesLoading";
import EmptyListOrTable from "../../../_common/EmptyListOrTable";
import { ClassRegisterResponseItem, UserClassData } from "@/app/types";
import { Button } from "../../../_common/Button";
import { useRouter } from "next/navigation";

export interface Course {
  name?: string;
}

export interface Grade {
  name?: string;
}

export interface Teacher {
  name?: string;
}

export interface ClassListProps {
  // status: "pending" | "success" | "error";
  isLoading: boolean;
  classes?: UserClassData;
  onDetailClick?: (id: string) => void;
  renderAction?: (classItem: ClassRegisterResponseItem) => React.ReactNode;
  type?: "grid" | "row";
}

const ClassList: React.FC<ClassListProps> = ({
  isLoading,
  classes,
  type = "grid",
}) => {
  const router = useRouter();
  const handleDetail = (id: string) => {
    router.push(`/member/classes/${id}`);
  };

  if (isLoading) {
    return <StudentClassesLoading />;
  }

  if (classes?.totalElements && classes.totalElements > 0) {
    return (
      <div
        className={
          type === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {classes?.content.map((classItem) => (
          <div
            key={classItem.id}
            className={`flex items-center bg-gradient-to-r from-white to-green-50 border border-gray-200 p-6 rounded-lg transition-all transform hover:shadow-md ${type === "row" ? "w-full" : ""}`}
          >
            <div className="w-14 h-14 rounded-full bg-primary-lighter text-primary-dark flex items-center justify-center font-extrabold text-lg mr-6">
              {classItem.course?.name.charAt(0) || "?"}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-gray-700 mb-1">
                {classItem?.course?.name
                  ? `Lớp ${classItem.name} - ${classItem?.course?.name} ${classItem?.grade?.name}`
                  : classItem.name}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Giáo viên:</strong>{" "}
                {/* {classItem?.teacher?.name ||
                    "Chưa có giáo viên"} */}
              </p>
              {/* <p className="text-sm text-gray-600">
                  <strong>Phòng học:</strong> {classItem.room.name}
                </p> */}
            </div>
            <Button
              className="px-4 py-2 text-sm rounded-full"
              onClick={() => {
                handleDetail(classItem.id);
              }}
            >
              Xem chi tiết
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return <EmptyListOrTable message="Hiện đang không có lớp học" />;
};

export default ClassList;
