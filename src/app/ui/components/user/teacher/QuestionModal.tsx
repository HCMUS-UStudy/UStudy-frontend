import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import { Button } from "../../_common/Button";
import Checkbox from "../../_common/Checkbox";
import { motion } from "framer-motion";
import { RiDeleteBin6Line } from "react-icons/ri";
import Switch from "../../_common/Switch";
import { createQuestion } from "@/app/lib/services/question";
import { IoReturnUpBack } from "react-icons/io5";
import { useForm, useFieldArray } from "react-hook-form";
import TextArea from "../../_common/text-field/TextArea";
import { Input } from "../../_common/text-field/Input";
import { useQueryClient } from "@tanstack/react-query";
import Tooltip from "../../_common/Tooltip";
import { AnimatePresence } from "framer-motion";
import FileUpload from "../../_common/FileUpload";
import { useCustomToast } from "@/app/lib/hooks/useToast";

type FormValues = {
  question: string;
  answers: { description: string; correct: boolean }[];
  isMultipleChoice: boolean;
  scoringCriteria?: string;
};

const QuestionModal = ({
  onGoBack,
  onClose,
  gradeId,
  courseId,
  returnButton = true,
}: {
  onGoBack: () => void;
  onClose: (value: boolean) => void;
  gradeId: string;
  courseId: string;
  returnButton?: boolean;
}) => {
  const { register, handleSubmit, control, watch, setValue } =
    useForm<FormValues>({
      defaultValues: {
        question: "",
        answers: [
          { description: "", correct: false },
          { description: "", correct: false },
          { description: "", correct: false },
          { description: "", correct: false },
        ],
        isMultipleChoice: false,
      },
      shouldFocusError: false,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState<boolean>(false);

  const isMultipleChoice = watch("isMultipleChoice");
  const handleMultipleChoiceToggle = (value: boolean) => {
    setValue("isMultipleChoice", value);
    if (!value) {
      const currentAnswers = watch("answers");
      const firstCorrectIndex = currentAnswers.findIndex((a) => a.correct);
      const updatedAnswers = currentAnswers.map((answer, index) => ({
        ...answer,
        correct: index === firstCorrectIndex,
      }));
      setValue("answers", updatedAnswers);
    }
  };

  const [mcCorrectError, setMcCorrectError] = useState("");
  const { addToast } = useCustomToast();

  const onSubmit = async (data: FormValues) => {
    let valid = true;
    if (!data.question.trim()) {
      setMcDescriptionError("Câu hỏi không được để trống");
      valid = false;
    } else {
      setMcDescriptionError("");
    }
    // Validate all answers
    const answerErrors = data.answers.map((a) =>
      !a.description.trim() ? "Đáp án không được để trống" : "",
    );
    setMcAnswersError(answerErrors);
    if (answerErrors.some((err) => err)) valid = false;
    // Validate at least one correct answer
    if (!data.answers.some((a) => a.correct)) {
      setMcCorrectError("Phải chọn ít nhất 1 đáp án đúng");
      valid = false;
    } else {
      setMcCorrectError("");
    }
    if (!valid) return;

    const body = {
      description: data.question,
      gradeId: gradeId,
      courseId: courseId,
      questionType: "MULTIPLE_CHOICE",
      options: data.answers.map((answer) => ({
        description: answer.description,
        isCorrect: answer.correct,
      })),
      scoringCriteria: "",
    };

    try {
      setLoading(true);
      await createQuestion(body);
      addToast.success("Tạo câu hỏi thành công");
      onClose(false);
      queryClient.invalidateQueries({
        queryKey: ["Questions", courseId, gradeId],
      });
    } catch (error) {
      console.error("Failed to create question:", error);
      addToast.error("Tạo câu hỏi thất bại");
    } finally {
      setLoading(false);
    }
  };

  const [essayQuestion, setEssayQuestion] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customBaseName, setCustomBaseName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [scoringCriteria, setScoringCriteria] = useState("");
  const [scoringCriteriaError, setScoringCriteriaError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [mcDescriptionError, setMcDescriptionError] = useState("");
  const [mcAnswersError, setMcAnswersError] = useState<string[]>([]);

  const handleSubmitEssay = async () => {
    let valid = true;
    if (!description.trim()) {
      setDescriptionError("Câu hỏi không được để trống");
      valid = false;
    } else {
      setDescriptionError("");
    }
    if (!scoringCriteria.trim()) {
      setScoringCriteriaError("Tiêu chí chấm điểm không được để trống");
      valid = false;
    } else {
      setScoringCriteriaError("");
    }
    if (!customBaseName && selectedFile) {
      addToast.error("Tên tệp không được để trống");
      valid = false;
    }
    if (!valid) return;

    const extension = selectedFile?.name.split(".").pop();
    const newFileName = `${customBaseName}.${extension}`;

    const renamedFile = selectedFile
      ? new File([selectedFile], newFileName, {
          type: selectedFile.type,
        })
      : null;

    const body = {
      description: description,
      file: renamedFile,
      gradeId: gradeId,
      courseId: courseId,
      questionType: "ESSAY",
      options: [],
      scoringCriteria: scoringCriteria,
    };

    try {
      await createQuestion(body);
      addToast.success("Tạo câu hỏi thành công");
      onClose(false);
      queryClient.invalidateQueries({
        queryKey: ["Questions", courseId, gradeId],
      });
    } catch (error) {
      console.error("Failed to create question:", error);
      addToast.error("Tạo câu hỏi thất bại");
    }
  };

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => onClose(false)}
    >
      <motion.div
        className="flex flex-col bg-white px-7 py-5 rounded-lg w-3/4 sm:w-1/2 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between pb-3 border-b items-center">
          {returnButton ? (
            <Tooltip text="Quay lại">
              <IoReturnUpBack
                className="cursor-pointer text-[25px] text-primary-dark hover:text-primary-darkest"
                onClick={onGoBack}
              />
            </Tooltip>
          ) : (
            <div></div>
          )}
          <h1 className="text-lg font-bold">Tạo câu hỏi</h1>
          <Tooltip text="Đóng">
            <RxCross1
              className="cursor-pointer hover:text-primary-darkest"
              onClick={() => onClose(false)}
            />
          </Tooltip>
        </div>

        <motion.div layout className="flex gap-4 relative justify-center">
          {[
            { title: "Trắc nghiệm", bool_: false },
            { title: "Tự luận", bool_: true },
          ].map((tab, index) => (
            <button
              key={index}
              className={`relative py-2 px-2 ${
                tab.bool_ === essayQuestion
                  ? "text-primary-darkest font-semibold"
                  : "text-gray-500 hover:text-primary-darkest"
              }`}
              onClick={() => {
                setEssayQuestion(index === 1);
              }}
            >
              {tab.title}
              {tab.bool_ === essayQuestion && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-darkest"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {!essayQuestion ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-3">
                <label className="font-medium flex items-center gap-1">
                  Câu hỏi <span className="text-red-500">*</span>
                </label>
                <TextArea
                  className="mt-1 min-h-12 max-h-32"
                  {...register("question")}
                  value={watch("question")}
                  onChange={(e) => setValue("question", e.target.value)}
                  required
                  isError={!!mcDescriptionError}
                  errorMsg={mcDescriptionError}
                />
              </div>
              <div className="flex flex-col gap-2 mt-3 w-full">
                <div className="flex items-center gap-4">
                  <label className="font-medium">
                    Trả lời <span className="text-red-500">*</span>
                  </label>
                  <div className="border-l h-5 border-gray-300"></div>
                  <div className="">Nhiều đáp án</div>
                  <Switch
                    checked={isMultipleChoice}
                    onChange={handleMultipleChoiceToggle}
                  />
                </div>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center w-full gap-4"
                  >
                    <Checkbox
                      checked={field.correct}
                      onChange={() => {
                        const currentAnswers = watch("answers");
                        const updatedAnswers = currentAnswers.map((a, i) => ({
                          ...a,
                          correct: i === index ? !a.correct : a.correct,
                        }));
                        setValue("answers", updatedAnswers);
                        setMcCorrectError(""); // clear error on change
                      }}
                      disabled={
                        !isMultipleChoice &&
                        fields.filter((a) => a.correct).length >= 1 &&
                        !field.correct
                      }
                    />
                    <div className="w-full">
                      <Input
                        type="text"
                        {...register(`answers.${index}.description`)}
                        value={watch(`answers.${index}.description`)}
                        onChange={(e) => {
                          setValue(
                            `answers.${index}.description`,
                            e.target.value,
                          );
                          // clear error on change
                          setMcAnswersError((prev) => {
                            const next = [...prev];
                            next[index] = "";
                            return next;
                          });
                        }}
                        required
                        isError={!!mcAnswersError[index]}
                        errorMsg={mcAnswersError[index]}
                      />
                    </div>
                    <RiDeleteBin6Line
                      className={`text-[20px] ${
                        fields.length > 2
                          ? "text-red-500 hover:text-red-700 cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (fields.length > 2) remove(index);
                      }}
                    />
                  </div>
                ))}
                {mcCorrectError && (
                  <div className="text-red-500 text-sm mt-1 ml-2">
                    {mcCorrectError}
                  </div>
                )}
                <Button
                  className={`mt-3 ml-8 text-sm w-fit bg-foreground hover:bg-slate-100 border border-gray-400 border-dashed ${
                    fields.length >= 6 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (fields.length < 6)
                      append({ description: "", correct: false });
                  }}
                  disabled={fields.length >= 6}
                  type="button"
                >
                  + Thêm đáp án
                </Button>
              </div>
              <div className="flex justify-end mt-4 border-t pt-3">
                <Button
                  className="px-4 py-2 rounded-lg"
                  type="submit"
                  isPending={isLoading}
                >
                  Lưu
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mt-3">
                <label className="font-medium flex items-center gap-1">
                  Câu hỏi <span className="text-red-500">*</span>
                </label>
                <TextArea
                  className="mt-1 h-[78px] min-h-16 max-h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  isError={!!descriptionError}
                  errorMsg={descriptionError}
                />
              </div>
              <div className="mt-3">
                <label className="font-medium flex items-center gap-1">
                  Tiêu chí chấm điểm <span className="text-red-500">*</span>
                </label>
                <TextArea
                  className="mt-1 h-[60px] min-h-12 max-h-32"
                  value={scoringCriteria}
                  onChange={(e) => setScoringCriteria(e.target.value)}
                  required
                  isError={!!scoringCriteriaError}
                  errorMsg={scoringCriteriaError}
                />
              </div>
              <div className="text-[14px] mt-4 mb-1 text-primary-darkest">
                Đính kèm tệp (nếu có){" "}
              </div>
              <FileUpload
                value={selectedFile}
                onChange={(file, baseName) => {
                  setSelectedFile(file);
                  setCustomBaseName(baseName);
                }}
                customBaseName={customBaseName}
                setCustomBaseName={setCustomBaseName}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
              <div className="flex justify-end mt-4 border-t pt-3">
                <Button
                  className="px-4 py-2 rounded-lg"
                  onClick={handleSubmitEssay}
                  isPending={isLoading}
                >
                  Lưu
                </Button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default QuestionModal;
