"use client";
import { getAssignmentByClassId } from "@/app/lib/services/assignment";
import { getSubmissionByAssignmentId } from "@/app/lib/services/submission";
import { SubmissionItem } from "@/app/types";
import { AssignmentItem } from "@/app/types/assignment";
import { Button } from "@/app/ui/components/_common/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import Modal from "@/app/ui/components/modal";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaThLarge } from "react-icons/fa";
import { FaList, FaSort } from "react-icons/fa6";
import { FaEye, FaEdit } from "react-icons/fa";

export default function ClassAssignment() {
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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterFormat, setFilterFormat] = useState<
    "ALL" | "MULTIPLE_CHOICE" | "ESSAY" | "MIXED"
  >("ALL");

  const [assignment, setAssignment] = useState<AssignmentItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentItem | null>(null);

  const handleStartExercise = (
    assignmentId: string,
    duration: number,
    format: "MULTIPLE_CHOICE" | "MIXED" | "ESSAY",
  ) => {
    router.push(
      `/member/classes/${classId}/assignment/${assignmentId}?duration=${duration}&format=${format}`,
    );
  };

  const handleOpenModal = (assignment: AssignmentItem) => {
    setSelectedAssignment(assignment); // Set the selected assignment
    setIsModalOpen(true); // Open the modal
  };

  const handleReview = (submissionId: string) => () => {
    router.push(`/member/classes/${classId}/review/${submissionId}`);
  };

  const handleEdit = (submissionId: string) => () => {
    router.push(`/member/classes/${classId}/editExercise/${submissionId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null); // Clear selected assignment when closing
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const response = await getAssignmentByClassId(0, 10, classId);
        setAssignment(response.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
    return;
  }, [classId]);

  useEffect(() => {
    if (selectedAssignment) {
      // Gọi API để lấy danh sách các lần nộp bài
      const fetchSubmissions = async () => {
        try {
          setLoadingSubmission(true);
          const response = await getSubmissionByAssignmentId(
            selectedAssignment.id,
            0,
            10,
          );
          setSubmissions(response.content); // Lưu dữ liệu trả về vào state
        } catch (error) {
          console.error("Error fetching submissions:", error);
        } finally {
          setLoadingSubmission(false);
        }
      };
      fetchSubmissions();
    }
  }, [selectedAssignment]);

  const filteredAssignment = assignment.filter(
    (a) => filterFormat === "ALL" || a.format === filterFormat,
  );

  return (
    <div>
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

      {/* Modal hiển thị lịch sử nộp bài */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 z-50 relative">
            <Modal isOpen={isModalOpen} onClose={() => closeModal()}>
              <div className="bg-white rounded-xl shadow-xl w-[800px] mx-auto p-6 relative z-50">
                {/* Header */}
                <header className="flex items-center gap-4 mb-4">
                  <div className="bg-primary-darker text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-clipboard-list text-lg"></i>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
                      {selectedAssignment.title}
                    </h1>
                    <p className="text-sm text-gray-500">
                      Hạn chót:{" "}
                      {new Date(selectedAssignment.endTime).toLocaleString()}
                    </p>
                  </div>
                </header>

                {/* Thông tin bài kiểm tra */}
                <section className="bg-primary-light rounded-lg p-6 mb-6 shadow-md">
                  <div className="flex items-start gap-4 text-sm text-gray-700">
                    <i className="fas fa-calendar-alt text-teal-600 mt-1"></i>
                    <div>
                      <p>
                        <strong>Mở:</strong>{" "}
                        {new Date(
                          selectedAssignment.startTime,
                        ).toLocaleString()}
                      </p>
                      <p>
                        <strong>Đóng:</strong>{" "}
                        {new Date(selectedAssignment.endTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Phương pháp chấm điểm:</strong> Điểm cao nhất
                      </p>
                    </div>
                  </div>
                </section>

                {/* Bảng các lần làm bài */}
                <section>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-700">
                      Các lần làm bài của bạn
                    </h2>
                    <span className="text-xl font-semibold text-primary-darker">
                      {submissions.length} / {selectedAssignment.numAttempts}
                    </span>
                  </div>

                  <div className="max-h-[240px] overflow-y-auto border rounded-md shadow-inner">
                    <Table
                      className={`w-full text-sm text-center ${loading ? "animate-pulse" : ""}`}
                    >
                      <TableHeader
                        columns={["Lần thử", "Trạng thái", "Điểm", "Hành động"]}
                      />
                      <TableBody>
                        {loadingSubmission ? (
                          // Skeleton loader or placeholder rows when loading
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center text-gray-500 p-4"
                            >
                              Đang tải dữ liệu...
                            </td>
                          </tr>
                        ) : (
                          submissions.map((submission, index) => (
                            <TableRow
                              key={submission.id}
                              className={
                                index % 2 === 1 ? "bg-primary-lighter" : ""
                              }
                            >
                              <TableCell className="font-semibold">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <div>
                                  {submission.gradedBy
                                    ? "Đã hoàn thành"
                                    : "Chưa chấm điểm"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Nộp lúc{" "}
                                  {new Date(
                                    submission.submissionDate,
                                  ).toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell
                                className={
                                  submission.score >= 90
                                    ? "font-semibold text-primary-darkest"
                                    : ""
                                }
                              >
                                {submission.score}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={handleReview(submission.id)}
                                    className="p-2 text-blue-600 hover:text-blue-800"
                                    title="Xem lại"
                                  >
                                    <FaEye className="text-xl" />
                                  </button>

                                  {(selectedAssignment.format === "ESSAY" ||
                                    selectedAssignment.format === "MIXED") &&
                                    selectedAssignment.duration === 0 && (
                                      <button
                                        onClick={handleEdit(submission.id)}
                                        className="p-2 text-green-600 hover:text-green-800"
                                        title="Chỉnh sửa"
                                      >
                                        <FaEdit className="text-xl" />
                                      </button>
                                    )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </section>

                {/* Điểm cuối cùng */}
                <p className="text-center text-primary-darker text-lg font-semibold mt-6">
                  🎉 Điểm cuối cùng của bạn:{" "}
                  <span className="text-highlight-text">
                    {submissions.length === 0
                      ? "0"
                      : Math.max(...submissions.map((sub) => sub.score))}{" "}
                    / 10
                  </span>
                </p>

                {/* Các hành động dưới cùng */}
                <div className="mt-8 flex justify-center gap-4">
                  {/* Nút quay lại khóa học */}
                  <button
                    onClick={closeModal}
                    className="bg-primary-light hover:bg-primary-dark transition-colors text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-secondary-dark transform hover:scale-105"
                  >
                    Quay lại khóa học
                  </button>

                  {/* Nút làm lại hoặc bắt đầu nếu chưa nộp bài */}
                  {submissions.length === 0 ? (
                    <button
                      onClick={() =>
                        handleStartExercise(
                          selectedAssignment.id,
                          selectedAssignment.duration,
                          selectedAssignment.format,
                        )
                      }
                      className="bg-primary-darker hover:bg-primary-darkest transition-colors text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-darkest transform hover:scale-105"
                    >
                      Bắt đầu
                    </button>
                  ) : (
                    submissions.length < selectedAssignment.numAttempts && (
                      <button
                        onClick={() =>
                          handleStartExercise(
                            selectedAssignment.id,
                            selectedAssignment.duration,
                            selectedAssignment.format,
                          )
                        }
                        className="bg-primary-darker hover:bg-primary-darkest transition-colors text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-darkest transform hover:scale-105"
                      >
                        Làm lại
                      </button>
                    )
                  )}
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )}

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
          {filteredAssignment.map((assignment, index) => {
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

                  <div
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      assignment.format === "MULTIPLE_CHOICE"
                        ? "bg-blue-500 text-white"
                        : assignment.format === "ESSAY"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                    }`}
                  >
                    {assignment.format === "MULTIPLE_CHOICE"
                      ? "Trắc nghiệm"
                      : assignment.format === "ESSAY"
                        ? "Tự luận"
                        : "Kết hợp"}
                  </div>
                </div>

                <div
                  className={`flex-1 ${viewMode === "list" ? "flex flex-col gap-1" : ""}`}
                >
                  <h2
                    className={`text-xl font-semibold text-primary-darker truncate ${viewMode === "list" ? "" : "mt-2 mb-2"}`}
                  >
                    {assignment.title}
                  </h2>

                  <div className="flex items-center text-primary-dark text-sm">
                    <span>
                      📅 {new Date(assignment.startTime).toLocaleDateString()}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      ⏳ {new Date(assignment.endTime).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center mt-2 space-x-3">
                    <Image
                      width={40}
                      height={40}
                      src={assignment.createdBy.avatar || "/student.png"}
                      alt={assignment.createdBy.name}
                      className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                    />
                    <span className="text-primary-darkest font-medium text-sm">
                      {assignment.createdBy.name}
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
                      onClick={() => handleOpenModal(assignment)}
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
