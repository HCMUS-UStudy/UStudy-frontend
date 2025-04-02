"use client";

import { getAssignmentByClassId } from "@/app/lib/services/assignment";
import { getClassById } from "@/app/lib/services/class";
import { getQuizByClassId, getReviewQuiz } from "@/app/lib/services/quiz";
import {
  ClassUserItem,
  ExerciseItem,
  QuizItem,
  QuizReview,
} from "@/app/types/type";
import ExerciseList from "@/app/ui/components/user/student/classes/assignment/ExerciseList";
import MaterialGrid from "@/app/ui/components/user/student/classes/folder/MaterialGrid";
import QuizList from "@/app/ui/components/user/student/classes/quiz/QuizList";
import ReviewQuiz from "@/app/ui/components/user/student/classes/quiz/ReviewQuiz";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { BsFillBookFill } from "react-icons/bs";
import { FaBookOpen, FaBullhorn, FaComments } from "react-icons/fa6";

const ClassDetail = () => {
  const params = useParams();
  const classId = Array.isArray(params.classId)
    ? params.classId[0]
    : params.classId;

  const [classDetail, setClassDetail] = useState<ClassUserItem>();

  const [quizItem, setQuizItem] = useState<QuizItem[]>([]);
  const [reviewQuiz, setReviewQuiz] = useState<QuizReview>();

  const [exerciseItem, setExerciseItem] = useState<ExerciseItem[]>([]);

  const [isLoadingReviewQuiz, setIsLoadingReviewQuiz] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const [loading, setLoading] = useState<Record<string, boolean>>({
    overview: false,
    content: false,
    quiz: false,
    assignment: false,
  });
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("assignment");

  const isOverviewTab = activeTab === "overview";
  const isContentTab = activeTab === "content";
  const isQuizTab = activeTab === "quiz";
  const isAssignmentTab = activeTab === "assignment";
  const isMemberTab = activeTab === "member";

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "member", label: "Thành viên" },
    { id: "content", label: "Nội dung" },
    { id: "quiz", label: "Trắc nghiệm" },
    { id: "assignment", label: "Bài tập & Kiểm tra" },
  ];

  const setTabLoading = (tabId: string, state: boolean) => {
    setLoading((prev) => ({ ...prev, [tabId]: state }));
  };

  const classMembers = [
    { id: 1, name: "Nguyễn Văn A", avatar: "/student.png" },
    { id: 2, name: "Trần Thị B", avatar: "/teacher.png" },
    { id: 3, name: "Lê Văn C", avatar: "/avatar3.jpg" },
    { id: 4, name: "Phạm Thị D", avatar: "/avatar4.jpg" },
    { id: 5, name: "Hoàng Văn E", avatar: "/avatar5.jpg" },
  ];

  const randomImages = [
    "https://storage.googleapis.com/a1aa/image/etK-TPGHJCUFTdDL1RCjvPVzYEME-6M-4WM0R6qL1r4.jpg",
    "https://storage.googleapis.com/a1aa/image/b3_Tj5jRj0RauxUD0v2nmQbjuj4Ru05BPm2FGdHScV0.jpg",
    "https://storage.googleapis.com/a1aa/image/PRGq1Y0nXy0j83lLVvMrOvRvLAA9xn0liXQYUWGk4No.jpg",
    "https://storage.googleapis.com/a1aa/image/KYIVzXTF65wwyjZHgfB2EZmGggTcgNIV074jfvlpeyI.jpg",
    "https://storage.googleapis.com/a1aa/image/A2gBNcHuLIFDRYPmfXmepimBj79IpJsVpOeg4aolK3U.jpg",
  ];

  const sections = [
    { title: "Thông báo", icon: <FaBullhorn size={24} /> },
    { title: "Diễn đàn thảo luận", icon: <FaComments size={24} /> },
    { title: "Giáo trình khóa học", icon: <FaBookOpen size={24} /> },
  ];

  const displayedMembers = classMembers.slice(0, 2);
  const remainingCount = classMembers.length - displayedMembers.length;

  const fetchClassDetail = async () => {
    setLoadingDetail(true);
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
      setLoadingDetail(false);
    }
  };

  const fetchQuiz = async () => {
    setTabLoading("quiz", true);
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
      setTabLoading("quiz", false);
    }
  };

  const fetchExercise = async () => {
    setTabLoading("assignment", true);
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
      setTabLoading("assignment", false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClassDetail();
      fetchQuiz();
      fetchExercise();
    }
    return;
  }, [classId]);

  const handleStartQuiz = (quizId: string) => {
    router.push(`/member/classes/${classId}/quiz/${quizId}`);
  };

  const handleReviewQuiz = async (quizId: string) => {
    setIsLoadingReviewQuiz(true);
    setIsReviewing(true);

    try {
      const reviewData = await getReviewQuiz(quizId);
      setReviewQuiz(reviewData);
    } catch (error) {
      console.error("Error fetching review quiz:", error);
    } finally {
      setIsLoadingReviewQuiz(false);
    }

    window.history.pushState(
      null,
      "",
      `/member/classes/${classId}/quizId/${quizId}`,
    );
  };

  const handleStartExercise = (exerciseId: string) => {
    router.push(`/member/classes/${classId}/exercise/${exerciseId}`);
  };

  return (
    <>
      {isReviewing ? (
        isLoadingReviewQuiz ? (
          <div className="flex w-full max-w-6xl gap-6">
            <div className="bg-white shadow-lg rounded-3xl w-full p-8 border border-gray-300 animate-pulse">
              <div className="h-8 w-3/4 bg-gray-300 rounded mb-6 mx-auto"></div>

              <div className="flex justify-between items-center mb-4">
                <span className="h-4 w-20 bg-gray-300 rounded"></span>
              </div>

              <div className="h-6 w-full bg-gray-300 rounded mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>

              <div className="space-y-3 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-300 rounded-lg"></div>
                ))}
              </div>

              <div className="flex justify-between">
                <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
                <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
              </div>
            </div>

            <div className="w-1/4 bg-gray-100 shadow-lg rounded-3xl p-6 animate-pulse">
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-4 mx-auto"></div>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 bg-gray-300 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ReviewQuiz
            reviewData={
              reviewQuiz ?? { quizId: "", title: "", score: 0, questions: [] }
            }
            onClose={() => setIsReviewing(false)}
          />
        )
      ) : (
        <div className="px-2">
          {loadingDetail ? (
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gray-300 p-3 rounded-lg shadow w-12 h-12"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-highlight-text text-white p-3 rounded-lg shadow">
                  <BsFillBookFill className="text-2xl" />
                </div>

                <div className="flex items-center space-x-4">
                  <h1 className="text-3xl font-bold text-primary-darker">
                    {classDetail?.course?.name
                      ? `Lớp ${classDetail?.name} - ${classDetail?.course?.name} ${classDetail.grade?.name}`
                      : classDetail?.name}
                  </h1>

                  <div className="flex items-center space-x-1">
                    {displayedMembers.map((member) => (
                      <Image
                        width={32}
                        height={32}
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full border-2 border-primary-light shadow-md"
                      />
                    ))}

                    {remainingCount > 0 && (
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-darkest flex items-center justify-center text-sm font-bold border-2 border-primary-light shadow-md">
                        +{remainingCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-b border-primary-light mt-6">
            <div className="flex space-x-6 text-primary-dark text-lg font-medium">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 border-b-2 transition duration-300 ${
                    activeTab === tab.id
                      ? "text-primary-darkest font-semibold border-primary-darkest"
                      : "border-transparent hover:text-highlight-text hover:border-hover-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 ml-4 mr-4">
            {isOverviewTab && (
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center">
                  📌 Thông tin lớp học
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Đây là tổng quan về lớp học, bao gồm các thông tin quan trọng
                  như thông báo, diễn đàn và giáo trình khóa học.
                </p>

                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 rounded-lg border border-gray-200 bg-gray-100 hover:bg-gray-200 transition shadow-sm"
                    >
                      <div className="p-3 rounded-full bg-primary-light text-white shadow-md">
                        {section.icon}
                      </div>
                      <span className="text-lg font-medium text-gray-800 ml-4">
                        {section.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isMemberTab && (
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center">
                  👥 Thành viên lớp học
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Danh sách các thành viên tham gia lớp học.
                </p>
              </div>
            )}

            {isContentTab && <MaterialGrid classId={classId ?? ""} />}

            {isQuizTab && (
              <QuizList
                loading={loading["quiz"]}
                quizItem={quizItem}
                randomImages={randomImages}
                handleStartQuiz={handleStartQuiz}
                handleReviewQuiz={handleReviewQuiz}
              />
            )}

            {isAssignmentTab && (
              <ExerciseList
                loading={loading["assignment"]}
                exerciseItem={exerciseItem}
                randomImages={randomImages}
                handleStartExercise={handleStartExercise}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ClassDetail;
