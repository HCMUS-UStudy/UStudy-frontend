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
  status: "pending" | "success" | "error";
  classes?: UserClassData;
  onDetailClick?: (id: string) => void;
  renderAction?: (classItem: ClassRegisterResponseItem) => React.ReactNode;
}

const ClassList: React.FC<ClassListProps> = ({ status, classes }) => {
  const router = useRouter();
  const handleDetail = (id: string) => {
    router.push(`/member/classes/${id}`);
  };

  if (status === "pending") {
    return <StudentClassesLoading />;
  }

  if (classes?.totalElements && classes.totalElements > 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes?.content.map((classItem) => (
          <div
            key={classItem.id}
            className="flex items-center bg-gradient-to-r from-white to-green-50 border border-gray-200 p-6 rounded-2xl transition-all transform hover:shadow-md"
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
              className="px-4 py-2 bg-primary-dark text-white text-sm rounded-full hover:bg-hover-primary"
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
