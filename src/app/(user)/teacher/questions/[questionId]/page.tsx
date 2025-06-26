"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const mockData = [
  {
    id: "1",
    description: "Câu hỏi mẫu: Thủ đô của Việt Nam là gì?",
    fileName: "question1.pdf",
    grade: { id: "10", name: "Lớp 10" },
    course: { id: "math", name: "Toán" },
    questionType: "MULTIPLE_CHOICE",
    isManyAnswers: false,
    createdAt: "2025-06-21T10:00:00Z",
    options: [
      { id: "a", description: "Hà Nội", isCorrect: true },
      { id: "b", description: "Hải Phòng", isCorrect: false },
      { id: "c", description: "Đà Nẵng", isCorrect: false },
      { id: "d", description: "TP.HCM", isCorrect: false },
    ],
  },
  {
    id: "2",
    description: "Chọn các số nguyên tố dưới 10",
    fileName: "question2.pdf",
    grade: { id: "5", name: "Lớp 5" },
    course: { id: "math", name: "Toán" },
    questionType: "MULTIPLE_CHOICE",
    isManyAnswers: true,
    createdAt: "2025-06-20T09:00:00Z",
    options: [
      { id: "a", description: "2", isCorrect: true },
      { id: "b", description: "3", isCorrect: true },
      { id: "c", description: "4", isCorrect: false },
      { id: "d", description: "5", isCorrect: true },
      { id: "e", description: "6", isCorrect: false },
      { id: "f", description: "7", isCorrect: true },
    ],
  },
  {
    id: "3",
    description: "Phân tích ý nghĩa của bài thơ Sóng (Xuân Quỳnh)",
    fileName: "bai_tap_tu_luan.docx",
    grade: { id: "12", name: "Lớp 12" },
    course: { id: "lit", name: "Ngữ văn" },
    questionType: "ESSAY",
    createdAt: "2025-06-19T15:00:00Z",
  },
  {
    id: "4",
    description: "Trình bày quan điểm của em về bảo vệ môi trường.",
    fileName: "de_tu_luan.pdf",
    grade: { id: "9", name: "Lớp 9" },
    course: { id: "bio", name: "Sinh học" },
    questionType: "ESSAY",
    createdAt: "2025-06-18T08:00:00Z",
  },
];

