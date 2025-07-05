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
import { ClassDetail } from "@/app/types";
import { useDropzone } from "react-dropzone";
import { MdUploadFile } from "react-icons/md";
import { FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { FiEdit3 } from "react-icons/fi";
import {
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypePdf,
  TbFileTypePpt,
  TbFileTypeTxt,
  TbFileTypeZip,
  TbFileTypePng,
  TbFileTypeJpg,
} from "react-icons/tb";
import Tooltip from "../../_common/Tooltip";
import { AnimatePresence } from "framer-motion";
import { useCustomToast } from "@/app/lib/hooks/useToast";

type FormValues = {
  question: string;
  answers: { description: string; correct: boolean }[];
  isMultipleChoice: boolean;
};

const fileTypeIcons = [
  {
    type: "pdf",
    icon: <TbFileTypePdf className="text-[25px] text-red-700" />,
  },
  {
    type: "doc",
    icon: <TbFileTypeDoc className="text-[25px] text-blue-600" />,
  },
  {
    type: "docx",
    icon: <TbFileTypeDocx className="text-[25px] text-blue-700" />,
  },
  {
    type: "ppt",
    icon: <TbFileTypePpt className="text-[25px] text-red-800" />,
  },
  {
    type: "pptx",
    icon: <TbFileTypePpt className="text-[25px] text-red-800" />,
  },
  {
    type: "txt",
    icon: <TbFileTypeTxt className="text-[25px] text-gray-700" />,
  },
  {
    type: "zip",
    icon: <TbFileTypeZip className="text-[25px] text-yellow-700" />,
  },
  {
    type: "jpg",
    icon: <TbFileTypeJpg className="text-[25px] text-slate-700" />,
  },
  {
    type: "jpeg",
    icon: <TbFileTypeJpg className="text-[25px] text-slate-700" />,
  },
  {
    type: "png",
    icon: <TbFileTypePng className="text-[25px] text-slate-700" />,
  },
];

const QuestionModal = ({
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
    shouldFocusError: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

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

  const { addToast } = useCustomToast();

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
      addToast.success("Tạo câu hỏi thành công");
      onClose(false);
    } catch (error) {
      console.error("Failed to create question:", error);
      addToast.error("Tạo câu hỏi thất bại");
    }
  };

  const [essayQuestion, setEssayQuestion] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customBaseName, setCustomBaseName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          addToast.error("Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.");
          return;
        }
        setSelectedFile(file);
        const baseName = file.name.substring(0, file.name.lastIndexOf("."));
        setCustomBaseName(baseName);
      }
    },
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setCustomBaseName("");
    setIsEditing(false);
  };

  const handleSubmitEssay = async () => {
    if (!customBaseName) {
      addToast.error("Tên tệp không được để trống.");
      return;
    }

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
      gradeId: classDetail.grade.id,
      courseId: classDetail.course.id,
      questionType: "ESSAY",
    };

    try {
      await createQuestion(body);
      addToast.success("Tạo câu hỏi thành công");
      onClose(false);
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
          <Tooltip text="Quay lại">
            <IoReturnUpBack
              className="cursor-pointer text-[25px] text-primary-dark hover:text-primary-darkest"
              onClick={onGoBack}
            />
          </Tooltip>
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
                          errors.answers?.[index]?.description?.type ===
                            "required"
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
          ) : (
            <div>
              <div className="mt-3">
                <label className="font-medium">Câu hỏi</label>
                <TextArea
                  className="mt-1 h-[78px] min-h-16 max-h-32"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  isError={!!errors.question}
                  errorMsg={errors.question?.message}
                />
              </div>

              <div className="text-[14px] mt-4 mb-1 text-primary-darkest">
                Đính kèm tệp (nếu có){" "}
              </div>

              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-lg text-center cursor-pointer transition duration-300 ${
                    isDragActive
                      ? "py-[97px] border-primary-dark bg-primary-lighter"
                      : "py-14 border-gray-300 hover:border-[#29ba76]"
                  }`}
                >
                  <input {...getInputProps()} />

                  <AnimatePresence>
                    {isDragActive && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                      >
                        <FaCloudUploadAlt
                          size={60}
                          className="text-primary-dark"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isDragActive && (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <MdUploadFile size={50} className="text-gray-500" />
                      <p className="text-gray-600 text-sm">
                        Kéo thả tệp vào đây hoặc{" "}
                        <span className="text-primary-darker font-medium underline">
                          nhấn để chọn
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3 bg-gray-50 border p-5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center w-fit">
                      <div>
                        {(() => {
                          const icon = fileTypeIcons.find((icon) =>
                            selectedFile?.name.endsWith(icon.type),
                          );
                          return icon ? <div>{icon.icon}</div> : null;
                        })()}
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          className="border border-gray-300 rounded mr-1 pl-2 py-1
                        text-sm focus:outline-1 focus:outline-primary-dark min-w-[70px]
                        max-w-[200px] sm:max-w-[310px] lg:max-w-[400px]"
                          placeholder="Tên tệp"
                          value={customBaseName}
                          onChange={(e) => setCustomBaseName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setIsEditing(false);
                            }
                          }}
                          onBlur={() => setIsEditing(false)}
                          style={{
                            width: `${customBaseName.length}ch`,
                          }}
                        />
                      ) : (
                        <span
                          className="text-gray-800 text-sm font-medium ml-2 truncate max-w-[200px]
                      sm:max-w-[310px] lg:max-w-[400px]"
                        >
                          {customBaseName}
                        </span>
                      )}
                      <span className="text-gray-800 text-sm">
                        .{selectedFile?.name.split(".").pop() || ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          <Tooltip text="Lưu tên tệp">
                            <FaCheck
                              size={18}
                              className="text-primary-dark hover:text-primary-darker"
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip text="Đổi tên tệp">
                            <FiEdit3
                              size={18}
                              className="text-gray-500 hover:text-gray-700"
                            />
                          </Tooltip>
                        )}
                      </button>
                      <button type="button" onClick={handleRemoveFile}>
                        <Tooltip text="Xóa tệp">
                          <LuTrash2
                            size={19}
                            className="text-red-500 hover:text-red-700"
                          />
                        </Tooltip>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Kích thước:{" "}
                    {selectedFile
                      ? (selectedFile.size / 1024 / 1024).toFixed(2)
                      : "0"}
                    MB
                  </p>
                </div>
              )}
              {!selectedFile && (
                <div className="mt-4 mx-1">
                  <div
                    className="flex-row items-start justify-between mb-2 text-[13px] text-gray-600
                sm:flex sm:gap-2 sm:items-center"
                  >
                    <p>Hỗ trợ tệp: PDF, DOC, DOCX, PPT, TXT, ZIP, JPG, PNG</p>
                    <p>
                      Dung lượng tối đa:{" "}
                      <span className="font-medium">10MB</span>
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-4 border-t pt-3">
                <Button
                  className="px-4 py-2 rounded-lg"
                  onClick={handleSubmitEssay}
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
