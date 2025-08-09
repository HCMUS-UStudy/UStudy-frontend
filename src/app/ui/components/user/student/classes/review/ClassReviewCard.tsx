/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/app/ui/components/_common/Button";
import ClassCriteriaReview from "./ClassCriteriaReview";

interface ClassReviewCardProps {
  classCriteria: any[];
  ratings: any;
  reviewStep: string;
  renderStars: (
    rating: number,
    onRate: (rating: number) => void,
  ) => JSX.Element;
  handleClassCriteriaRating: (criteriaId: string, rating: number) => void;
  handleClassCommentChange: (comment: string) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  addToast: any;
}

export default function ClassReviewCard({
  classCriteria,
  ratings,
  reviewStep,
  renderStars,
  handleClassCriteriaRating,
  handleClassCommentChange,
  handleNextStep,
  handlePreviousStep,
  addToast,
}: ClassReviewCardProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md overflow-hidden">
      {/* Tiêu đề */}
      <div className="relative mb-10">
        <div className="flex flex-col items-center text-center">
          <span className="bg-primary-light text-primary-darkest font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-3">
            1
          </span>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Đánh giá chung về lớp học
          </h2>
          <p className="text-gray-500 text-sm italic">
            Chia sẻ trải nghiệm tổng quan của bạn về khóa học
          </p>
        </div>

        <div className="flex justify-center mt-5">
          <div className="w-52 h-1 bg-primary-dark rounded-full"></div>
        </div>
      </div>

      {/* Bước đánh giá */}
      <div
        className={`space-y-6 mb-8 transition-all duration-300 ${
          reviewStep === "rating" ? "block" : "hidden"
        }`}
      >
        <ClassCriteriaReview
          criteria={classCriteria}
          ratings={ratings.class.criteria}
          onRate={handleClassCriteriaRating}
          renderStars={renderStars}
        />

        {/* Nút tiếp theo */}
        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-3 bg-primary-dark text-white font-medium rounded-lg shadow-md hover:bg-primary transition-all duration-200 flex items-center"
          >
            Tiếp theo
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

      {/* Bước comment */}
      <div className={`mt-12 ${reviewStep === "comment" ? "block" : "hidden"}`}>
        <div className="mb-4">
          <label
            htmlFor="classComment"
            className="flex text-base font-medium text-gray-800 mb-2 items-center"
          >
            <svg
              className="w-5 h-5 text-primary-darkest mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            Nhận xét thêm về lớp học
            <span className="text-sm font-normal text-gray-500 ml-2">
              (không bắt buộc)
            </span>
          </label>
          <p className="text-sm text-gray-500 ml-7 mb-3">
            Chia sẻ thêm về trải nghiệm của bạn để chúng tôi có thể cải thiện
          </p>
        </div>
        <div className="relative">
          <textarea
            id="classComment"
            rows={4}
            className="w-full px-6 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-0 focus:ring-primary-dark focus:border-primary-dark transition-all duration-200 resize-none pl-8 outline-none"
            placeholder="Ví dụ: Tôi thấy khóa học rất bổ ích, giáo viên nhiệt tình..."
            value={ratings.class.comment}
            onChange={(e) => handleClassCommentChange(e.target.value)}
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
            {ratings.class.comment.length}/500
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            onClick={handlePreviousStep}
            className="px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-200 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
          <div className="ml-auto">
            <Button
              type="button"
              onClick={
                reviewStep === "rating"
                  ? handleNextStep
                  : () => {
                      addToast.success(
                        "Đánh giá thành công: Đánh giá của bạn đã được gửi thành công",
                      );
                    }
              }
              className="px-6 py-3 bg-primary-dark text-black font-medium rounded-lg shadow-md hover:bg-primary transition-all duration-200 flex items-center"
            >
              {reviewStep === "rating" ? "Tiếp theo" : "Gửi đánh giá"}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
      </div>
    </div>
  );
}
