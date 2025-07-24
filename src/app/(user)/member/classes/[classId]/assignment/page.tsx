"use client";
import { getAssignmentByClassId } from "@/app/lib/services/assignment";
import { getSubmissionByAssignmentId } from "@/app/lib/services/submission";
import { SubmissionItem } from "@/app/types";
import { AssignmentItem } from "@/app/types/assignment";
import { Button } from "@/app/ui/components/_common/Button";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaThLarge } from "react-icons/fa";
import { FaList, FaSort } from "react-icons/fa6";
import QuestionOverviewModal from "@/app/ui/components/user/student/classes/assignment/QuestionOverviewModal";
import SubmissionHistoryModal from "@/app/ui/components/user/student/classes/assignment/SubmissionHistoryModal";
import AssignmentCard from "@/app/ui/components/user/student/classes/assignment/AssignmentCard";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import { useCustomToast } from "@/app/lib/hooks/useToast";

export default function ClassAssignment() {
  const params = useParams<{ classId: string }>();
  const classId = params?.classId;
  const router = useRouter();
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

  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionItem | null>(null);
  const [showQuestionOverview, setShowQuestionOverview] = useState(false);
  const { addToast } = useCustomToast();

  const handleStartExercise = (
    assignmentId: string,
    duration: number,
    format: "MULTIPLE_CHOICE" | "MIXED" | "ESSAY",
  ) => {
    router.push(
      `/member/classes/${classId}/assignment/${assignmentId}?duration=${duration}&format=${format}`,
    );
  };

  const isExpired = (endTime: string): boolean => {
    const currentTime = new Date();
    const endTimeDate = new Date(endTime);

    return currentTime > endTimeDate;
  };

  const handleOpenModal = (assignment: AssignmentItem) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleReviewClick = (submissionId: string) => {
    if (selectedAssignment) {
      // Nếu là chế độ PRACTICE, cho phép xem review thoải mái
      if (selectedAssignment.mode === "PRACTICE") {
        router.push(`/member/classes/${classId}/review/${submissionId}`);
      } else {
        // Nếu là chế độ TEST, kiểm tra hạn chót
        if (isExpired(selectedAssignment.endTime)) {
          router.push(`/member/classes/${classId}/review/${submissionId}`);
        } else {
          addToast.error("Assignment is not yet expired.");
        }
      }
    } else {
      addToast.error("Selected assignment is not available.");
    }
  };

  const handleEdit = (submissionId: string) => {
    router.push(`/member/classes/${classId}/editExercise/${submissionId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null); // Clear selected assignment when closing
  };

  const handleReview = (submission: SubmissionItem) => {
    setSelectedSubmission(submission);
    setShowQuestionOverview(true);
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const response = await getAssignmentByClassId(0, 10, classId ?? "");
        setAssignment(response.content);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        addToast.error("Không thể tải bài tập. Vui lòng thử lại sau.");
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
                className="flex items-center px-3 py-2 text-[14px] border border-control-border rounded-lg hover:bg-gray-200 transition"
              >
                <span className="mr-2 ">
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
              <Select
                defaultValue={filterFormat}
                defaultLabel="Tất cả"
                className="w-32"
                showClearButton={false}
                onValueChange={(value) => {
                  setFilterFormat(
                    value as "ALL" | "MULTIPLE_CHOICE" | "ESSAY" | "MIXED",
                  );
                }}
              >
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="MULTIPLE_CHOICE">Trắc nghiệm</SelectItem>
                <SelectItem value="ESSAY">Tự luận</SelectItem>
                <SelectItem value="MIXED">Kết hợp</SelectItem>
              </Select>
              {/* <select
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
              </select> */}
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
            <SubmissionHistoryModal
              assignment={selectedAssignment}
              submissions={submissions}
              loading={loading}
              loadingSubmission={loadingSubmission}
              isOpen={isModalOpen}
              onClose={closeModal}
              onReview={handleReview}
              onEdit={handleEdit}
              onStartExercise={handleStartExercise}
              isExpired={isExpired}
            />
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
          {filteredAssignment.map((assignment, index) => (
            <AssignmentCard
              key={index}
              assignment={assignment}
              viewMode={viewMode}
              onStart={handleOpenModal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg font-semibold mt-10">
          Không có bài tập nào
        </div>
      )}

      <QuestionOverviewModal
        show={showQuestionOverview}
        submissionId={selectedSubmission?.id ?? null}
        onClose={() => setShowQuestionOverview(false)}
        onReview={(id) => handleReviewClick(id)}
      />
    </div>
  );
}
