"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/app/ui/components/_common/Button";
import { FaStar, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { useCustomToast } from "@/app/lib/hooks/useToast";

interface Teacher {
  id: string;
  name: string;
  role: string;
  criteria: {
    id: string;
    label: string;
  }[];
}

interface CriteriaRating {
  [key: string]: number;
}

const ReviewPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState<"class" | string>("class");
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);
  const router = useRouter();
  const { classId } = useParams<{ classId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewStep, setReviewStep] = useState<"rating" | "comment">("rating");
  const [teacherSteps, setTeacherSteps] = useState<
    Record<string, "rating" | "comment">
  >({});

  const [ratings, setRatings] = useState<{
    teachers: {
      [teacherId: string]: {
        criteria: CriteriaRating;
        comment: string;
      };
    };
    class: {
      criteria: CriteriaRating;
      comment: string;
    };
  }>({
    teachers: {},
    class: {
      criteria: {
        contentQuality: 0,
        teachingMethod: 0,
        facility: 0,
        support: 0,
      },
      comment: "",
    },
  });

  const teachers = React.useMemo<Teacher[]>(
    () => [
      {
        id: "1",
        name: "Nguyễn Văn A",
        role: "Giáo viên chính",
        criteria: [
          { id: "knowledge", label: "Kiến thức chuyên môn" },
          { id: "teachingMethod", label: "Phương pháp giảng dạy" },
          { id: "enthusiasm", label: "Nhiệt tình giảng dạy" },
          { id: "support", label: "Hỗ trợ học viên" },
        ],
      },
      {
        id: "2",
        name: "Trần Thị B",
        role: "Trợ giảng",
        criteria: [
          { id: "support", label: "Hỗ trợ học viên" },
          { id: "responsiveness", label: "Phản hồi nhanh chóng" },
          { id: "knowledge", label: "Kiến thức chuyên môn" },
        ],
      },
    ],
    [],
  );

  const classCriteria = [
    { id: "contentQuality", label: "Chất lượng nội dung khóa học" },
    { id: "teachingMethod", label: "Phương pháp giảng dạy" },
    { id: "facility", label: "Cơ sở vật chất" },
    { id: "support", label: "Hỗ trợ từ trung tâm" },
  ];

  const { addToast } = useCustomToast();

  const handleTeacherCriteriaRating = (
    teacherId: string,
    criteriaId: string,
    rating: number,
  ) => {
    setRatings((prev) => {
      const teacherRatings = { ...prev.teachers };
      if (!teacherRatings[teacherId]) {
        teacherRatings[teacherId] = { criteria: {}, comment: "" };
      }
      teacherRatings[teacherId].criteria[criteriaId] = rating;
      return { ...prev, teachers: teacherRatings };
    });
  };

  const handleClassCriteriaRating = (criteriaId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      class: {
        ...prev.class,
        criteria: {
          ...prev.class.criteria,
          [criteriaId]: rating,
        },
      },
    }));
  };

  const handleTeacherCommentChange = (teacherId: string, comment: string) => {
    setRatings((prev) => {
      const teacherRatings = { ...prev.teachers };
      if (!teacherRatings[teacherId]) {
        teacherRatings[teacherId] = { criteria: {}, comment: "" };
      }
      teacherRatings[teacherId].comment = comment;
      return { ...prev, teachers: teacherRatings };
    });
  };

  const handleClassCommentChange = (comment: string) => {
    setRatings((prev) => ({
      ...prev,
      class: {
        ...prev.class,
        comment,
      },
    }));
  };

  const validateRatings = (
    type: "class" | "teacher" = "class",
    suppressToast = false,
  ) => {
    if (type === "class") {
      const allClassCriteriaRated = Object.values(ratings.class.criteria).every(
        (rating) => rating > 0,
      );
      if (!allClassCriteriaRated) {
        if (!suppressToast) {
          addToast.error(
            "Vui lòng đánh giá đầy đủ các tiêu chí trước khi tiếp tục",
          );
        }
        return false;
      }
    } else if (activeTeacherId) {
      const teacher = teachers.find((t) => t.id === activeTeacherId);
      if (teacher) {
        const teacherRating = ratings.teachers[teacher.id];
        const allTeacherCriteriaRated =
          teacherRating &&
          Object.keys(teacherRating.criteria).length ===
            teacher.criteria.length &&
          Object.values(teacherRating.criteria).every((rating) => rating > 0);

        if (!allTeacherCriteriaRated) {
          if (!suppressToast) {
            addToast.error(
              "Vui lòng đánh giá đầy đủ các tiêu chí trước khi tiếp tục",
            );
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (activeTab === "class") {
      if (!validateRatings("class")) return;
      setReviewStep("comment");
    } else if (activeTeacherId) {
      if (!validateRatings("teacher")) return;
      setTeacherSteps((prev) => ({
        ...prev,
        [activeTeacherId]: "comment",
      }));
    }
  };

  const handlePreviousStep = () => {
    if (activeTab === "class") {
      setReviewStep("rating");
    } else if (activeTeacherId) {
      setTeacherSteps((prev) => ({
        ...prev,
        [activeTeacherId]: "rating",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submission
    const allTeachersRated = teachers.every((teacher) => {
      const teacherRating = ratings.teachers[teacher.id];
      return (
        teacherRating &&
        Object.keys(teacherRating.criteria).length === teacher.criteria.length
      );
    });

    const allClassCriteriaRated = Object.values(ratings.class.criteria).every(
      (rating) => rating > 0,
    );

    if (!allTeachersRated || !allClassCriteriaRated) {
      addToast.error("Vui lòng đánh giá đầy đủ các tiêu chí trước khi gửi");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/classes/${classId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherRatings: Object.entries(ratings.teachers).map(
            ([teacherId, rating]) => ({
              teacherId,
              rating: rating.criteria,
              comment: rating.comment,
            }),
          ),
          classRating: ratings.class.criteria,
          classComment: ratings.class.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      addToast.success("Đã gửi đánh giá thành công!");
      setIsSubmitted(true);

      // Redirect back to class page after 1.5 seconds
      setTimeout(() => {
        router.push(`/member/classes/${classId}`);
      }, 1500);
    } catch (error) {
      console.error("Error submitting review:", error);
      addToast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize teacher steps and set first teacher as active
  useEffect(() => {
    if (teachers.length > 0) {
      // Initialize steps for each teacher
      const initialSteps: Record<string, "rating" | "comment"> = {};
      teachers.forEach((teacher) => {
        initialSteps[teacher.id] = "rating";
      });
      setTeacherSteps(initialSteps);

      // Set first teacher as active if none is set
      if (!activeTeacherId) {
        setActiveTeacherId(teachers[0].id);
      }
    }
  }, [teachers]);

  const renderStars = (
    ratingValue: number,
    onChange?: (rating: number) => void,
  ) => {
    const handleClick = (star: number) => {
      if (onChange) {
        onChange(star);
      }
    };

    const handleMouseEnter = () => {
      if (onChange) {
        document.body.style.cursor = "pointer";
      }
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = "default";
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`relative w-8 h-8 flex items-center justify-center transition-all duration-200 ${
              star <= ratingValue
                ? "text-yellow-400 scale-110"
                : "text-gray-200 hover:text-yellow-300"
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <FaStar className="absolute inset-0 w-full h-full" />
            <span className="text-xs font-semibold text-white absolute">
              {star}
            </span>
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-500">
          {ratingValue > 0 ? `${ratingValue}.0/5.0` : "Chưa đánh giá"}
        </span>
      </div>
    );
  };

  const renderTeacherTab = (teacher: Teacher) => {
    const isActive = activeTeacherId === teacher.id;

    return (
      <button
        key={teacher.id}
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 border ${
          isActive
            ? "bg-primary-light border-primary-200"
            : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
        }`}
        onClick={() => {
          setActiveTab("teacher");
          setActiveTeacherId(teacher.id);
          validateRatings("teacher", true); // suppress toast khi chuyển giáo viên
        }}
      >
        {/* Avatar chữ cái đầu */}
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${
            isActive
              ? "bg-primary-200 text-primary-800"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {teacher.name.charAt(0).toUpperCase()}
        </div>

        {/* Thông tin */}
        <div className="flex flex-col text-left">
          <span
            className={`text-sm font-medium ${
              isActive ? "text-primary-900" : "text-gray-800"
            }`}
          >
            {teacher.name}
          </span>
          <span className="text-xs text-gray-500">{teacher.role}</span>
        </div>
      </button>
    );
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
          <div className="bg-primary p-8 text-center text-white">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <FaCheckCircle className="text-4xl text-white" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Đánh giá thành công!
            </h1>
            <p className="text-white/90 max-w-md mx-auto">
              Cảm ơn bạn đã dành thời gian đánh giá khóa học. Ý kiến của bạn rất
              quý giá với chúng tôi.
            </p>
          </div>
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đánh giá đã được gửi
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Chúng tôi sẽ xem xét đánh giá của bạn để không ngừng cải thiện
              chất lượng đào tạo.
            </p>
            <Button
              onClick={() => router.push(`/member/classes/${classId}`)}
              className="px-8 py-3 bg-primary hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Quay lại lớp học
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto"
      >
        {/* Left sidebar - Navigation */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6 transition-all duration-300 hover:shadow-lg"
          >
            {/* Tiêu đề */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-primary-500" />
                Các phần đánh giá
              </h3>

              {/* Tabs */}
              <div className="space-y-4 pl-2">
                {/* Tab 1 */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center cursor-pointer group"
                  onClick={() => {
                    setActiveTab("class");
                    validateRatings("class", true); // suppress toast khi chuyển tab
                  }}
                >
                  <motion.div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm transition-colors duration-200 ${
                      activeTab === "class"
                        ? "bg-primary-darker text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-darkest"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    1
                  </motion.div>
                  <span
                    className={`ml-3 text-sm font-medium transition-colors duration-200 ${
                      activeTab === "class"
                        ? "text-primary-darkest"
                        : "text-gray-700 group-hover:text-primary-darkest"
                    }`}
                  >
                    Đánh giá lớp học
                  </span>
                </motion.div>

                {/* Divider */}
                <div className="h-4 w-0.5 bg-gray-200 ml-4 my-1"></div>

                {/* Tab 2 */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center cursor-pointer group"
                  onClick={() => {
                    setActiveTab(teachers[0]?.id || "class");
                    validateRatings("teacher", true); // suppress toast khi chuyển tab
                  }}
                >
                  <motion.div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm transition-colors duration-200 ${
                      activeTab !== "class"
                        ? "bg-primary-darker text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-darkest"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    2
                  </motion.div>
                  <span
                    className={`ml-3 text-sm font-medium transition-colors duration-200 ${
                      activeTab !== "class"
                        ? "text-primary-darkest"
                        : "text-gray-500 group-hover:text-primary-darkest"
                    }`}
                  >
                    Đánh giá giảng viên
                  </span>
                </motion.div>
              </div>
            </div>

            {activeTab !== "class" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-primary-darkest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  Giáo viên
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Chọn giáo viên để đánh giá
                </p>
                <div className="space-y-2">
                  {teachers.map((teacher, index) => (
                    <motion.div
                      key={teacher.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      {renderTeacherTab(teacher)}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Main content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {activeTab === "class" ? (
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

                {/* Thanh ngang */}
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
                {classCriteria.map((criteria, index) => (
                  <div
                    key={criteria.id}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    style={{
                      transform: `translateY(${index * 2}px)`,
                      opacity: 1 - index * 0.05,
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                      <div className="flex-1 w-full max-w-3xl">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-8 h-8 rounded-lg bg-primary-lighter flex items-center justify-center text-primary-darkest flex-shrink-0">
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-gray-900">
                            {criteria.label}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 ml-11">
                          Chọn mức độ hài lòng của bạn
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {renderStars(
                          ratings.class.criteria[criteria.id] || 0,
                          (rating) =>
                            handleClassCriteriaRating(criteria.id, rating),
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Nút tiếp theo ở bước rating */}
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

              {/* Bước comment */}
              <div
                className={`mt-12 ${
                  reviewStep === "comment" ? "block" : "hidden"
                }`}
              >
                <div className="mb-4">
                  <label
                    htmlFor="classComment"
                    className="block text-base font-medium text-gray-800 mb-2 items-center"
                  >
                    <svg
                      className="w-5 h-5 text-primary-darkest mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Chia sẻ thêm về trải nghiệm của bạn để chúng tôi có thể cải
                    thiện
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
              </div>
            </div>
          ) : (
            <div className="space-y-6 w-full">
              {teachers.map((teacher) => (
                <div key={teacher.id}>
                  {activeTeacherId === teacher.id && (
                    <>
                      {/* Thông tin giáo viên */}
                      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                        <div className="mb-8 flex flex-col items-center text-center">
                          {/* Icon số bước */}
                          <span className="bg-primary-light text-primary-darkest font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-3">
                            2
                          </span>

                          {/* Tiêu đề */}
                          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                            Đánh giá giáo viên
                          </h2>

                          {/* Mô tả */}
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
                              <p className="text-sm text-gray-500 flex items-center mt-0.5">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary-darkest">
                                  {teacher.role}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Thanh gạch ngang */}
                          <div className="w-52 h-1 bg-primary-dark rounded-full mt-5"></div>
                        </div>
                      </div>

                      {/* Bước đánh giá giáo viên */}
                      <div
                        className={`space-y-6 w-full ${
                          teacherSteps[teacher.id] === "rating"
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        {teacher.criteria.map((criteria) => (
                          <div
                            key={`${teacher.id}-${criteria.id}`}
                            className="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {criteria.label}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  Chọn số sao phù hợp với đánh giá của bạn
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                {renderStars(
                                  ratings.teachers[teacher.id]?.criteria[
                                    criteria.id
                                  ] || 0,
                                  (rating) =>
                                    handleTeacherCriteriaRating(
                                      teacher.id,
                                      criteria.id,
                                      rating,
                                    ),
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Nút tiếp theo */}
                        <div className="mt-8 flex justify-end">
                          <Button
                            type="button"
                            onClick={() =>
                              setTeacherSteps((prev) => ({
                                ...prev,
                                [teacher.id]: "comment",
                              }))
                            }
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

                      {/* Bước comment giáo viên */}
                      <div
                        className={`mt-10 ${
                          teacherSteps[teacher.id] === "comment"
                            ? "block"
                            : "hidden"
                        }`}
                      >
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
                            Chia sẻ thêm về cách giảng dạy và tương tác của giáo
                            viên
                          </p>
                        </div>
                        <div className="relative">
                          <textarea
                            id={`teacher-${teacher.id}-comment`}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-0 focus:ring-primary-dark focus:border-primary-dark transition-all duration-200 resize-none outline-none"
                            placeholder={`Ví dụ: Cô ${teacher.name} giảng bài rất dễ hiểu, nhiệt tình giải đáp thắc mắc...`}
                            value={ratings.teachers[teacher.id]?.comment || ""}
                            onChange={(e) =>
                              handleTeacherCommentChange(
                                teacher.id,
                                e.target.value,
                              )
                            }
                            maxLength={500}
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                            {ratings.teachers[teacher.id]?.comment?.length || 0}
                            /500
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
                            {teachers[teachers.length - 1]?.id !==
                            teacher.id ? (
                              <Button
                                onClick={() => {
                                  const currentIndex = teachers.findIndex(
                                    (t) => t.id === teacher.id,
                                  );
                                  if (currentIndex < teachers.length - 1) {
                                    setActiveTeacherId(
                                      teachers[currentIndex + 1].id,
                                    );
                                    setTeacherSteps((prev) => ({
                                      ...prev,
                                      [teachers[currentIndex + 1].id]: "rating",
                                    }));
                                  }
                                }}
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
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </form>
    </div>
  );
};

export default ReviewPage;
