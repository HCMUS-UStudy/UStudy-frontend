"use client";

import React, { useState } from "react";
import RegisterClassesLoading from "../../../_common/loading/RegisterClassesLoading";
import EmptyListOrTable from "../../../_common/EmptyListOrTable";
import { ClassToRegisterItem, ClassToRegisterResponse } from "@/app/types";
import { SiGoogleclassroom } from "react-icons/si";
import { Button } from "../../../_common/Button";
import { CheckCircle, ChevronRight, Star, StarHalf } from "lucide-react";
import { IoWarning } from "react-icons/io5";
import CourseRatingModal from "../class-register/CourseRatingModal";

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
  classes?: ClassToRegisterResponse;
  onDetailClick?: (id: string) => void;
  renderAction?: (classItem: ClassToRegisterItem) => React.ReactNode;
  onPaymentClick?: (classItem: ClassToRegisterItem) => void;
  paymentPendingId: string | null;
  courseId?: string;
  gradeId?: string;
}

const RegisterClassesGrid: React.FC<ClassListProps> = ({
  status,
  classes,
  renderAction,
  onPaymentClick,
  paymentPendingId,
  courseId,
  gradeId,
}) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    id: string;
    name: string;
    courseId: string;
    gradeId: string;
  } | null>(null);

  const handleViewRatings = (classItem: ClassToRegisterItem) => {
    const selectedCourseId = classItem.classDto.course?.id || courseId || "";
    const selectedGradeId = classItem.classDto.grade?.id || gradeId || "";

    if (!selectedCourseId || !selectedGradeId) {
      console.error("Missing courseId or gradeId");
      return;
    }

    setSelectedClass({
      id: classItem.classDto.id,
      name: classItem.classDto.name,
      courseId: selectedCourseId,
      gradeId: selectedGradeId,
    });
    setIsRatingModalOpen(true);
  };

  if (status === "pending") {
    return <RegisterClassesLoading />;
  }

  if (!classes?.totalElements || classes.content.length === 0) {
    return <EmptyListOrTable message="Hiện đang không có lớp học" />;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.content.map((classItem) => (
          <div
            key={classItem.classDto.id}
            className="relative overflow-hidden bg-white border-2 border-slate-200 flex flex-col justify-between gap-3 px-9 py-5 space-y-3 rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <div className="w-20 h-20 md:w-24 md:h-24 flex justify-center items-center bg-primary-dark rounded-full absolute -right-5 -top-7">
                <p className="absolute bottom-6 left-7 text-white text-base lg:text-2xl font-bold">
                  {classItem.classDto.grade.name.split(" ")[1] ?? "?"}
                </p>
              </div>

              <SiGoogleclassroom className="size-8 lg:size-12 text-primary-dark" />
              <h1 className="font-bold text-base lg:text-xl">
                {classItem.classDto.name} -{" "}
                {classItem.classDto.course?.name ?? "Không tên"} -{" "}
                {classItem.classDto.grade?.name ?? ""}
              </h1>
              {classItem.classDto.description ? (
                <p className="text-sm text-zinc-500 leading-6 truncate">
                  Lớp {classItem.classDto.course?.name} -{" "}
                  {classItem.classDto.description}
                </p>
              ) : (
                <p className="text-sm text-zinc-500 leading-6 truncate">
                  Lớp {classItem.classDto.course?.name}
                </p>
              )}

              <div className="flex items-center gap-2 justify-between">
                {classItem.ratingOverview.rating &&
                classItem.ratingOverview.rating > 0 ? (
                  <>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const rating = classItem.ratingOverview.rating ?? 0;
                        if (idx + 1 <= Math.floor(rating)) {
                          return (
                            <Star
                              key={idx}
                              className="size-4 fill-yellow-400 text-yellow-400"
                            />
                          );
                        }
                        if (idx < rating && rating % 1 >= 0.5) {
                          return (
                            <StarHalf
                              key={idx}
                              className="size-4 fill-yellow-400 text-yellow-400"
                            />
                          );
                        }
                        return (
                          <Star key={idx} className="size-4 text-gray-300" />
                        );
                      })}
                      <span className="text-sm text-gray-500 ml-1">
                        ({classItem.ratingOverview.numRatings})
                      </span>
                    </div>

                    <Button
                      variant="outlined"
                      className="mt-2 w-fit text-xs px-3 py-1 border-primary-dark text-primary-dark hover:bg-primary-light"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRatings(classItem);
                      }}
                    >
                      Xem đánh giá
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-gray-400 italic mt-1">
                    Chưa có đánh giá
                  </span>
                )}
              </div>

              {/* Hiển thị đánh giá sao */}
            </div>
            {!classItem.payment ? (
              renderAction && renderAction(classItem)
            ) : classItem.payment.status === "PENDING" ? (
              <div className="flex flex-col gap-2">
                <Button
                  className="text-sm text-primary-darkest group relative overflow-hidden"
                  onClick={() => onPaymentClick?.(classItem)}
                  isPending={paymentPendingId === classItem.classDto.id}
                  variant="outlined"
                >
                  <div className="flex items-center gap-2">
                    <span className="absolute inset-0 flex items-center justify-center bg-white">
                      <p className="text-primary-darkest text-sm transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                        Thanh toán ngay
                      </p>
                    </span>
                    <span className="flex items-center gap-2">
                      <p className="text-primary-darkest text-sm transform translate-x-0 opacity-100 group-hover:-translate-x-full group-hover:opacity-0 transition-all duration-300 ease-in-out">
                        Đã đăng ký - Chờ thanh toán
                      </p>
                      <ChevronRight className="size-5 transform translate-x-0 group-hover:translate-x-5 transition-transform duration-300 ease-in-out" />
                    </span>
                  </div>
                </Button>
              </div>
            ) : classItem.payment.status === "COMPLETED" ? (
              <>
                <div className="flex gap-2 items-center text-green-600">
                  <CheckCircle className="size-8" />
                  <p className=" font-medium">Đã đăng ký thành công</p>
                </div>
              </>
            ) : (
              classItem.payment.status === "OVERDUE" && (
                <div className="flex gap-2 items-center text-error">
                  <IoWarning className="size-8" />
                  <p className=" font-medium">Quá hạn thanh toán</p>
                </div>
              )
            )}
          </div>
        ))}
      </div>
      {selectedClass && (
        <CourseRatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          courseId={selectedClass.courseId}
          gradeId={selectedClass.gradeId}
          className={selectedClass.name}
        />
      )}
    </>
  );
};

export default RegisterClassesGrid;
