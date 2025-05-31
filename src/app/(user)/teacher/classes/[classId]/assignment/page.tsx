"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AssignmentModal from "@/app/ui/components/user/teacher/AssignmentModal";
import { ClassTeacher, AssignmentItem } from "@/app/types";
import { getClassById } from "@/app/lib/services/class";
import { getAssignmentByClassId } from "@/app/lib/services/assignment";
import { Button } from "@/app/ui/components/_common/Button";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { FaList, FaSort } from "react-icons/fa6";
import { FaThLarge } from "react-icons/fa";
import AssignmentCard from "@/app/ui/components/user/teacher/AssignmentCard";

// const mockExercises = [
//   {
//     id: "ex1",
//     title: "Bài tập trắc nghiệm chương 1",
//     duration: 30,
//     format: "MULTIPLE_CHOICE",
//     numAttempts: 1,
//     startTime: "2025-05-05T08:00:00.000Z",
//     endTime: "2025-05-05T10:00:00.000Z",
//     completed: true,
//     createdBy: {
//       id: "u1",
//       genId: "GV001",
//       email: "teacher1@example.com",
//       name: "Nguyễn Minh Quân",
//       avatar: "https://i.pravatar.cc/150?img=3",
//     },
//     aclass: {
//       id: "class1",
//       name: "Lớp 10A1",
//       description: "Lớp chuyên Toán",
//       startDate: "2025-01-01",
//       endDate: "2025-12-31",
//       grade: {
//         id: "g10",
//         name: "Khối 10",
//       },
//       course: {
//         id: "math10",
//         name: "Toán 10",
//       },
//       teacher: [
//         {
//           id: "u1",
//           genId: "GV001",
//           email: "teacher1@example.com",
//           name: "Nguyễn Minh Quân",
//           gender: "MALE",
//         },
//       ],
//     },
//   },
//   {
//     id: "ex2",
//     title: "Bài tập tự luận chương 2",
//     duration: 45,
//     format: "ESSAY",
//     numAttempts: 2,
//     startTime: "2025-05-10T08:00:00.000Z",
//     endTime: "2025-05-10T10:00:00.000Z",
//     completed: false,
//     createdBy: {
//       id: "u2",
//       genId: "GV002",
//       email: "teacher2@example.com",
//       name: "Nguyễn Minh Quân",
//       avatar: "https://i.pravatar.cc/150?img=5",
//     },
//     aclass: {
//       id: "class2",
//       name: "Lớp 11B2",
//       description: "Lớp ban Tự nhiên",
//       startDate: "2025-01-01",
//       endDate: "2025-12-31",
//       grade: {
//         id: "g11",
//         name: "Khối 11",
//       },
//       course: {
//         id: "lit11",
//         name: "Ngữ Văn 11",
//       },
//       teacher: [
//         {
//           id: "u2",
//           genId: "GV002",
//           email: "teacher2@example.com",
//           name: "Nguyễn Minh Quân",
//           gender: "MALE",
//         },
//       ],
//     },
//   },
//   {
//     id: "ex3",
//     title: "Bài tập tự luận chương 3",
//     duration: 45,
//     format: "ESSAY",
//     numAttempts: 2,
//     startTime: "2025-05-10T08:00:00.000Z",
//     endTime: "2025-05-10T10:00:00.000Z",
//     completed: false,
//     createdBy: {
//       id: "u2",
//       genId: "GV002",
//       email: "teacher2@example.com",
//       name: "Nguyễn Minh Quân",
//       avatar: "https://i.pravatar.cc/150?img=5",
//     },
//     aclass: {
//       id: "class2",
//       name: "Lớp 11B2",
//       description: "Lớp ban Tự nhiên",
//       startDate: "2025-01-01",
//       endDate: "2025-12-31",
//       grade: {
//         id: "g11",
//         name: "Khối 11",
//       },
//       course: {
//         id: "lit11",
//         name: "Ngữ Văn 11",
//       },
//       teacher: [
//         {
//           id: "u2",
//           genId: "GV002",
//           email: "teacher2@example.com",
//           name: "Nguyễn Minh Quân",
//           gender: "MALE",
//         },
//       ],
//     },
//   },
// ];

export default function Assignment() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.classId;
  const handleExerciseClick = (assignment: AssignmentItem) => {
    router.push(`/teacher/classes/${classId}/assignment/${assignment.id}`);
  };
  const [adding, setAdding] = useState(false);

  const [assignment, setAssignment] = useState<AssignmentItem[]>([]);
  const [filterFormat, setFilterFormat] = useState<
    "ALL" | "MULTIPLE_CHOICE" | "ESSAY" | "MIXED"
  >("ALL");

  const [loading, setLoading] = useState<boolean>(false);

  const [classDetail, setClassDetail] = useState<ClassTeacher | null>(null);
  const handleGoBack = () => {
    setAdding(false);
  };
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await getClassById(classId as string);
        setClassDetail(response);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClass();
  }, [classId]);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const response = await getAssignmentByClassId(
          0,
          100,
          classId as string,
        );
        setAssignment(response.content);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [classId]);

  const filteredAssignment = assignment.filter(
    (a) => filterFormat === "ALL" || a.format === filterFormat,
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return (
    <>
      <div className="mx-2 p-6">
        <div className="flex items-center mb-4 justify-between">
          <h1 className="text-2xl font-bold text-primary-darker">
            Danh sách bài tập
          </h1>

          <button
            onClick={() => setAdding(true)}
            className="px-4 py-2 rounded-lg text-sm hover:bg-primary-light border border-gray-300"
          >
            + Thêm bài tập mới
          </button>
        </div>

        <div>
          <SearchField
            className="w-full bg-primary-lighter py-[2px] rounded-2xl mb-6"
            placeholder="Tìm kiếm bài tập..."
          />

          <div className="flex items-center mb-6 justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Sort by date */}
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

              {/* Filter by format */}
              <div className="flex items-center space-x-2">
                <span className="text-primary-darkest font-medium">
                  Loại bài:
                </span>
                <select
                  value={filterFormat}
                  onChange={(e) =>
                    setFilterFormat(
                      e.target.value as
                        | "ALL"
                        | "MULTIPLE_CHOICE"
                        | "ESSAY"
                        | "MIXED",
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-primary-dark hover:bg-gray-100 transition"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                  <option value="ESSAY">Tự luận</option>
                  <option value="MIXED">Kết hợp</option>
                </select>
              </div>
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
        ) : assignment.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredAssignment.map((assignment, index) => (
              <AssignmentCard
                key={index}
                assignment={assignment}
                viewMode={viewMode}
                onStart={handleExerciseClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg font-semibold mt-10">
            Không có bài tập nào
          </div>
        )}
      </div>
      {adding && (
        <AssignmentModal
          onGoBack={handleGoBack}
          onClose={() => setAdding(false)}
          classId={classId as string}
          courseId={classDetail?.course.id}
          gradeId={classDetail?.grade.id}
        />
      )}
    </>
  );
}
