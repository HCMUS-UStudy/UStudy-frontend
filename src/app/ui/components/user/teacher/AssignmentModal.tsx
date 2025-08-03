import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { Button } from "../../_common/Button";
import { motion } from "framer-motion";
import { IoReturnUpBack } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import Tooltip from "../../_common/Tooltip";
import { Question, UserData } from "@/app/types";
import { getQuestionList } from "@/app/lib/services/question";
import { createAssignment } from "@/app/lib/services/assignment";
import { getUserDataFromCookies } from "@/app/lib/action";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectItem } from "../../_common/Select";
import { CustomDatePicker } from "../../_common/text-field";
import dayjs from "dayjs";

const AssignmentModal = ({
  returnButton = false,
  onGoBack,
  onClose,
  classId,
  courseId,
  gradeId,
}: {
  returnButton?: boolean;
  onGoBack?: () => void;
  onClose: (value: boolean) => void;
  classId: string;
  courseId?: string;
  gradeId?: string;
}) => {
  const queryClient = useQueryClient();
  const [selectedQuestions, setSelectedQuestions] = useState<
    (Question & { score: number })[]
  >([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    startTime: "",
    endTime: "",
    duration: 30,
    numAttempts: 1,
    mode: "PRACTICE", // default mode
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const [userData, setUserData] = useState<UserData | null>(null);

  const { addToast } = useCustomToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserDataFromCookies();
      setUserData(data);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestionList(
          courseId,
          gradeId,
          userData?.genId || "",
        );
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, [courseId, gradeId, userData]);

  const handleAddQuestion = (question: Question) => {
    if (!selectedQuestions.find((q) => q.id === question.id)) {
      setSelectedQuestions((prev) => [
        ...prev,
        { ...question, score: 1 }, // default score 1
      ]);
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleScoreChange = (id: string, score: number) => {
    setSelectedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, score } : q)),
    );
  };

  // Duration fields for hours, minutes, seconds
  const [durationHMS, setDurationHMS] = useState({
    hours: 0,
    minutes: 30,
    seconds: 0,
  });

  const handleSaveAssignment = async () => {
    try {
      const totalDurationSeconds =
        durationHMS.hours * 3600 +
        durationHMS.minutes * 60 +
        durationHMS.seconds;
      await createAssignment({
        classId: classId,
        title: newAssignment.title,
        startTime: newAssignment.startTime.replace(" ", "T"),
        endTime: newAssignment.endTime.replace(" ", "T"),
        duration: totalDurationSeconds,
        numAttempts: newAssignment.numAttempts,
        mode: newAssignment.mode,
        existingQuestions: selectedQuestions.map((q) => ({
          id: q.id,
          score: q.score,
        })),
      });
      onClose(false);
      setSelectedQuestions([]);
      setNewAssignment({
        title: "",
        startTime: "",
        endTime: "",
        duration: 30,
        numAttempts: 1,
        mode: "PRACTICE",
      });
      setDurationHMS({ hours: 0, minutes: 30, seconds: 0 });
      addToast.success("Tạo bài tập thành công!");
      queryClient.invalidateQueries({ queryKey: ["assignments", classId] });
    } catch (error) {
      console.error("Failed to create assignment:", error);
      addToast.error("Tạo bài tập thất bại!");
    }
  };

  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuestion, setSearchQuestion] = useState("");

  useEffect(() => {
    console.log(newAssignment);
  }, [newAssignment]);

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => onClose(false)}
    >
      <motion.div
        className={`bg-white p-5 rounded-lg ${step === 1 ? "w-[90vw] max-w-6xl" : "w-[80vw] max-w-4xl"} shadow-lg`}
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between pb-3 border-b">
          {step !== 2 && returnButton ? (
            <Tooltip text="Quay lại">
              <IoReturnUpBack
                className="cursor-pointer text-[25px] text-primary-dark hover:text-primary-darkest"
                onClick={onGoBack}
              />
            </Tooltip>
          ) : (
            <div className="w-6"></div>
          )}
          <h1 className="text-lg font-bold text-primary-darker">
            Thêm bài tập
          </h1>
          <Tooltip text="Đóng">
            <RxCross1
              className="cursor-pointer hover:text-primary-darkest"
              onClick={() => onClose(false)}
            />
          </Tooltip>
        </div>

        {/* BƯỚC 1: CHỌN CÂU HỎI */}
        {step === 1 && (
          <>
            <div className="flex mt-5 gap-4">
              <div className="w-1/2 border-r pr-4">
                <h2 className="font-semibold mb-3 text-primary-darker">
                  Danh sách câu hỏi
                </h2>
                <input
                  type="text"
                  className="w-full mb-3 px-3 py-2 border border-primary-dark rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  placeholder="Tìm kiếm tên câu hỏi..."
                  value={searchQuestion}
                  onChange={(e) => setSearchQuestion(e.target.value)}
                />
                <div className="h-96 overflow-y-auto">
                  {questions
                    .filter(
                      (q) =>
                        q.description
                          .toLowerCase()
                          .includes(searchQuestion.trim().toLowerCase()) &&
                        !selectedQuestions.some((sel) => sel.id === q.id),
                    )
                    .map((question) => (
                      <div
                        key={question.id}
                        className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-primary-light hover:opacity-85"
                        onClick={() => handleAddQuestion(question)}
                      >
                        {question.description.length > 100 ? (
                          <Tooltip text={question.description}>
                            <span className="break-words whitespace-pre-line inline-block align-top">
                              {question.description.slice(0, 100)}...
                            </span>
                          </Tooltip>
                        ) : (
                          <span className="break-words whitespace-pre-line inline-block align-top">
                            {question.description}
                          </span>
                        )}
                        <div className="mt-1 text-xs text-primary-dark font-semibold">
                          {question.questionType === "MULTIPLE_CHOICE"
                            ? "Trắc nghiệm"
                            : question.questionType === "ESSAY"
                              ? "Tự luận"
                              : question.questionType}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="flex items-center justify-between mb-2 mr-1">
                  <h2 className="font-semibold text-primary-darker">
                    Câu hỏi đã chọn
                  </h2>
                  <span className="text-[13px] font-semibold text-primary-dark">
                    Tổng điểm:{" "}
                    {selectedQuestions.reduce(
                      (sum, q) => sum + (q.score || 0),
                      0,
                    )}
                  </span>
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {selectedQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-3 border rounded-lg flex flex-col gap-1 mb-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-primary-darkest">
                          Câu {index + 1}.{" "}
                        </span>
                        <span className="text-gray-700 text-[12px]">
                          Điểm:{" "}
                          <input
                            type="number"
                            min={1}
                            value={question.score}
                            onChange={(e) =>
                              handleScoreChange(
                                question.id,
                                Math.max(1, Number(e.target.value)),
                              )
                            }
                            className="w-12 border border-gray-300 rounded pl-1 py-[2px] text-center"
                            placeholder="Điểm"
                            title="Điểm cho câu hỏi này"
                          />
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        {question.description.length > 100 ? (
                          <Tooltip text={question.description}>
                            <span className="break-words whitespace-pre-line inline-block align-top">
                              {question.description.slice(0, 100)}...
                            </span>
                          </Tooltip>
                        ) : (
                          <span className="break-words whitespace-pre-line inline-block align-top">
                            {question.description}
                          </span>
                        )}
                        <Tooltip text="Xóa">
                          <button
                            className="text-red-500 hover:text-red-700 text-[14px]"
                            onClick={() => handleRemoveQuestion(question.id)}
                          >
                            <RiDeleteBin6Line size={19} />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="mt-1 text-xs text-primary-dark font-semibold">
                        {question.questionType === "MULTIPLE_CHOICE"
                          ? "Trắc nghiệm"
                          : question.questionType === "ESSAY"
                            ? "Tự luận"
                            : question.questionType}
                      </div>
                    </div>
                  ))}
                  {selectedQuestions.length === 0 && (
                    <p className="text-gray-500">
                      Chưa có câu hỏi nào được chọn.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 border-t pt-3">
              <Button
                className="px-4 py-2 rounded-lg"
                onClick={() => {
                  const totalScore = selectedQuestions.reduce(
                    (sum, q) => sum + (q.score || 0),
                    0,
                  );
                  if (selectedQuestions.length === 0) {
                    addToast.error("Vui lòng chọn ít nhất một câu hỏi!");
                  } else if (totalScore !== 10) {
                    addToast.warning("Tổng điểm của các câu hỏi phải bằng 10!");
                  } else {
                    setStep(2);
                  }
                }}
              >
                Tiếp theo
              </Button>
            </div>
          </>
        )}

        {/* BƯỚC 2: NHẬP THÔNG TIN BÀI TẬP */}
        {step === 2 && (
          <>
            <div className="mt-3">
              <label className="font-medium">Tiêu đề bài tập</label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full border border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary rounded-lg p-2 mt-1"
                placeholder="Nhập tiêu đề bài tập"
              />
            </div>

            <div className="mt-3 flex gap-4">
              <div className="w-1/2">
                <CustomDatePicker
                  label="Thời gian bắt đầu"
                  placeholder=""
                  showTime
                  value={
                    newAssignment.startTime
                      ? dayjs(newAssignment.startTime)
                      : null
                  }
                  onChange={(e) => {
                    const formattedData = dayjs(e).format(
                      "YYYY-MM-DD HH:mm:ss",
                    );
                    setNewAssignment((prev) => ({
                      ...prev,
                      startTime: formattedData,
                    }));
                  }}
                />
              </div>
              <div className="w-1/2">
                <CustomDatePicker
                  label="Thời gian kết thúc"
                  placeholder=""
                  showTime
                  value={
                    newAssignment.endTime ? dayjs(newAssignment.endTime) : null
                  }
                  onChange={(e) => {
                    const formattedData = dayjs(e).format(
                      "YYYY-MM-DD HH:mm:ss",
                    );
                    setNewAssignment((prev) => ({
                      ...prev,
                      endTime: formattedData,
                    }));
                  }}
                />
                {/* <label className="font-medium">Thời gian kết thúc</label>
                <input
                  type="datetime-local"
                  value={newAssignment.endTime}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  className="w-full border border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary rounded-lg p-2 mt-1"
                /> */}
              </div>
            </div>

            <div className="mt-3 flex gap-4">
              <div className="w-1/2">
                <label className="font-medium">Thời lượng</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={durationHMS.hours}
                    onChange={(e) =>
                      setDurationHMS((prev) => ({
                        ...prev,
                        hours: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-16 border border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 text-center"
                    placeholder="Giờ"
                  />
                  <span className="self-center">giờ</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={durationHMS.minutes}
                    onChange={(e) =>
                      setDurationHMS((prev) => ({
                        ...prev,
                        minutes: Math.max(
                          0,
                          Math.min(59, Number(e.target.value)),
                        ),
                      }))
                    }
                    className="w-16 border border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 text-center"
                    placeholder="Phút"
                  />
                  <span className="self-center">phút</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={durationHMS.seconds}
                    onChange={(e) =>
                      setDurationHMS((prev) => ({
                        ...prev,
                        seconds: Math.max(
                          0,
                          Math.min(59, Number(e.target.value)),
                        ),
                      }))
                    }
                    className="w-16 border border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 text-center"
                    placeholder="Giây"
                  />
                  <span className="self-center">giây</span>
                </div>
              </div>
              <div className="w-1/2">
                <label className="font-medium">Số lần làm bài</label>
                <input
                  type="number"
                  value={newAssignment.numAttempts}
                  onChange={(e) => {
                    const value = Math.max(1, Number(e.target.value));
                    setNewAssignment((prev) => ({
                      ...prev,
                      numAttempts: value,
                    }));
                  }}
                  className="w-full border border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary rounded-lg p-2 mt-1"
                  placeholder="Nhập số lần làm bài"
                />
              </div>
            </div>

            <div className="mt-3">
              <Select
                label="Chế độ bài tập"
                defaultValue={"PRACTICE"}
                defaultLabel="Luyện tập"
                onValueChange={(value) => {
                  setNewAssignment((prev) => ({
                    ...prev,
                    mode: value as "PRACTICE" | "TEST",
                  }));
                }}
                showClearButton={false}
              >
                <SelectItem value="PRACTICE">Luyện tập</SelectItem>
                <SelectItem value="TEST">Kiểm tra</SelectItem>
              </Select>
              {/* <label className="font-medium">Chế độ bài tập</label> */}
              {/* <select
                className="w-full border border-primary-dark focus:outline-none focus:ring-1 focus:ring-primary rounded-lg p-2 mt-1"
                value={newAssignment.mode}
                onChange={(e) =>
                  setNewAssignment((prev) => ({
                    ...prev,
                    mode: e.target.value,
                  }))
                }
              >
                <option value="PRACTICE">Luyện tập</option>
                <option value="TEST">Kiểm tra</option>
              </select> */}
            </div>

            <div className="flex justify-between mt-4 border-t pt-3">
              <Button
                className="px-4 py-2 rounded-lg"
                onClick={() => setStep(1)}
              >
                Quay lại
              </Button>
              <Button
                className="px-4 py-2 rounded-lg"
                onClick={handleSaveAssignment}
              >
                Xác nhận
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AssignmentModal;
