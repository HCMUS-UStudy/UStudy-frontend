"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaStar, FaInfoCircle } from "react-icons/fa";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import ClassReviewCard from "@/app/ui/components/user/student/classes/review/ClassReviewCard";
import ReviewSuccessHeader from "@/app/ui/components/user/student/classes/review/ReviewSuccessHeader";
import ReviewSuccessBody from "@/app/ui/components/user/student/classes/review/ReviewSuccessBody";
import TeacherReviewCard from "@/app/ui/components/user/student/classes/review/TeacherReviewCard";

interface Teacher {
  id: string;
  name: string;
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
      },
      {
        id: "2",
        name: "Trần Thị B",
      },
    ],
    [],
  );

  const classCriteria = [
    {
      title: "Chất lượng nội dung và tài liệu học",
      items: [
        {
          id: "materialClarity",
          label: "Mức độ đầy đủ, rõ ràng và cập nhật của tài liệu.",
        },
        {
          id: "materialRelevance",
          label: "Tính phù hợp với mục tiêu khóa học và nhu cầu học viên.",
        },
      ],
    },
    {
      title: "Hiệu quả giảng dạy và hỗ trợ của giáo viên",
      items: [
        {
          id: "teachingEffectiveness",
          label: "Khả năng truyền đạt, giải thích vấn đề.",
        },
        {
          id: "teacherSupport",
          label: "Mức độ phản hồi nhanh chóng và hỗ trợ giải đáp thắc mắc.",
        },
      ],
    },
    {
      title: "Trải nghiệm và tính năng của nền tảng học tập",
      items: [
        {
          id: "platformUsability",
          label: "Giao diện dễ dùng, thao tác thuận tiện.",
        },
        {
          id: "platformStability",
          label:
            "Ổn định khi học online (ít giật, lag) và tích hợp tính năng hữu ích (bài tập, bài kiểm tra).",
        },
      ],
    },
    {
      title: "Tương tác và kết quả học tập",
      items: [
        {
          id: "interactionLevel",
          label: "Mức độ tương tác giữa học viên - giáo viên.",
        },
        {
          id: "selfProgress",
          label: "Tiến bộ của bản thân sau khi tham gia lớp học.",
        },
      ],
    },
  ];

  const teacherCriteria = [
    {
      title: "Khả năng truyền đạt và giảng dạy",
      items: [
        {
          id: "teachingClarity",
          label: "Giải thích dễ hiểu, ví dụ minh họa rõ ràng.",
        },
        {
          id: "teachingAdaptability",
          label:
            "Điều chỉnh tốc độ và phương pháp dạy phù hợp với trình độ học viên.",
        },
      ],
    },
    {
      title: "Trình độ chuyên môn và kiến thức",
      items: [
        {
          id: "subjectKnowledge",
          label: "Am hiểu sâu về nội dung môn học.",
        },
        {
          id: "knowledgeUpdate",
          label: "Cập nhật kiến thức mới và áp dụng vào bài giảng.",
        },
      ],
    },
    {
      title: "Tương tác và hỗ trợ học viên",
      items: [
        {
          id: "studentEngagement",
          label: "Chủ động tạo cơ hội cho học viên đặt câu hỏi, thảo luận.",
        },
        {
          id: "supportResponsiveness",
          label: "Phản hồi nhanh và hỗ trợ tận tình khi học viên gặp khó khăn.",
        },
      ],
    },
    {
      title: "Tác phong và thái độ giảng dạy",
      items: [
        {
          id: "teacherAttitude",
          label: "Nhiệt tình, tôn trọng và khích lệ học viên.",
        },
        {
          id: "classManagement",
          label: "Quản lý lớp học hiệu quả, tạo môi trường học tập tích cực.",
        },
      ],
    },
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

  // const validateRatings = (
  //   type: "class" | "teacher" = "class",
  //   suppressToast = false,
  // ) => {
  //   if (type === "class") {
  //     const allClassCriteriaRated = Object.values(ratings.class.criteria).every(
  //       (rating) => rating > 0,
  //     );
  //     if (!allClassCriteriaRated) {
  //       if (!suppressToast) {
  //         addToast.error(
  //           "Vui lòng đánh giá đầy đủ các tiêu chí trước khi tiếp tục",
  //         );
  //       }
  //       return false;
  //     }
  //   } else if (activeTeacherId) {
  //     const teacher = teachers.find((t) => t.id === activeTeacherId);
  //     if (teacher) {
  //       const teacherRating = ratings.teachers[teacher.id];
  //       const totalTeacherCriteriaCount = teacherCriteria.reduce(
  //         (sum, group) => sum + group.items.length,
  //         0,
  //       );
  //       const allTeacherCriteriaRated =
  //         teacherRating &&
  //         Object.keys(teacherRating.criteria).length ===
  //           totalTeacherCriteriaCount &&
  //         Object.values(teacherRating.criteria).every((rating) => rating > 0);

  //       if (!allTeacherCriteriaRated) {
  //         if (!suppressToast) {
  //           addToast.error(
  //             "Vui lòng đánh giá đầy đủ các tiêu chí trước khi tiếp tục",
  //           );
  //         }
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // };

  const handleNextStep = () => {
    if (activeTab === "class") {
      //if (!validateRatings("class")) return;
      setReviewStep("comment");
    } else if (activeTeacherId) {
      //if (!validateRatings("teacher")) return;
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
    const totalTeacherCriteriaCount = teacherCriteria.reduce(
      (sum, group) => sum + group.items.length,
      0,
    );
    const allTeachersRated = teachers.every((teacher) => {
      const teacherRating = ratings.teachers[teacher.id];
      return (
        teacherRating &&
        Object.keys(teacherRating.criteria).length ===
          totalTeacherCriteriaCount &&
        Object.values(teacherRating.criteria).every((rating) => rating > 0)
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
          //validateRatings("teacher", true); // suppress toast khi chuyển giáo viên
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
          <ReviewSuccessHeader />
          <ReviewSuccessBody classId={classId} />
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
                    //validateRatings("class", true); // suppress toast khi chuyển tab
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
                    //validateRatings("teacher", true); // suppress toast khi chuyển tab
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
            <ClassReviewCard
              classCriteria={classCriteria}
              ratings={ratings}
              reviewStep={reviewStep}
              renderStars={renderStars}
              handleClassCriteriaRating={handleClassCriteriaRating}
              handleClassCommentChange={handleClassCommentChange}
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              addToast={addToast}
            />
          ) : (
            <div className="space-y-6 w-full">
              {teachers.map((teacher, index) => (
                <TeacherReviewCard
                  key={teacher.id}
                  teacher={teacher}
                  isActive={activeTeacherId === teacher.id}
                  teacherStep={teacherSteps[teacher.id]}
                  teacherCriteria={teacherCriteria}
                  ratings={ratings.teachers[teacher.id] || {}}
                  renderStars={renderStars}
                  onRate={handleTeacherCriteriaRating}
                  onNextStep={(id, step) =>
                    setTeacherSteps((prev) => ({ ...prev, [id]: step }))
                  }
                  onPreviousStep={handlePreviousStep}
                  onCommentChange={handleTeacherCommentChange}
                  onGoToNextTeacher={(id) => {
                    const currentIndex = teachers.findIndex((t) => t.id === id);
                    if (currentIndex < teachers.length - 1) {
                      setActiveTeacherId(teachers[currentIndex + 1].id);
                      setTeacherSteps((prev) => ({
                        ...prev,
                        [teachers[currentIndex + 1].id]: "rating",
                      }));
                    }
                  }}
                  isLastTeacher={index === teachers.length - 1}
                  isSubmitting={isSubmitting}
                />
              ))}
            </div>
          )}
        </motion.div>
      </form>
    </div>
  );
};

export default ReviewPage;