const QuestionDetail = (props: { params: Promise<{ questionId: string }> }) => {
  const router = useRouter();
  const params = React.use(props.params);
  const question = mockData.find((q) => q.id === params.questionId);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<typeof question | undefined>(
    question,
  );

  if (!question) return <div className="p-8">Không tìm thấy câu hỏi.</div>;

  const handleChange = (field: string, value: unknown) => {
    setEditData((prev) => ({ ...prev!, [field]: value }));
  };

  const handleSave = () => {
    // Thực tế sẽ gọi API cập nhật, ở đây chỉ demo
    setIsEdit(false);
    // Bạn có thể cập nhật lại mockData nếu muốn
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-center gap-4 mb-6">
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold shadow border border-gray-200"
          onClick={() => router.back()}
        >
          ← Quay lại danh sách
        </button>
        {!isEdit && (
          <button
            className="px-4 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold shadow border border-orange-200"
            onClick={() => setIsEdit(true)}
          >
            ✏️ Chỉnh sửa câu hỏi
          </button>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-4 text-primary-darker">
        Chi tiết câu hỏi
      </h1>
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        {isEdit ? (
          <>
            <div className="mb-3">
              <span className="font-semibold">Mô tả:</span>
              <input
                className="ml-2 border rounded px-2 py-1 w-2/3"
                value={editData!.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <span className="font-semibold">Khối:</span>
              <input
                className="ml-2 border rounded px-2 py-1 w-32"
                value={editData!.grade.name}
                onChange={(e) =>
                  handleChange("grade", {
                    ...editData!.grade,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <span className="font-semibold">Môn:</span>
              <input
                className="ml-2 border rounded px-2 py-1 w-32"
                value={editData!.course.name}
                onChange={(e) =>
                  handleChange("course", {
                    ...editData!.course,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <span className="font-semibold">Loại:</span>
              <select
                className="ml-2 border rounded px-2 py-1"
                value={editData!.questionType}
                onChange={(e) => handleChange("questionType", e.target.value)}
              >
                <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                <option value="ESSAY">Tự luận</option>
              </select>
            </div>
            {editData!.fileName && (
              <div className="mb-3">
                <span className="font-semibold">File đính kèm:</span>
                <input
                  className="ml-2 border rounded px-2 py-1 w-1/2"
                  value={editData!.fileName}
                  onChange={(e) => handleChange("fileName", e.target.value)}
                />
              </div>
            )}
            <div className="mb-3">
              <span className="font-semibold">Ngày tạo:</span>
              <input
                className="ml-2 border rounded px-2 py-1 w-56"
                value={editData!.createdAt}
                onChange={(e) => handleChange("createdAt", e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-semibold border border-green-200"
                onClick={handleSave}
              >
                Lưu
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-200"
                onClick={() => {
                  setIsEdit(false);
                  setEditData(question);
                }}
              >
                Hủy
              </button>
            </div>
            {editData && editData.questionType === "MULTIPLE_CHOICE" && (
              <div className="mb-3">
                <span className="font-semibold">Đáp án:</span>
                <ul className="mt-2 space-y-2">
                  {editData.options?.map((opt, idx) => (
                    <li key={opt.id} className="flex items-center gap-2">
                      <span className="inline-block w-6 font-bold">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        className="border rounded px-2 py-1 w-1/2"
                        value={opt.description}
                        onChange={(e) => {
                          const newOptions = editData.options!.map((o, i) =>
                            i === idx
                              ? { ...o, description: e.target.value }
                              : o,
                          );
                          handleChange("options", newOptions);
                        }}
                      />
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type={editData.isManyAnswers ? "checkbox" : "radio"}
                          checked={!!opt.isCorrect}
                          onChange={(e) => {
                            let newOptions;
                            if (editData.isManyAnswers) {
                              newOptions = editData.options!.map((o, i) =>
                                i === idx
                                  ? { ...o, isCorrect: e.target.checked }
                                  : o,
                              );
                            } else {
                              newOptions = editData.options!.map((o, i) =>
                                i === idx
                                  ? { ...o, isCorrect: true }
                                  : { ...o, isCorrect: false },
                              );
                            }
                            handleChange("options", newOptions);
                          }}
                        />
                        <span className="text-xs">Đúng</span>
                      </label>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 px-2"
                        onClick={() => {
                          const newOptions = editData.options!.filter(
                            (_, i) => i !== idx,
                          );
                          handleChange("options", newOptions);
                        }}
                        disabled={editData.options!.length <= 2}
                        title={
                          editData.options!.length <= 2
                            ? "Phải có ít nhất 2 đáp án"
                            : "Xóa đáp án"
                        }
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
                  onClick={() => {
                    const nextId = String.fromCharCode(
                      97 + (editData.options?.length || 0),
                    );
                    const newOption = {
                      id: nextId,
                      description: "",
                      isCorrect: false,
                    };
                    handleChange("options", [
                      ...(editData.options || []),
                      newOption,
                    ]);
                  }}
                >
                  + Thêm đáp án
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-3">
              <span className="font-semibold">Mô tả:</span>{" "}
              {question.description}
            </div>
            <div className="mb-3">
              <span className="font-semibold">Khối:</span> {question.grade.name}
            </div>
            <div className="mb-3">
              <span className="font-semibold">Môn:</span> {question.course.name}
            </div>
            <div className="mb-3">
              <span className="font-semibold">Loại:</span>{" "}
              {question.questionType === "MULTIPLE_CHOICE"
                ? question.isManyAnswers
                  ? "Trắc nghiệm nhiều đáp án"
                  : "Trắc nghiệm 1 đáp án"
                : "Tự luận"}
            </div>
            {question.fileName && (
              <div className="mb-3">
                <span className="font-semibold">File đính kèm:</span>{" "}
                <span className="text-blue-700 underline cursor-pointer">
                  {question.fileName}
                </span>
              </div>
            )}
            <div className="mb-3">
              <span className="font-semibold">Ngày tạo:</span>{" "}
              {new Date(question.createdAt).toLocaleString("vi-VN")}
            </div>
            {question.questionType === "MULTIPLE_CHOICE" &&
              question.options && (
                <div className="mb-3">
                  <span className="font-semibold">Đáp án chi tiết:</span>
                  <ul className="mt-2 space-y-1">
                    {question.options.map((opt, idx) => (
                      <li
                        key={opt.id}
                        className={
                          opt.isCorrect
                            ? "text-green-700 font-semibold"
                            : "text-gray-700"
                        }
                      >
                        <span className="inline-block w-6 font-bold">
                          {String.fromCharCode(65 + idx)}.
                        </span>{" "}
                        {opt.description}{" "}
                        {opt.isCorrect && (
                          <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                            Đúng
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
