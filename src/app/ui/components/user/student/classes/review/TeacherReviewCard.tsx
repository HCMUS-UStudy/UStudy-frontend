import React from "react";
import TeacherCriteriaReview from "./TeacherCriteriaReview";
import { Button } from "@/app/ui/components/_common/Button";

interface Teacher {
  id: string;
  name: string;
}

interface CriteriaItem {
  id: string;
  label: string;
}

interface CriteriaGroup {
  title: string;
  items: CriteriaItem[];
}

interface TeacherRating {
  criteria: Record<string, number>;
  comment: string;
}

interface TeacherReviewCardProps {
  teacher: Teacher;
  isActive: boolean;
  teacherStep: "rating" | "comment";
  teacherCriteria: CriteriaGroup[];
  ratings: TeacherRating;
  renderStars: (
    rating: number,
    onRate: (rating: number) => void,
  ) => JSX.Element;
  onRate: (teacherId: string, criteriaId: string, rating: number) => void;
  onNextStep: (teacherId: string, step: "rating" | "comment") => void;
  onPreviousStep: () => void;
  onCommentChange: (teacherId: string, comment: string) => void;
  onGoToNextTeacher: (teacherId: string) => void;
  isLastTeacher: boolean;
  isSubmitting: boolean;
}

export default function TeacherReviewCard({
  teacher,
  isActive,
  teacherStep,
  teacherCriteria,
  ratings,
  renderStars,
  onRate,
  onNextStep,
  onPreviousStep,
  onCommentChange,
  onGoToNextTeacher,
  isLastTeacher,
  isSubmitting,
}: TeacherReviewCardProps) {
  if (!isActive) return null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md overflow-hidden">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="bg-primary-light text-primary-darkest font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-3">
          2
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Đánh giá giáo viên
        </h2>
        <p className="text-gray-500 text-sm italic mb-5">
          Chia sẻ đánh giá chi tiết của bạn về giáo viên
        </p>

        {/* Thông tin giáo viên */}
        <div className="flex items-center gap-4 justify-start w-full">
          <div className="w-12 h-12 rounded-xl bg-primary-dark text-white flex items-center justify-center text-lg font-medium shadow-sm">
            {teacher.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-lg">
              {teacher.name}
            </h3>
          </div>
        </div>

        <div className="w-52 h-1 bg-primary-dark rounded-full mt-5"></div>
      </div>

      {/* Step: Rating */}
      {teacherStep === "rating" && (
        <div className="space-y-6 w-full">
          <TeacherCriteriaReview
            teacherCriteria={teacherCriteria}
            teacherId={teacher.id}
            ratings={ratings.criteria}
            onRate={(criteriaId, rating) =>
              onRate(teacher.id, criteriaId, rating)
            }
            renderStars={renderStars}
          />

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={() => onNextStep(teacher.id, "comment")}
              className="px-6 py-3 bg-primary-dark text-white font-medium rounded-lg shadow-md hover:bg-primary transition-all duration-200 flex items-center"
            >
              Tiếp theo
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Step: Comment */}
      {teacherStep === "comment" && (
        <div className="mt-10">
          <div className="mb-3">
            <label
              htmlFor={`teacher-${teacher.id}-comment`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nhận xét về giáo viên
              <span className="text-xs font-normal text-gray-500 ml-1">
                (không bắt buộc)
              </span>
            </label>
            <p className="text-xs text-gray-500">
              Chia sẻ thêm về cách giảng dạy và tương tác của giáo viên
            </p>
          </div>
          <div className="relative">
            <textarea
              id={`teacher-${teacher.id}-comment`}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-0 focus:ring-primary-dark focus:border-primary-dark transition-all duration-200 resize-none outline-none"
              placeholder={`Ví dụ: Cô ${teacher.name} giảng bài rất dễ hiểu, nhiệt tình giải đáp thắc mắc...`}
              value={ratings.comment || ""}
              onChange={(e) => onCommentChange(teacher.id, e.target.value)}
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
              {ratings.comment?.length || 0}/500
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              onClick={onPreviousStep}
              className="px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-200 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              Quay lại
            </Button>

            <div className="flex gap-3">
              {!isLastTeacher ? (
                <Button
                  onClick={() => onGoToNextTeacher(teacher.id)}
                  className="px-6 py-3 bg-primary-dark border text-white font-medium rounded-lg shadow-sm hover:bg-primary transition-all duration-200"
                >
                  Tiếp theo: Giáo viên tiếp theo
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="px-6 py-3 bg-primary-dark text-white font-medium rounded-lg shadow-md hover:bg-primary transition-all duration-200 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
