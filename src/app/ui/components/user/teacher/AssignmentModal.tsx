import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { Button } from "../../_common/Button";
import { motion } from "framer-motion";
import { IoReturnUpBack } from "react-icons/io5";
import Tooltip from "../../_common/Tooltip";
import { Question, UserData } from "@/app/types";
import { getQuestionList } from "@/app/lib/services/question";
import { createAssignment } from "@/app/lib/services/assignment";
import { getUserDataFromCookies } from "@/app/lib/action";
import { useCustomToast } from "@/app/lib/hooks/useToast";

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
  // const mockQuestions: Question[] = [
  //   {
  //     id: "q1",
  //     description: "HTML là gì?",
  //     fileName: "html-basic.md",
  //     grade: { id: "g1", name: "Lớp 10" },
  //     course: { id: "c1", name: "Tin học" },
  //     questionType: "ESSAY",
  //     createdAt: new Date().toISOString(),
  //     options: [],
  //   },
  //   {
  //     id: "q2",
  //     description: "React hoạt động như thế nào?",
  //     fileName: "react-overview.md",
  //     grade: { id: "g1", name: "Lớp 10" },
  //     course: { id: "c2", name: "Lập trình Web" },
  //     questionType: "ESSAY",
  //     createdAt: new Date().toISOString(),
  //     options: [],
  //   },
  //   {
  //     id: "q3",
  //     description: "Đâu là lợi ích của RESTful API?",
  //     fileName: "rest-api.md",
  //     grade: { id: "g2", name: "Lớp 11" },
  //     course: { id: "c3", name: "Cơ sở dữ liệu" },
  //     questionType: "MULTIPLE_CHOICE",
  //     createdAt: new Date().toISOString(),
  //     options: [
  //       { id: "opt1", description: "Giao tiếp linh hoạt", isCorrect: true },
  //       { id: "opt2", description: "Giao diện đẹp", isCorrect: false },
  //       { id: "opt3", description: "Tốn tài nguyên", isCorrect: false },
  //     ],
  //   },
  //   {
  //     id: "q4",
  //     description: "Sự khác nhau giữa var, let và const",
  //     fileName: "var-let-const.md",
  //     grade: { id: "g1", name: "Lớp 10" },
  //     course: { id: "c2", name: "Lập trình Web" },
  //     questionType: "ESSAY",
  //     createdAt: new Date().toISOString(),
  //     options: [],
  //   },
  //   {
  //     id: "q5",
  //     description:
  //       "Chọn phương án đúng về vòng đời component Reactaa aaaaaaaa aaaaaaaa aaa aaaaa aaaaaaa aaaa aaaaaa aaaaaaaa aaaaaaaaa",
  //     fileName: "react-lifecycle.md",
  //     grade: { id: "g3", name: "Lớp 12" },
  //     course: { id: "c2", name: "Lập trình Web" },
  //     questionType: "MULTIPLE_CHOICE",
  //     createdAt: new Date().toISOString(),
  //     options: [
  //       {
  //         id: "opt1",
  //         description: "componentDidMount xảy ra sau render",
  //         isCorrect: true,
  //       },
  //       {
  //         id: "opt2",
  //         description: "render xảy ra sau componentDidMount",
  //         isCorrect: false,
  //       },
  //     ],
  //   },
  // ];

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    startTime: "",
    endTime: "",
    duration: 30,
    numAttempts: 1,
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
      setSelectedQuestions((prev) => [...prev, question]);
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveAssignment = async () => {
    try {
      await createAssignment({
        classId: classId,
        title: newAssignment.title,
        startTime: newAssignment.startTime,
        endTime: newAssignment.endTime,
        duration: newAssignment.duration,
        numAttempts: newAssignment.numAttempts,
        existingQuestions: selectedQuestions.map((q) => q.id),
      });
      onClose(false);
      setSelectedQuestions([]);
      setNewAssignment({
        title: "",
        startTime: "",
        endTime: "",
        duration: 30,
        numAttempts: 1,
      });
      addToast.success("Tạo bài tập thành công!");
    } catch (error) {
      console.error("Failed to create assignment:", error);
      addToast.error("Tạo bài tập thất bại!");
    }
  };

  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => onClose(false)}
    >
      <motion.div
        className={`bg-white p-5 rounded-lg ${step === 1 ? "w-4/5 sm:w-1/2" : "w-2/3 sm:w-1/2"} shadow-lg`}
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
          <h1 className="text-lg font-bold">Thêm bài tập</h1>
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
                <h2 className="font-semibold mb-3">Danh sách câu hỏi</h2>
                <div className="h-72 overflow-y-auto">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-primary-light 
                  hover:opacity-85"
                      onClick={() => handleAddQuestion(question)}
                    >
                      {question.description.length > 80
                        ? `${question.description.slice(0, 80)}...`
                        : question.description}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <h2 className="font-semibold mb-3">Câu hỏi đã chọn</h2>
                <div className="h-64 overflow-y-auto">
                  {selectedQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-3 border rounded-lg mb-2 flex justify-between items-center"
                    >
                      <span className="w-4/5">
                        {index + 1}.{" "}
                        {question.description.length > 80
                          ? `${question.description.slice(0, 80)}...`
                          : question.description}
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700 text-[14px]"
                        onClick={() => handleRemoveQuestion(question.id)}
                      >
                        Xóa
                      </button>
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
                  if (selectedQuestions.length === 0) {
                    addToast.error("Vui lòng chọn ít nhất một câu hỏi!");
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
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                placeholder="Nhập tiêu đề bài tập"
              />
            </div>

            <div className="mt-3">
              <label className="font-medium">Thời gian bắt đầu</label>
              <input
                type="datetime-local"
                value={newAssignment.startTime}
                onChange={(e) =>
                  setNewAssignment((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
            </div>

            <div className="mt-3">
              <label className="font-medium">Thời gian kết thúc</label>
              <input
                type="datetime-local"
                value={newAssignment.endTime}
                onChange={(e) =>
                  setNewAssignment((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
            </div>

            <div className="mt-3">
              <label className="font-medium">Thời lượng (phút)</label>
              <input
                type="number"
                value={newAssignment.duration}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  setNewAssignment((prev) => ({
                    ...prev,
                    duration: value,
                  }));
                }}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                placeholder="Nhập thời lượng bài tập"
              />
            </div>

            <div className="mt-3">
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
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                placeholder="Nhập số lần làm bài"
              />
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
                Lưu bài tập
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AssignmentModal;
