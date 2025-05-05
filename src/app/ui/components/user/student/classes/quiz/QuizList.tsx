"use client";

import { getQuizByClassId } from "@/app/lib/services/quiz";
import { QuizItem } from "@/app/types";
import { Button } from "@/app/ui/components/_common/Button";
import QuizListLoading from "@/app/ui/components/_common/loading/QuizListLoading";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaThLarge } from "react-icons/fa";
import { FaList, FaSort } from "react-icons/fa6";

const QuizList: React.FC = () => {
  const router = useRouter();
  const { classId } = useParams<{ classId: string }>();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState("desc");

  const randomImages = [
    "https://storage.googleapis.com/a1aa/image/etK-TPGHJCUFTdDL1RCjvPVzYEME-6M-4WM0R6qL1r4.jpg",
    "https://storage.googleapis.com/a1aa/image/b3_Tj5jRj0RauxUD0v2nmQbjuj4Ru05BPm2FGdHScV0.jpg",
    "https://storage.googleapis.com/a1aa/image/PRGq1Y0nXy0j83lLVvMrOvRvLAA9xn0liXQYUWGk4No.jpg",
    "https://storage.googleapis.com/a1aa/image/KYIVzXTF65wwyjZHgfB2EZmGggTcgNIV074jfvlpeyI.jpg",
    "https://storage.googleapis.com/a1aa/image/A2gBNcHuLIFDRYPmfXmepimBj79IpJsVpOeg4aolK3U.jpg",
  ];

  const handleStartQuiz = (quizId: string) => {
    router.push(`/member/classes/${classId}/quiz/${quizId}`);
  };

  const handleReviewQuiz = async (quizId: string) => {
    router.push(`/member/classes/${classId}/quiz/${quizId}/review`);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await getQuizByClassId(0, 10, classId as string);
        setQuizzes(response.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
    return;
  }, [classId]);

  if (loading) {
    return <QuizListLoading />;
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center text-gray-500 text-lg font-semibold mt-10">
        Không có bài quiz nào
      </div>
    );
  }

  return (
    <div>
      <div>
        <SearchField
          className="w-full bg-primary-lighter py-[2px] rounded-2xl mb-6"
          placeholder="Tìm kiếm bài tập..."
        />

        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-primary-darkest font-medium">
              Sắp xếp theo ngày:
            </span>
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
            >
              <span className="mr-2 text-primary-dark">
                {sortOrder === "asc" ? "Cũ nhất" : "Mới nhất"}
              </span>
              <FaSort size={15} />
            </button>
          </div>

          <div className="flex">
            <Button
              onClick={() => setViewMode("grid")}
              className={`p-3 mx-1 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-primary-dark hover:bg-hover-primary text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaThLarge size={15} />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              className={`p-3 mx-1 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-primary-dark hover:bg-hover-primary text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaList size={15} />
            </Button>
          </div>
        </div>
      </div>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {quizzes.map((quiz, index) => {
          const randomImage =
            randomImages[Math.floor(Math.random() * randomImages.length)];

          return (
            <div
              key={index}
              className={`rounded-lg shadow-lg border-2 transition-shadow duration-300 p-5
              ${quiz.completed ? "bg-green-50 border-primary-lighter hover:shadow-primary-dark" : "bg-red-50 hover:shadow-red-300"}
              ${viewMode === "list" ? "flex items-center gap-6 p-5 hover:bg-gray-100" : ""}`}
            >
              <div
                className={`relative rounded-lg overflow-hidden ${
                  viewMode === "list" ? "w-32 h-20 flex-shrink-0" : ""
                }`}
              >
                <Image
                  width={128}
                  height={80}
                  src={randomImage}
                  alt="Quiz banner"
                  className={`object-cover rounded-lg ${
                    viewMode === "list" ? "w-32 h-20" : "w-full h-40"
                  }`}
                />
                <div className="absolute top-2 left-2 bg-highlight-text text-white px-3 py-1 rounded-lg text-xs font-semibold">
                  {quiz.aclass.grade.name} - {quiz.aclass.course.name}
                </div>
              </div>

              <div
                className={`flex-1 ${viewMode === "list" ? "flex flex-col gap-1" : ""}`}
              >
                <h2
                  className={`text-xl font-semibold text-primary-darker truncate ${
                    viewMode === "list" ? "" : "mt-2 mb-2"
                  }`}
                >
                  {quiz.title}
                </h2>
                <p className="text-primary-dark text-sm">
                  📚 {quiz.aclass.name} - {quiz.aclass.course.name}
                </p>
                <div className="flex items-center text-primary-dark text-sm">
                  <span>
                    📅 {new Date(quiz.startTime).toLocaleDateString()}
                  </span>
                  <span className="mx-2">•</span>
                  <span>⏳ {new Date(quiz.endTime).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center mt-2 space-x-3">
                  <Image
                    width={40}
                    height={40}
                    src={quiz.createdBy.avatar}
                    alt={quiz.createdBy.name}
                    className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                  />
                  <span className="text-primary-darkest font-medium text-sm">
                    {quiz.createdBy.name}
                  </span>
                </div>
              </div>

              <div
                className={`flex items-center ${
                  viewMode === "list"
                    ? "flex-col space-y-2"
                    : "flex items-center justify-between mt-4"
                }`}
              >
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                    quiz.completed
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {quiz.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}
                </span>

                <div className="flex space-x-2">
                  <Button
                    className="bg-primary-darkest text-white hover:bg-hover-primary text-sm px-3 py-1 rounded-lg font-semibold transition"
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    Bắt đầu
                  </Button>
                  {quiz.completed && (
                    <Button
                      className="bg-gray-500 text-white text-sm px-3 py-1 rounded-lg font-semibold hover:bg-gray-400 transition"
                      onClick={() => handleReviewQuiz(quiz.id)}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizList;
