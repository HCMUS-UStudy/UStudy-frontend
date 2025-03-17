"use client";

import { getAssignmentByClassId } from "@/app/lib/services/assignment";
import { getClassById } from "@/app/lib/services/class";
import { getMaterialsByClassId } from "@/app/lib/services/material";
import { getQuizByClassId, getReviewQuiz } from "@/app/lib/services/quiz";
import {
  ClassUserItem,
  ExerciseItem,
  MaterialItem,
  QuizItem,
  QuizReview,
} from "@/app/types/type";
import Loading from "@/app/ui/components/_common/Loading";
import ReviewQuiz from "@/app/ui/components/user/student/classes/quiz/ReviewQuiz";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaBullhorn,
  FaChevronDown,
  FaChevronUp,
  FaComments,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFolderOpen,
} from "react-icons/fa6";

const ClassDetail = () => {
  const params = useParams();
  const classId = Array.isArray(params.classId)
    ? params.classId[0]
    : params.classId;

  const [classDetail, setClassDetail] = useState<ClassUserItem>();
  const [materialItem, setMaterialItem] = useState<MaterialItem[]>([]);

  const [quizItem, setQuizItem] = useState<QuizItem[]>([]);
  const [reviewQuiz, setReviewQuiz] = useState<QuizReview>();

  const [exerciseItem, setExerciseItem] = useState<ExerciseItem[]>([]);

  const [isReviewing, setIsReviewing] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false); // Track the state of the "Tổng quan" tab
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const [allExpanded, setAllExpanded] = useState(false); // Theo dõi trạng thái mở rộng tất cả
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const [subject] = useState({
    name: "Toán học nâng cao",
    description:
      "Khóa học giúp củng cố kiến thức toán học từ cơ bản đến nâng cao, phù hợp với học sinh muốn cải thiện kỹ năng giải bài tập và nâng cao thành tích học tập.",
    overview: [
      {
        title: "Thông báo",
      },
      {
        title: "Diễn đàn thảo luận",
      },
      {
        title: "Giáo trình khóa học",
      },
    ],
    curriculum: [
      {
        title: "Tuần 1: Đại số tuyến tính",
        description: "Học về ma trận, định thức, và không gian vector.",
        materials: [
          {
            title: "Bài tập Đại số tuyến tính",
            description: "File PDF chứa bài tập và lời giải chi tiết.",
            link: "https://example.com/algebra-exercises.pdf",
          },
          {
            title: "Video hướng dẫn Đại số tuyến tính",
            description: "Video giải thích các khái niệm.",
            link: "https://example.com/algebra-video.mp4",
          },
        ],
      },
      {
        title: "Tuần 2: Giải tích",
        description: "Khám phá đạo hàm, tích phân, và ứng dụng thực tế.",
        materials: [
          {
            title: "Tài liệu Giải tích",
            description: "PDF hướng dẫn các khái niệm giải tích cơ bản.",
            link: "https://example.com/calculus-material.pdf",
          },
          {
            title: "Video hướng dẫn Giải tích",
            description: "Video minh họa các bài toán thực tế.",
            link: "https://example.com/calculus-video.mp4",
          },
        ],
      },
    ],
  });

  const fetchClassDetail = async () => {
    setLoading(true);
    setError("");
    try {
      console.log(classId as string);
      const response = await getClassById(classId as string);
      setClassDetail(response.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải thông tin lớp học.");
    } finally {
      console.log(loading);
      console.log(error);
      setLoading(false);
    }
  };

  const fetchMaterial = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMaterialsByClassId("", 0, classId as string);
      setMaterialItem(response.content);
    } catch (err) {
      console.error("Error fetching materials:", err);
      setError("Không thể tải thông tin tài liệu lớp học.");
    } finally {
      console.log(loading);
      console.log(error);
      setLoading(false);
    }
  };

  const fetchQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getQuizByClassId(0, 10, classId as string);
      setQuizItem(response.content);
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError("Không thể tải thông tin quiz của lớp học.");
    } finally {
      console.log(loading);
      console.log(error);
      setLoading(false);
    }
  };

  const fetchExercise = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAssignmentByClassId(0, 10, classId as string);

      setExerciseItem(response.content);
    } catch (err) {
      console.error("Error fetching assignment:", err);
      setError("Không thể tải thông tin assignent của lớp học.");
    } finally {
      console.log(loading);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClassDetail();
      fetchMaterial();
      fetchQuiz();
      fetchExercise();
    }
  }, [classId]);

  const toggleOverview = () => {
    setIsOverviewOpen(!isOverviewOpen);
  };

  const toggleRoute = () => {
    setIsRouteOpen(!isRouteOpen);
  };

  const toggleExercise = () => {
    setIsExerciseOpen(!isExerciseOpen);
  };

  const toggleQuiz = () => {
    setIsQuizOpen(!isQuizOpen);
  };

  const toggleAllSections = () => {
    if (allExpanded) {
      setIsOverviewOpen(false);
      setIsRouteOpen(false);
      setIsExerciseOpen(false);
      setIsQuizOpen(false);
    } else {
      setIsOverviewOpen(true);
      setIsRouteOpen(true);
      setIsExerciseOpen(true);
      setIsQuizOpen(true);
    }
    setAllExpanded(!allExpanded); // Đổi trạng thái
  };

  const handleStartQuiz = (quizId: string) => {
    router.push(`/student/classes/${classId}/quiz/${quizId}`);
  };

  const handleReviewQuiz = async (quizId: string) => {
    try {
      const reviewData = await getReviewQuiz(quizId);

      setReviewQuiz(reviewData);
      setIsReviewing(true);

      window.history.pushState(
        null,
        "",
        `/student/classes/${classId}/quizId/${quizId}`,
      );
    } catch (error) {
      console.error("Error fetching review quiz:", error);
    }
  };

  const handleStartExercise = (exerciseId: string) => {
    router.push(`/student/classes/${classId}/exercise/${exerciseId}`);
  };

  // const handleReviewExercise = async (exerciseId: string) => {
  //   console.error("Error fetching review quiz:", exerciseId);
  // };

  if (!subject) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy thông tin môn học.
      </div>
    );
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isReviewing ? (
        <ReviewQuiz
          reviewData={
            reviewQuiz ?? { quizId: "", title: "", score: 0, questions: [] }
          }
          onClose={() => setIsReviewing(false)}
        />
      ) : (
        <div className="px-2">
          {/* Title Section */}
          <div className="border-b border-gray-300 pb-8">
            <h1 className="text-4xl font-bold text-primary-darker mb-4">
              {classDetail?.course?.name
                ? `Lớp ${classDetail?.name} - ${classDetail?.course?.name} ${classDetail.grade?.name}`
                : classDetail?.name}
            </h1>
            <p className="text-lg text-gray-700">{classDetail?.description}</p>
          </div>

          {/* Tổng quan Section */}
          <div className="mt-8 border-b border-gray-300 pb-6">
            {/* Toggle button to open/close the "Tổng quan" section */}
            <div className="flex justify-between">
              <div
                className="flex items-center cursor-pointer mb-6"
                onClick={toggleOverview}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-dark text-primary-dark mr-4 bg-primary-lighter hover:bg-primary-light transition-all">
                  {isOverviewOpen ? (
                    <FaChevronUp size={20} />
                  ) : (
                    <FaChevronDown size={20} />
                  )}
                </span>
                <h2 className="text-2xl font-semibold text-highlight-text hover:text-[#FAB564] transition-all">
                  Tổng quan
                </h2>
              </div>
              <button
                onClick={toggleAllSections}
                className="px-4 py-2 text-sm bg-primary-darkest text-white rounded-full hover:bg-hover-primary transition-all mb-6"
              >
                {allExpanded ? "Thu gọn tất cả" : "Mở rộng tất cả"}
              </button>
            </div>

            {/* Conditionally render the overview content based on isOverviewOpen state */}
            {isOverviewOpen && (
              <ul className="space-y-4">
                {subject.overview.map((section, index) => (
                  <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                      {/* Render the icon based on the section title */}
                      {section.title === "Thông báo" && (
                        <FaBullhorn
                          size={24}
                          className="text-primary-dark mr-4"
                        />
                      )}
                      {section.title === "Diễn đàn thảo luận" && (
                        <FaComments
                          size={24}
                          className="text-primary-dark mr-4"
                        />
                      )}
                      {section.title === "Giáo trình khóa học" && (
                        <FaBookOpen
                          size={24}
                          className="text-primary-dark mr-4"
                        />
                      )}
                      <h3 className="text-xl font-medium text-gray-800">
                        {section.title}
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Curriculum Section */}
          <div className="mt-8 border-b border-gray-300 pb-6">
            <div
              className="flex items-center cursor-pointer mb-6"
              onClick={toggleRoute}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-dark text-primary-dark mr-4 bg-primary-lighter hover:bg-primary-light transition-all">
                {isRouteOpen ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </span>
              <h2 className="text-2xl font-semibold text-highlight-text hover:text-[#FAB564] transition-all">
                Nội dung môn học
              </h2>
            </div>

            {isRouteOpen && (
              <div className="p-6 bg-white shadow-md rounded-lg">
                {materialItem.length > 0 ? (
                  <ul className="space-y-4">
                    {materialItem.map((item, index) => (
                      <li
                        key={index}
                        className="bg-white p-4 rounded-lg shadow transition-all duration-200 hover:shadow-lg hover:bg-gray-50"
                      >
                        <div
                          className={`flex justify-between items-center cursor-pointer ${
                            item.type === "FOLDER"
                          }`}
                          onClick={() =>
                            item.type === "FOLDER" &&
                            router.push(
                              `/student/classes/${classId}/folder/${item.id}`,
                            )
                          }
                        >
                          <div className="flex items-center space-x-4 overflow-hidden">
                            {/* Icon dựa trên loại tài liệu */}
                            {item.type === "FOLDER" ? (
                              <FaFolderOpen
                                size={28}
                                className="text-yellow-500 mr-2 flex-shrink-0"
                              />
                            ) : item.name.endsWith(".pdf") ? (
                              <FaFilePdf
                                size={28}
                                className="text-red-500 mr-2 flex-shrink-0"
                              />
                            ) : item.name.endsWith(".doc") ||
                              item.name.endsWith(".docx") ? (
                              <FaFileWord
                                size={28}
                                className="text-blue-500 mr-2 flex-shrink-0"
                              />
                            ) : (
                              <FaFileImage
                                size={28}
                                className="text-green-500 mr-2 flex-shrink-0"
                              />
                            )}

                            <div className="overflow-hidden">
                              <h3
                                className={`text-lg font-medium text-gray-800 transition-all truncate max-w-md ${
                                  item.type === "FOLDER"
                                    ? "hover:text-primary"
                                    : ""
                                }`}
                              >
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 truncate max-w-md">
                                Được tải lên bởi:{" "}
                                <span className="text-primary font-medium">
                                  {item.uploadedBy.name}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Nút tải về hoặc xem trong folder */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {item.type === "FOLDER" ? (
                              <a
                                href={`/student/classes/${classId}/folder/${item.id}`}
                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-all shadow-md"
                              >
                                Xem
                              </a>
                            ) : (
                              <a
                                href={`/download/${item.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-primary-dark text-white text-sm rounded-full hover:bg-primary transition-all shadow-md"
                              >
                                Tải về
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>Không có tài liệu nào.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quiz Section */}
          <div className="mt-8 border-b border-gray-300 pb-6">
            <div
              className="flex items-center cursor-pointer mb-6"
              onClick={toggleQuiz}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-dark text-primary-dark mr-4 bg-primary-lighter hover:bg-primary-light transition-all">
                {isQuizOpen ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </span>
              <h2 className="text-2xl font-semibold text-highlight-text hover:text-[#FAB564] transition-all">
                Trắc nghiệm
              </h2>
            </div>

            {isQuizOpen && (
              <div className="p-6 bg-white shadow-lg rounded-xl">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-dark"></div>
                    <span className="ml-2 text-primary-dark">Đang tải...</span>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center">{error}</div>
                ) : quizItem.length > 0 ? (
                  <ul className="space-y-4">
                    {quizItem.map((quiz) => (
                      <li
                        key={quiz.id}
                        className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow grid grid-cols-12 items-center gap-4 bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="col-span-9">
                          <h3 className="text-lg font-semibold text-primary-dark mb-2">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            📅 <strong>Bắt đầu:</strong>{" "}
                            {new Date(quiz.startTime).toLocaleString("vi-VN")}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            ⏰ <strong>Kết thúc:</strong>{" "}
                            {new Date(quiz.endTime).toLocaleString("vi-VN")}
                          </p>
                          <p className="text-sm text-gray-600">
                            👤 <strong>Người tạo:</strong> {quiz.createdBy.name}
                          </p>
                        </div>
                        <div className="col-span-3 flex justify-end space-x-4">
                          <button
                            className="bg-primary-dark text-white py-2 px-6 rounded-lg min-w-[120px] hover:bg-primary-light transition-all shadow-md"
                            onClick={() => handleStartQuiz(quiz.id)}
                          >
                            Bắt đầu
                          </button>
                          {quiz.completed && (
                            <button
                              className="bg-gray-500 text-white py-2 px-6 rounded-lg min-w-[120px] hover:bg-gray-400 transition-all shadow-md"
                              onClick={() => handleReviewQuiz(quiz.id)}
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500">
                    Chưa có bài trắc nghiệm nào.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Exercise Section */}
          <div className="mt-8">
            <div
              className="flex items-center cursor-pointer mb-6"
              onClick={toggleExercise}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-dark text-primary-dark mr-4 bg-primary-lighter hover:bg-primary-light transition-all">
                {isExerciseOpen ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </span>
              <h2 className="text-2xl font-semibold text-highlight-text hover:text-[#FAB564] transition-all">
                Bài tập và kiểm tra
              </h2>
            </div>

            {isExerciseOpen && (
              <div className="p-6 bg-white shadow-md rounded-lg">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-dark"></div>
                    <span className="ml-2 text-primary-dark">Đang tải...</span>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center">{error}</div>
                ) : exerciseItem.length > 0 ? (
                  <ul className="space-y-4">
                    {exerciseItem.map((exercise) => (
                      <li
                        key={exercise.id}
                        className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow grid grid-cols-12 items-center gap-4 bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="col-span-9">
                          <h3 className="text-lg font-semibold text-primary-dark mb-2">
                            {exercise.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            📅 <strong>Bắt đầu:</strong>{" "}
                            {new Date(exercise.startTime).toLocaleString(
                              "vi-VN",
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            ⏰ <strong>Kết thúc:</strong>{" "}
                            {new Date(exercise.endTime).toLocaleString("vi-VN")}
                          </p>
                          <p className="text-sm text-gray-600">
                            👤 <strong>Người tạo:</strong>{" "}
                            {exercise.createdBy.name}
                          </p>
                        </div>
                        <div className="col-span-3 flex justify-end space-x-4">
                          <button
                            className="bg-primary-dark text-white py-2 px-6 rounded-lg min-w-[120px] hover:bg-primary-light transition-all shadow-md"
                            onClick={() => handleStartExercise(exercise.id)}
                          >
                            Bắt đầu
                          </button>
                          {/* {exercise.completed && (
                            <button
                              className="bg-gray-500 text-white py-2 px-6 rounded-lg min-w-[120px] hover:bg-gray-400 transition-all shadow-md"
                              onClick={() => handleReviewQuiz(exercise.id)}
                            >
                              Review
                            </button>
                          )} */}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500">
                    Chưa có bài trắc nghiệm nào.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ClassDetail;
