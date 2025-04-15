import { RxCross1 } from "react-icons/rx";
import { Button } from "../../_common/Button";
import { toast } from "react-toastify";
import Checkbox from "../../_common/Checkbox";
import { motion } from "framer-motion";
import { RiDeleteBin6Line } from "react-icons/ri";
import Switch from "../../_common/Switch";
import { createQuestion } from "@/app/lib/services/question";
import { IoReturnUpBack } from "react-icons/io5";
import { useForm, useFieldArray } from "react-hook-form";
import TextArea from "../../_common/text-field/TextArea";
import { Input } from "../../_common/text-field/Input";
import { ClassDetail } from "@/app/types";

type FormValues = {
  question: string;
  answers: { description: string; correct: boolean }[];
  isMultipleChoice: boolean;
};

const QuizModal = ({
  onGoBack,
  onClose,
  classDetail,
}: {
  onGoBack: () => void;
  onClose: (value: boolean) => void;
  classDetail: ClassDetail;
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({
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
    shouldFocusError: false, // Prevent focusing on errors when adding answers
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const isMultipleChoice = watch("isMultipleChoice");
  const handleMultipleChoiceToggle = (value: boolean) => {
    setValue("isMultipleChoice", value);
    if (!value) {
      const updatedAnswers = fields.map((answer, index) => ({
        ...answer,
        correct: index === fields.findIndex((a) => a.correct),
      }));
      setValue("answers", updatedAnswers);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const body = {
      description: data.question,
      gradeId: classDetail.grade.id,
      courseId: classDetail.course.id,
      questionType: "MULTIPLE_CHOICE",
      options: data.answers.map((answer) => ({
        description: answer.description,
        isCorrect: answer.correct,
      })),
    };

    try {
      await createQuestion(body);
      toast.success("Tạo câu hỏi thành công", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
      onClose(false);
    } catch (error) {
      console.error("Failed to create question:", error);
      toast.error("Tạo câu hỏi thất bại", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => onClose(false)}
    >
      <motion.div
        className="flex flex-col bg-white p-5 rounded-lg w-1/2 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between pb-3 border-b">
          <IoReturnUpBack
            className="cursor-pointer text-[25px] text-primary-dark hover:text-primary-darkest"
            onClick={onGoBack}
          />
          <h1 className="text-lg font-bold">Tạo câu hỏi</h1>
          <RxCross1
            className="cursor-pointer hover:text-primary-darkest"
            onClick={() => onClose(false)}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3">
            <label className="font-medium">Câu hỏi</label>
            <TextArea
              className="mt-1 min-h-12 max-h-32"
              {...register("question", {
                required: "Câu hỏi không được để trống",
              })}
              isError={!!errors.question}
              errorMsg={errors.question?.message}
            />
          </div>
          <div className="flex flex-col gap-2 mt-3 w-full">
            <div className="flex items-center gap-4">
              <label className="font-medium">Trả lời</label>
              <div className="border-l h-5 border-gray-300"></div>
              <div className="">Nhiều đáp án</div>
              <Switch
                checked={isMultipleChoice}
                onChange={handleMultipleChoiceToggle}
              />
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center w-full gap-4">
                <Checkbox
                  checked={field.correct}
                  onChange={() => {
                    const updatedAnswers = [...fields];
                    updatedAnswers[index].correct = !field.correct;
                    setValue("answers", updatedAnswers);
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
                    {...register(`answers.${index}.description`, {
                      required: "Đáp án không được để trống",
                    })}
                    isError={
                      isSubmitted &&
                      !!errors.answers?.[index]?.description &&
                      errors.answers?.[index]?.description?.type === "required"
                    }
                    errorMsg={
                      isSubmitted
                        ? errors.answers?.[index]?.description?.message
                        : ""
                    }
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
            <Button className="px-4 py-2 rounded-lg" type="submit">
              Lưu
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default QuizModal;
