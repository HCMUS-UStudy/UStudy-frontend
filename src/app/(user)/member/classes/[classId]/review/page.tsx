"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaStar, FaInfoCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { getClassById } from "@/app/lib/services/class";
import { CreateRatingRequest } from "@/app/types/rating";
import TeacherReviewCard from "@/app/ui/components/user/student/classes/review/TeacherReviewCard";
import ReviewSuccessHeader from "@/app/ui/components/user/student/classes/review/ReviewSuccessHeader";
import ReviewSuccessBody from "@/app/ui/components/user/student/classes/review/ReviewSuccessBody";
import { Loading } from "@/app/ui/components/_common/loading";
import { UserSummary } from "@/app/types";
import ClassReviewCard from "@/app/ui/components/user/student/classes/review/ClassReviewCard";
import { createRating } from "@/app/lib/services/rating";

interface CriteriaRating {
  [key: string]: number;
}

const ReviewPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState<"class" | string>("class");
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams<{ classId: string }>();
  const classId = params?.classId || "";

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

  const [hoveredStars, setHoveredStars] = useState<{ [key: string]: number }>(
    {},
  );

  const { addToast } = useCustomToast();

  // Fetch class details using React Query
  const {
    data: classDetails,
    isLoading,
    error: classError,
    refetch,
  } = useQuery({
    queryKey: ["ClassDetails", classId],
    queryFn: () => getClassById(classId),
    refetchOnWindowFocus: false,
  });

  // Handle side effects when data is loaded
  useEffect(() => {
    if (classDetails?.teachers?.length) {
      const initialSteps = classDetails.teachers.reduce<
        Record<string, "rating" | "comment">
      >((acc: Record<string, "rating" | "comment">, teacher: UserSummary) => {
        acc[teacher.id] = "rating";
        return acc;
      }, {});
      setTeacherSteps(initialSteps);
      setActiveTeacherId(classDetails.teachers[0]?.id || null);
    }
  }, [classDetails]);

  const teachers = classDetails?.teachers || [];

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
  }, [teachers, activeTeacherId]);

  // Handle loading and error states
  if (isLoading) {
    return <Loading />;
  }

  if (classError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">Đã xảy ra lỗi khi tải dữ liệu lớp học</p>
        </div>
      </div>
    );
  }

  // Check if the class has already been rated
  if (classDetails?.rated) {
    return (
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg justify-center items-center flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-sm text-amber-700">
            Bạn đã đánh giá lớp học này rồi. Cảm ơn bạn!
          </span>
        </div>
      </div>
    );
  }

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

  const isClassEvaluationComplete = () => {
    // Lấy tất cả criteriaId từ classCriteria
    const allCriteriaIds = classCriteria.flatMap((group) =>
      group.items.map((item) => item.id),
    );

    // Kiểm tra tất cả đều > 0
    return allCriteriaIds.every((criteriaId) => {
      const rating = ratings.class.criteria[criteriaId] || 0;
      return rating > 0;
    });
  };

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

  const handleNextStep = () => {
    if (activeTab === "class") {
      if (reviewStep === "rating") {
        // Get all criteria IDs from classCriteria
        const allCriteriaIds = classCriteria.flatMap((group) =>
          group.items.map((item) => item.id),
        );

        // Check if all criteria have a rating > 0
        const allRated = allCriteriaIds.every((criteriaId) => {
          const rating = ratings.class.criteria[criteriaId] || 0;
          return rating > 0;
        });

        if (!allRated) {
          addToast.error(
            "Vui lòng đánh giá đầy đủ các tiêu chí trước khi tiếp tục",
            {},
          );
          return;
        }

        // Move to comment step
        setReviewStep("comment");
      } else {
        // Move to first teacher's evaluation`
        if (teachers.length > 0) {
          setActiveTab(teachers[0].id);
          setActiveTeacherId(teachers[0].id);
        }
      }
    } else if (activeTeacherId) {
      const teacherRating = ratings.teachers[activeTeacherId] || {
        criteria: {},
        comment: "",
      };
      const totalTeacherCriteriaCount = teacherCriteria.reduce(
        (sum, group) => sum + group.items.length,
        0,
      );

      if (teacherSteps[activeTeacherId] === "rating") {
        // Validate all teacher ratings are provided before moving to comments
        const allRated =
          Object.keys(teacherRating.criteria).length ===
            totalTeacherCriteriaCount &&
          Object.values(teacherRating.criteria).every((rating) => rating > 0);

        if (!allRated) {
          return;
        }
        setTeacherSteps((prev) => ({
          ...prev,
          [activeTeacherId]: "comment",
        }));
      } else {
        // Move to next teacher or to submission
        const currentIndex = teachers.findIndex(
          (t) => t.id === activeTeacherId,
        );
        if (currentIndex < teachers.length - 1) {
          const nextTeacherId = teachers[currentIndex + 1].id;
          setActiveTeacherId(nextTeacherId);
          setTeacherSteps((prev) => ({
            ...prev,
            [nextTeacherId]: "rating",
          }));
        }
      }
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

  // Calculate average rating from criteria object
  const calculateAverageRating = (criteria: Record<string, number>): number => {
    const values = Object.values(criteria);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((sum / values.length).toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ---- Teacher validation ----
    const totalTeacherCriteriaCount = teacherCriteria.reduce(
      (sum, group) => sum + group.items.length,
      0,
    );
    const allTeachersRated = teachers.every((teacher) => {
      const teacherRating = ratings.teachers[teacher.id];
      if (!teacherRating) return false;

      const itemIds = teacherCriteria.flatMap((group) =>
        group.items.map((i) => i.id),
      );
      const ratedItemIds = Object.keys(teacherRating.criteria).filter((id) =>
        itemIds.includes(id),
      );

      return (
        ratedItemIds.length === totalTeacherCriteriaCount &&
        ratedItemIds.every((id) => teacherRating.criteria[id] > 0)
      );
    });

    // ---- Class validation ----
    const totalClassCriteriaCount = classCriteria.reduce(
      (sum, group) => sum + group.items.length,
      0,
    );
    const classItemIds = classCriteria.flatMap((group) =>
      group.items.map((i) => i.id),
    );
    const ratedClassItemIds = Object.keys(ratings.class.criteria).filter((id) =>
      classItemIds.includes(id),
    );

    const allClassCriteriaRated =
      ratedClassItemIds.length === totalClassCriteriaCount &&
      ratedClassItemIds.every((id) => ratings.class.criteria[id] > 0);

    // ---- Check ----
    if (!allTeachersRated || !allClassCriteriaRated) {
      addToast.error("Vui lòng đánh giá đầy đủ các tiêu chí trước khi gửi", {});
      return;
    }

    setIsSubmitting(true);

    try {
      const classAverageRating = calculateAverageRating(ratings.class.criteria);

      const teacherRatings = Object.entries(ratings.teachers).map(
        ([teacherId, rating]) => ({
          teacherId,
          rating: calculateAverageRating(rating.criteria),
          comment: rating.comment,
        }),
      );

      const ratingData: CreateRatingRequest = {
        classId,
        rating: classAverageRating,
        comment: ratings.class.comment,
        teacherRatings,
      };

      await createRating(ratingData);

      addToast.success("Đã gửi đánh giá thành công!", {});
      setIsSubmitted(true);

      await refetch();

      setTimeout(() => {
        router.push(`/member/classes/${classId}/review`);
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      addToast.error(
        "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.",
        {},
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (
    ratingValue: number,
    onChange?: (rating: number) => void,
    id?: string,
  ) => {
    const hoveredStar = id ? hoveredStars[id] || 0 : 0;

    const handleClick = (star: number) => {
      if (onChange) {
        onChange(star);
      }
    };

    const handleMouseEnter = (star: number) => {
      if (onChange && id) {
        document.body.style.cursor = "pointer";
        setHoveredStars((prev) => ({
          ...prev,
          [id]: star,
        }));
      }
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = "default";
      if (id) {
        setHoveredStars((prev) => ({
          ...prev,
          [id]: 0,
        }));
      }
    };

    const isStarActive = (star: number) => {
      if (hoveredStar > 0) {
        return star <= hoveredStar;
      }
      return star <= ratingValue;
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`relative w-8 h-8 flex items-center justify-center transition-all duration-200 ${
              isStarActive(star) ? "text-yellow-400 scale-110" : "text-gray-200"
            } hover:text-yellow-300`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderTeacherTab = (teacher: UserSummary, index: number) => {
    const isActive = activeTab === teacher.id;
    const isComplete = ratings.teachers[teacher.id]?.comment?.trim() !== "";
    const canClick = !isActive && !isComplete;

    return (
      <button
        key={teacher.id}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          isActive
            ? "bg-primary-50 border border-primary-200"
            : isComplete
              ? "bg-green-50 border border-green-200"
              : "hover:bg-gray-100 border border-transparent"
        }`}
        onClick={() => {
          if (!canClick) return;
          setActiveTab(teacher.id);
          setActiveTeacherId(teacher.id);
        }}
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-light text-primary-darkest font-medium">
          {teacher.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium text-gray-800">
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
                Tiến trình đánh giá
              </h3>

              {/* Tabs */}
              <div className="space-y-4 pl-2 mt-6">
                {/* Tab 1 */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center cursor-pointer group"
                  onClick={() => {
                    setActiveTab("class");
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
                  className={`flex items-center group ${
                    isClassEvaluationComplete()
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => {
                    if (!isClassEvaluationComplete()) {
                      addToast.error(
                        "Vui lòng hoàn thành đánh giá lớp học trước",
                      );
                      return;
                    }
                    setActiveTab(teachers[0]?.id || "class");
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
                      {renderTeacherTab(teacher, index)}
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
