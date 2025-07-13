"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AssignmentModal from "@/app/ui/components/user/teacher/AssignmentModal";
import { AssignmentItem, ClassDetail } from "@/app/types";
import { getClassById } from "@/app/lib/services/class";
import { getAssignmentByClassId } from "@/app/lib/services/assignment";

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
  // const params = useParams();
  // const classId = params?.classId;

  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;

  const handleExerciseClick = (assignmentId: string) => {
    router.push(`/teacher/classes/${classId}/assignment/${assignmentId}`);
  };
  const [adding, setAdding] = useState(false);

  const [assignment, setAssignment] = useState<AssignmentItem[]>([]);

  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
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
        const response = await getAssignmentByClassId(
          0,
          100,
          classId as string,
        );
        setAssignment(response.content);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    fetchAssignment();
  }, [classId]);

  return (
    <>
      <div className="mx-2 p-6">
        <div className="flex items-center mb-4 justify-between">
          <h1 className="text-2xl font-bold text-primary-darker">
            Danh sách bài tập
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignment.map((ex) => (
            <div
              key={ex.id}
              onClick={() => handleExerciseClick(ex.id)}
              className="cursor-pointer p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md
              transition bg-white hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {ex.title}
                </h2>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    ex.completed ? "bg-red-100 text-red-700" : ""
                  }`}
                >
                  {ex.completed ? "Đã hết hạn" : ""}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Lớp:</strong> {ex.aclass.name} | <strong>Môn:</strong>{" "}
                  {ex.aclass.course.name}
                </p>
                <p>
                  <strong>Thời gian làm bài:</strong> {ex.duration} phút
                </p>
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {new Date(ex.startTime).toLocaleString()} -{" "}
                  {new Date(ex.endTime).toLocaleString()}
                </p>
                <p>
                  <strong>GV:</strong> {ex.createdBy.name}
                </p>
              </div>
            </div>
          ))}
        </div>
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
