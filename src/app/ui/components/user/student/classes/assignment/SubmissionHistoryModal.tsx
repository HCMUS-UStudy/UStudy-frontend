import { AssignmentItem, SubmissionItem } from "@/app/types";
import { Button } from "@/app/ui/components/_common/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import Modal from "@/app/ui/components/modal";
import React from "react";
import { FaEye, FaEdit } from "react-icons/fa";

interface Props {
  assignment: AssignmentItem;
  submissions: SubmissionItem[];
  loading: boolean;
  loadingSubmission: boolean;
  isOpen: boolean;
  onClose: () => void;
  onReview: (submission: SubmissionItem) => void;
  onEdit: (submissionId: string) => void;
  onStartExercise: (
    assignmentId: string,
    duration: number,
    format: "MULTIPLE_CHOICE" | "MIXED" | "ESSAY",
  ) => void;
  isExpired: (date: string) => boolean;
}

const SubmissionHistoryModal: React.FC<Props> = ({
  assignment,
  submissions,
  loading,
  loadingSubmission,
  isOpen,
  onClose,
  onReview,
  onEdit,
  onStartExercise,
  isExpired,
}) => {
  function formatDateToVN(dateString: string): string {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // định dạng 24h
      })
    );
  }

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[800px] mx-auto p-6 relative z-50">
        {/* Header */}
        <header className="flex items-center gap-4 mb-4">
          <div className="bg-primary-darker text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
            <i className="fas fa-clipboard-list text-lg"></i>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
              {assignment.title}
            </h1>
            <p className="text-sm text-gray-500">
              Hạn chót: {formatDateToVN(assignment.endTime)}
            </p>
          </div>
        </header>

        {/* Thông tin bài kiểm tra */}
        <section className="bg-primary-light rounded-lg p-6 mb-6 shadow-md">
          <div className="flex items-start gap-4 text-sm text-gray-700">
            <i className="fas fa-calendar-alt text-teal-600 mt-1"></i>
            <div>
              <p>
                <strong>Mở:</strong> {formatDateToVN(assignment.startTime)}
              </p>
              <p>
                <strong>Đóng:</strong> {formatDateToVN(assignment.endTime)}
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
              {submissions.length} / {assignment.numAttempts}
            </span>
          </div>

          <div className="max-h-[240px] overflow-y-auto border rounded-md shadow-inner">
            <Table
              className={`w-full text-sm text-center ${
                loading ? "animate-pulse" : ""
              }`}
            >
              <TableHeader
                columns={["Lần thử", "Trạng thái", "Điểm", "Hành động"]}
              />
              <TableBody>
                {loadingSubmission ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 p-4">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission, index) => (
                    <TableRow
                      key={submission.id}
                      className={index % 2 === 1 ? "bg-primary-lighter" : ""}
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
                          Nộp lúc {formatDateToVN(submission.submissionDate)}
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
                          {assignment.mode === "PRACTICE" ? (
                            <>
                              <Tooltip text="Xem lại">
                                <button
                                  type="button"
                                  onClick={() => onReview(submission)}
                                  className="p-2 text-primary-dark hover:text-primary-darkest transition-colors"
                                  title="Xem lại"
                                >
                                  <FaEye className="text-xl" />
                                </button>
                              </Tooltip>
                              {(assignment.format === "ESSAY" ||
                                assignment.format === "MIXED") &&
                                !isExpired(assignment.endTime) && (
                                  <button
                                    onClick={() => onEdit(submission.id)}
                                    className="p-2 text-green-600 hover:text-green-800"
                                    title="Chỉnh sửa"
                                  >
                                    <FaEdit className="text-xl" />
                                  </button>
                                )}
                            </>
                          ) : (
                            <>
                              {isExpired(assignment.endTime) ? (
                                <Tooltip text="Xem lại">
                                  <button
                                    type="button"
                                    onClick={() => onReview(submission)}
                                    className="p-2 text-primary-dark hover:text-primary-darkest transition-colors"
                                    title="Xem lại"
                                  >
                                    <FaEye className="text-xl" />
                                  </button>
                                </Tooltip>
                              ) : assignment.format === "MULTIPLE_CHOICE" ? (
                                <div>Bài tập chưa hết hạn</div>
                              ) : null}

                              {(assignment.format === "ESSAY" ||
                                assignment.format === "MIXED") &&
                                !isExpired(assignment.endTime) && (
                                  <button
                                    onClick={() => onEdit(submission.id)}
                                    className="p-2 text-green-600 hover:text-green-800"
                                    title="Chỉnh sửa"
                                  >
                                    <FaEdit className="text-xl" />
                                  </button>
                                )}
                            </>
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
          <Button onClick={onClose} variant="outlined" className="text-sm">
            Quay lại khóa học
          </Button>

          {submissions.length === 0 ? (
            <button
              onClick={() =>
                onStartExercise(
                  assignment.id,
                  assignment.duration,
                  assignment.format,
                )
              }
              className="bg-primary-darker hover:bg-primary-darkest transition-colors text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-darkest transform hover:scale-105"
            >
              Bắt đầu
            </button>
          ) : (
            submissions.length < assignment.numAttempts && (
              <Button
                onClick={() =>
                  onStartExercise(
                    assignment.id,
                    assignment.duration,
                    assignment.format,
                  )
                }
                className="px-8 py-3 hover:bg-primary-dark font-semibold"
              >
                Làm lại
              </Button>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SubmissionHistoryModal;
