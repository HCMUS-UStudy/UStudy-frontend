"use client";

import { useEffect, useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import StudentSubmissionInfo from "@/app/ui/components/user/teacher/StudentSubmissionInfo";
import { AssignmentItem, SubmissionDetail, SubmissionItem } from "@/app/types";
import { motion, AnimatePresence } from "framer-motion";

const mockAssignment: AssignmentItem = {
  id: "ass1",
  title: "Bài tập chương 1: Định lý Pythagoras",
  duration: 45,
  format: "ESSAY", // hoặc "MULTIPLE_CHOICE", "MIXED"
  numAttempts: 1,
  startTime: "2025-05-05T17:14:30.531Z",
  endTime: "2025-05-05T19:14:30.531Z",
  createdBy: {
    id: "u1",
    genId: "gen123",
    email: "teacher@example.com",
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
    gender: "MALE",
  },
  completed: false,
  aclass: {
    id: "class1",
    name: "Lớp 10A1",
    description: "Lớp học Toán - Lớp 10A1",
    grade: {
      id: "grade10",
      name: "Lớp 10",
    },
    course: {
      id: "course1",
      name: "Toán học",
    },
  },
};

const fetchSubmissionList = async (): Promise<SubmissionItem[]> => {
  return [
    {
      id: "sub1",
      student: {
        id: "stu1",
        genId: "S123",
        name: "Nguyễn Văn B",
        email: "b@example.com",
        avatar: "",
        gender: "MALE",
      },
      submissionDate: "2025-05-05T18:00:00.000Z",
      score: 85,
      feedback: "Làm bài tốt",
      gradedBy: null,
    },
    {
      id: "sub2",
      student: {
        id: "stu2",
        genId: "S124",
        name: "Trần Thị C",
        email: "c@example.com",
        avatar: "",
        gender: "FEMALE",
      },
      submissionDate: "",
      score: 0,
      feedback: "",
      gradedBy: null,
    },
    {
      id: "sub4",
      student: {
        id: "stu4",
        genId: "S125",
        name: "Lê Minh D",
        email: "d@example.com",
        avatar: "",
        gender: "MALE",
      },
      submissionDate: "2025-05-05T18:30:00.000Z",
      score: 92,
      feedback: "Bài làm xuất sắc, chú ý hơn về phần ví dụ thực tế.",
      gradedBy: null,
    },
    {
      id: "sub5",
      student: {
        id: "stu5",
        genId: "S126",
        name: "Phạm Thùy E",
        email: "e@example.com",
        avatar: "",
        gender: "FEMALE",
      },
      submissionDate: "2025-05-05T17:50:00.000Z",
      score: 60,
      feedback: "Cần cải thiện phần giải thích định lý.",
      gradedBy: null,
    },
  ];
};

const submissionDetailsMap: Record<string, SubmissionDetail> = {
  sub1: {
    assignmentId: "ass1",
    title: "Bài tập chương 1: Định lý Pythagoras",
    score: 85,
    feedback: "Làm bài khá tốt",
    questions: [
      {
        questionId: "q1",
        questionType: "ESSAY",
        description: "Giải thích định lý Pythagoras.",
        fileName: null,
        score: 10,
        content:
          "Định lý Pythagoras phát biểu rằng trong một tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông.",
        files: [
          { id: "f1", fileName: "baitap1.pdf", filePath: "/file/baitap1.pdf" },
        ],
      },
      {
        questionId: "q2",
        questionType: "ESSAY",
        description:
          "Trình bày một ví dụ áp dụng định lý Pythagoras trong thực tế.",
        fileName: null,
        score: 10,
        content:
          "Ví dụ: Để tính chiều dài của thang khi đặt dựa vào tường, ta có thể dùng định lý Pythagoras.",
        files: [],
      },
      {
        questionId: "q3",
        questionType: "ESSAY",
        description:
          "So sánh định lý Pythagoras với định lý khác trong hình học.",
        fileName: null,
        score: 10,
        content:
          "Định lý Pythagoras chỉ áp dụng cho tam giác vuông, trong khi định lý cosin có thể áp dụng cho mọi tam giác.",
        files: [
          { id: "f2", fileName: "so_sanh.pdf", filePath: "/file/so_sanh.pdf" },
        ],
      },
      {
        questionId: "q4",
        questionType: "ESSAY",
        description:
          "Giải thích tại sao định lý Pythagoras quan trọng trong hình học.",
        fileName: null,
        score: 10,
        content:
          "Định lý này là nền tảng để xác định khoảng cách, xây dựng hình học và giải quyết nhiều bài toán thực tế.",
        files: [],
      },
      {
        questionId: "q5",
        questionType: "MULTIPLE_CHOICE",
        description: "Đâu là định nghĩa đúng?",
        fileName: null,
        score: 5,
      },
    ],
  },
  sub2: {
    assignmentId: "ass1",
    title: "Bài tập chương 1: Định lý Pythagoras",
    score: 0,
    feedback: "Chưa nộp bài.",
    questions: [
      {
        questionId: "q1",
        questionType: "ESSAY",
        description: "Chưa có bài nộp.",
        fileName: null,
        score: 0,
        content: "",
        files: [],
      },
    ],
  },

  sub4: {
    assignmentId: "ass1",
    title: "Bài tập chương 1: Định lý Pythagoras",
    score: 92,
    feedback: "Bài làm xuất sắc, chú ý hơn về phần ví dụ thực tế.",
    questions: [
      {
        questionId: "q1",
        questionType: "ESSAY",
        description: "Giải thích định lý Pythagoras.",
        fileName: null,
        score: 10,
        content: "Định lý Pythagoras là",
        files: [],
      },
      {
        questionId: "q2",
        questionType: "ESSAY",
        description:
          "Trình bày một ví dụ áp dụng định lý Pythagoras trong thực tế.",
        fileName: null,
        score: 9,
        content:
          "Ví dụ: Đo chiều dài đường ống dẫn nước khi đặt theo góc vuông với mặt đất.",
        files: [
          {
            id: "f4",
            fileName: "example_pipe.pdf",
            filePath: "/file/example_pipe.pdf",
          },
        ],
      },
      {
        questionId: "q3",
        questionType: "ESSAY",
        description:
          "So sánh định lý Pythagoras với định lý khác trong hình học.",
        fileName: null,
        score: 10,
        content:
          "Khác với định lý cosin, định lý Pythagoras chỉ áp dụng cho tam giác vuông.",
        files: [],
      },
      {
        questionId: "q4",
        questionType: "ESSAY",
        description:
          "Giải thích tại sao định lý Pythagoras quan trọng trong hình học.",
        fileName: null,
        score: 10,
        content:
          "Định lý là nền tảng cho rất nhiều bài toán về đo đạc và xây dựng.",
        files: [],
      },
      {
        questionId: "q5",
        questionType: "MULTIPLE_CHOICE",
        description: "Đâu là định nghĩa đúng?",
        fileName: null,
        score: 10,
      },
    ],
  },
  sub5: {
    assignmentId: "ass1",
    title: "Bài tập chương 1: Định lý Pythagoras",
    score: 60,
    feedback: "Cần cải thiện phần giải thích định lý.",
    questions: [
      {
        questionId: "q1",
        questionType: "ESSAY",
        description: "Giải thích định lý Pythagoras.",
        fileName: null,
        score: 6,
        content:
          "Định lý này dùng để tính toán các cạnh của tam giác vuông, nhưng phần giải thích chưa rõ ràng.",
        files: [],
      },
      {
        questionId: "q2",
        questionType: "ESSAY",
        description:
          "Trình bày một ví dụ áp dụng định lý Pythagoras trong thực tế.",
        fileName: null,
        score: 7,
        content: "Ví dụ: Dùng để tính chiều dài cáp treo trong hệ thống điện.",
        files: [],
      },
      {
        questionId: "q3",
        questionType: "ESSAY",
        description:
          "So sánh định lý Pythagoras với định lý khác trong hình học.",
        fileName: null,
        score: 8,
        content:
          "So với định lý sin thì định lý Pythagoras chỉ áp dụng cho tam giác vuông.",
        files: [],
      },
      {
        questionId: "q4",
        questionType: "ESSAY",
        description:
          "Giải thích tại sao định lý Pythagoras quan trọng trong hình học.",
        fileName: null,
        score: 7,
        content:
          "Định lý này giúp giải quyết các bài toán thực tế liên quan đến khoảng cách.",
        files: [],
      },
      {
        questionId: "q5",
        questionType: "MULTIPLE_CHOICE",
        description: "Đâu là định nghĩa đúng?",
        fileName: null,
        score: 8,
      },
    ],
  },
};

export default function AssignmentDetail() {
  const [students, setStudents] = useState<SubmissionItem[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<SubmissionItem | null>(
    null,
  );
  const [submissionDetail, setSubmissionDetail] =
    useState<SubmissionDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFormat, setFilterFormat] = useState<
    "All" | "Submitted" | "NotSubmitted"
  >("All");

  const fetchSubmissionDetail = async (
    submissionId: string,
  ): Promise<SubmissionDetail> => {
    // Mô phỏng call API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(submissionDetailsMap[submissionId]);
      }, 300);
    });
  };

  useEffect(() => {
    const loadSubmissions = async () => {
      const data = await fetchSubmissionList();
      setStudents(data);
    };
    loadSubmissions();
  }, []);

  const handleSelectStudent = (student: SubmissionItem) => {
    setSelectedStudent(student);
    setSubmissionDetail(submissionDetailsMap[student.id] ?? null);
  };

  const handleBack = () => {
    setSelectedStudent(null);
    setSubmissionDetail(null);
  };

  useEffect(() => {
    if (!selectedStudent) {
      setSubmissionDetail(null);
      return;
    }

    // Giả sử fetchSubmissionDetail là async function
    fetchSubmissionDetail(selectedStudent.id).then((detail) => {
      setSubmissionDetail(detail);
    });
  }, [selectedStudent]);

  const filteredStudents = students.filter((s) => {
    const matchSearch = s.student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchFilter =
      filterFormat === "All" ||
      (filterFormat === "Submitted" && !!s.submissionDate) ||
      (filterFormat === "NotSubmitted" && !s.submissionDate);
    return matchSearch && matchFilter;
  });

  const submittedCount = students.filter((s) => !!s.submissionDate).length;

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setSubmissionDetail(null);
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 gap-4">
        <Tooltip text="Quay lại">
          <IoReturnUpBack
            className="cursor-pointer text-2xl text-blue-600 hover:text-blue-800"
            onClick={handleBack}
          />
        </Tooltip>
        <h1 className="text-2xl font-bold text-gray-800">
          {mockAssignment.title}
        </h1>
      </div>

      {/* Assignment Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Thông tin bài tập
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-600">
          <p>
            <strong>Thời lượng:</strong> {mockAssignment.duration} phút
          </p>
          <p>
            <strong>Hình thức:</strong>{" "}
            {mockAssignment.format === "MULTIPLE_CHOICE"
              ? "Trắc nghiệm"
              : "Tự luận"}
          </p>
          <p>
            <strong>Số lần làm bài:</strong> {mockAssignment.numAttempts}
          </p>
          <p>
            <strong>Thời gian:</strong>{" "}
            {new Date(mockAssignment.startTime).toLocaleString("vi-VN")} -{" "}
            {new Date(mockAssignment.endTime).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-6
      grid-cols-1
      md:grid-cols-3
      ${selectedStudent ? "" : "md:grid-cols-1"}
    `}
      >
        {/* Student List */}
        <motion.div
          layout
          className="bg-white col-span-1"
          style={{ minHeight: "400px" }}
          animate={{
            gridColumn: selectedStudent ? "span 1" : "span 3",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div
            className={`
        bg-white p-5 rounded-lg shadow-md transition-all duration-500
        col-span-1
        ${selectedStudent ? "" : "md:col-span-3"}
      `}
            style={{ minHeight: "400px" }} // Đặt chiều cao cố định cho scroll tốt hơn
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Danh sách học sinh
              </h3>
              <span className="text-sm text-gray-500">
                Đã nộp: {submittedCount}/{students.length}
              </span>
            </div>

            <SearchField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 mb-4"
              placeholder="Tìm kiếm học sinh..."
            />

            <div
              className={`flex items-center gap-2 mb-4 ${selectedStudent ? "justify-between" : ""}`}
            >
              <label className="text-sm text-gray-600">
                Lọc theo trạng thái:
              </label>
              <select
                value={filterFormat}
                onChange={(e) =>
                  setFilterFormat(
                    e.target.value as "All" | "Submitted" | "NotSubmitted",
                  )
                }
                className="text-sm px-3 py-2 rounded-md border border-gray-300"
              >
                <option value="All">Tất cả</option>
                <option value="Submitted">Đã nộp</option>
                <option value="NotSubmitted">Chưa nộp</option>
              </select>
            </div>

            <ul className="space-y-2 max-h-[320px] overflow-auto">
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className={`p-3 rounded-md border hover:bg-blue-50 cursor-pointer transition
              ${selectedStudent?.id === student.id ? "bg-blue-100 border-blue-400" : ""}
            `}
                >
                  <div className="font-medium">
                    {student.student.genId} - {student.student.name}
                  </div>
                  <div
                    className={`text-sm ${student.submissionDate ? "text-green-600" : "text-red-500"}`}
                  >
                    {student.submissionDate
                      ? `Đã nộp lúc: ${new Date(student.submissionDate).toLocaleTimeString("vi-VN")}`
                      : "Chưa nộp"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Submission Info */}
        <AnimatePresence>
          {selectedStudent && submissionDetail && (
            <motion.div
              key="submission-info"
              className="col-span-2 bg-white p-5 rounded-lg shadow-md"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }} // custom cubic bezier bounce-like
            >
              <StudentSubmissionInfo
                student={selectedStudent.student}
                submissionDetail={submissionDetail}
                onClose={() => handleCloseModal()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
