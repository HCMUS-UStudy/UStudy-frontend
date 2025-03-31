"use client";

import { QuizItem } from "@/app/types/type";
import { Button } from "@/app/ui/components/_common/Button";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import Image from "next/image";
import { useState } from "react";
import { FaThLarge } from "react-icons/fa";
import { FaList, FaSort } from "react-icons/fa6";

interface QuizListProps {
  loading: boolean;
  quizItem: QuizItem[];
  randomImages: string[];
  handleStartQuiz: (id: string) => void;
  handleReviewQuiz: (id: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({
  loading,
  quizItem,
  randomImages,
  handleStartQuiz,
  handleReviewQuiz,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [sortOrder, setSortOrder] = useState("desc");

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-5 border-2 rounded-lg animate-pulse">
            <div className="h-40 bg-gray-300 rounded-lg"></div>
            <div className="h-5 w-3/4 bg-gray-300 rounded-lg mt-4"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded-lg mt-2"></div>
            <div className="flex items-center mt-4">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div className="ml-2 h-4 w-20 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (quizItem.length === 0) {
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
        {quizItem.map((quiz, index) => {
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
                <img
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
