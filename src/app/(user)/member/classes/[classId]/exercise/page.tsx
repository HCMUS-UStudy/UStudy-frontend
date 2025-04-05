"use client";
import { getAssignmentByClassId } from "@/app/lib/services/assignment";
import { ExerciseItem } from "@/app/types/assignment";
import { Button } from "@/app/ui/components/_common/Button";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaThLarge } from "react-icons/fa";
import { FaList, FaSort } from "react-icons/fa6";

export default function ClassExercise() {
  const { classId } = useParams<{ classId: string }>();
  const router = useRouter();
  const randomImages = [
    "https://storage.googleapis.com/a1aa/image/etK-TPGHJCUFTdDL1RCjvPVzYEME-6M-4WM0R6qL1r4.jpg",
    "https://storage.googleapis.com/a1aa/image/b3_Tj5jRj0RauxUD0v2nmQbjuj4Ru05BPm2FGdHScV0.jpg",
    "https://storage.googleapis.com/a1aa/image/PRGq1Y0nXy0j83lLVvMrOvRvLAA9xn0liXQYUWGk4No.jpg",
    "https://storage.googleapis.com/a1aa/image/KYIVzXTF65wwyjZHgfB2EZmGggTcgNIV074jfvlpeyI.jpg",
    "https://storage.googleapis.com/a1aa/image/A2gBNcHuLIFDRYPmfXmepimBj79IpJsVpOeg4aolK3U.jpg",
  ];
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState("desc");
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const handleStartExercise = (exerciseId: string) => {
    router.push(`/member/classes/${classId}/exercise/${exerciseId}`);
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const response = await getAssignmentByClassId(0, 10, classId);
        setExercises(response.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
    return;
  }, [classId]);
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
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="p-5 border-2 rounded-lg transition-opacity duration-500 opacity-50"
            >
              <div className="h-40 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="h-5 w-3/4 bg-gray-300 rounded-lg mt-4"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded-lg mt-2"></div>
              <div className="flex items-center mt-4">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div className="ml-2 h-4 w-20 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : exercises.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {exercises.map((exercise, index) => {
            const randomImage =
              randomImages[Math.floor(Math.random() * randomImages.length)];

            return (
              <div
                key={index}
                className={`rounded-lg shadow-lg border-2 transition-shadow duration-300 p-5 ${
                  viewMode === "list"
                    ? "flex items-center gap-6 p-5 hover:bg-gray-100"
                    : ""
                }`}
              >
                <div
                  className={`relative rounded-lg overflow-hidden ${
                    viewMode === "list" ? "w-32 h-20 flex-shrink-0" : ""
                  }`}
                >
                  <Image
                    width={128}
                    height={20}
                    src={randomImage}
                    alt="Quiz banner"
                    className={`object-cover rounded-lg ${
                      viewMode === "list" ? "w-32 h-20" : "w-full h-40"
                    }`}
                  />
                  <div className="absolute top-2 left-2 bg-highlight-text text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    {exercise.description}
                  </div>
                </div>

                <div
                  className={`flex-1 ${viewMode === "list" ? "flex flex-col gap-1" : ""}`}
                >
                  <h2
                    className={`text-xl font-semibold text-primary-darker truncate ${viewMode === "list" ? "" : "mt-2 mb-2"}`}
                  >
                    {exercise.title}
                  </h2>

                  <div className="flex items-center text-primary-dark text-sm">
                    <span>
                      📅 {new Date(exercise.startTime).toLocaleDateString()}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      ⏳ {new Date(exercise.endTime).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center mt-2 space-x-3">
                    <img
                      width={40}
                      height={40}
                      src={exercise.createdBy.avatar}
                      alt={exercise.createdBy.name}
                      className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                    />
                    <span className="text-primary-darkest font-medium text-sm">
                      {exercise.createdBy.name}
                    </span>
                  </div>
                </div>

                <div
                  className={`${
                    viewMode === "list"
                      ? "flex items-center space-x-3"
                      : "flex items-center justify-end mt-4"
                  }`}
                >
                  <div className="flex space-x-2">
                    <button
                      className="bg-primary-darkest text-white hover:bg-hover-primary text-sm px-3 py-1 rounded-lg font-semibold transition"
                      onClick={() => handleStartExercise(exercise.id)}
                    >
                      Bắt đầu
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg font-semibold mt-10">
          Không có bài tập nào
        </div>
      )}
    </div>
  );
}
