"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getQuestionDetail,
  editQuestion,
  handleDownloadFile,
} from "@/app/lib/services/question";
import { Question, UserData } from "@/app/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IoReturnUpBack } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import Checkbox from "@/app/ui/components/_common/Checkbox";
import FileUpload from "@/app/ui/components/_common/FileUpload";
import isEqual from "lodash/isEqual";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { getUserDataFromCookies } from "@/app/lib/action";
import MarkdownInput from "@/app/ui/components/_common/text-field/MarkdownInput";

type QuestionEdit = Question & {
  isManyAnswers?: boolean;
};

const QuestionDetail = (props: { params: Promise<{ questionId: string }> }) => {
  const router = useRouter();
  const { questionId } = React.use(props.params);
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserDataFromCookies();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const {
    data: question,
    isLoading,
    isError,
    refetch,
  } = useQuery<Question>({
    queryKey: ["question-detail", questionId],
    queryFn: () => getQuestionDetail(questionId),
    enabled: !!questionId,
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      description: string;
      file?: File | null;
      gradeId?: string;
      courseId?: string;
      questionType?: string;
      options?: { id: string; description: string; isCorrect: boolean }[];
      scoringCriteria?: string;
      isDeleteFile?: boolean;
    }) => {
      return editQuestion(
        questionId,
        data.description,
        data.file,
        data.gradeId,
        data.courseId,
        data.questionType,
        data.options,
        data.scoringCriteria,
        data.isDeleteFile,
      );
    },
    onSuccess: () => {
      addToast.success("Cập nhật câu hỏi thành công!");
      setIsEdit(false);
      setNewFile(null);
      setCustomBaseName("");
      setIsDeleteFile(false);
      setIsEditingFileName(false);
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["question-detail", questionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["Questions", question?.course?.id, question?.grade?.id],
      });
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<QuestionEdit | undefined>(undefined);
  const [isDeleteFile, setIsDeleteFile] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [customBaseName, setCustomBaseName] = useState("");
  const [isEditingFileName, setIsEditingFileName] = useState(false);

  const { addToast } = useCustomToast();

  useEffect(() => {
    if (question) {
      // Đếm số đáp án đúng
      const correctCount =
        question.options?.filter((o) => o.isCorrect).length || 0;
      setEditData({
        ...question,
        isManyAnswers: correctCount > 1,
      });
    }
  }, [question]);

  if (isLoading)
    return (
      <div className="p-8">
        <Loading />
      </div>
    );
  if (isError || !question)
    return <div className="p-8">Không tìm thấy câu hỏi.</div>;

  const handleChange = (field: keyof QuestionEdit, value: unknown) => {
    setEditData((prev) => ({ ...prev!, [field]: value }) as QuestionEdit);
  };

  const handleSave = () => {
    if (!editData) return;
    let fileToUpload = newFile;
    if (editData.questionType === "ESSAY" && newFile) {
      if (newFile && customBaseName) {
        const ext = newFile.name.substring(newFile.name.lastIndexOf("."));
        const newName = customBaseName.endsWith(ext)
          ? customBaseName
          : customBaseName + ext;
        fileToUpload = new File([newFile], newName, { type: newFile.type });
      }
    }
    mutation.mutate({
      description: editData.description,
      file: fileToUpload,
      gradeId: editData.grade?.id,
      courseId: editData.course?.id,
      questionType: editData.questionType,
      options: editData.options,
      scoringCriteria: editData.scoringCriteria || undefined,
      isDeleteFile: isDeleteFile,
    });
  };

  const isChanged = (() => {
    if (!editData || !question) return false;
    // So sánh các trường quan trọng (chỉ các trường có trong Question)
    const compareFields: (keyof Question)[] = [
      "description",
      "scoringCriteria",
      "options",
      "fileName",
    ];
    for (const field of compareFields) {
      if (!isEqual(editData[field], question[field])) {
        return true;
      }
    }
    const normalizeOptions = (
      opts?: { id: string; description: string; isCorrect: boolean }[],
    ) =>
      (opts || []).map(({ id, description, isCorrect }) => ({
        id,
        description,
        isCorrect,
      }));

    // ...trong isChanged:
    if (
      !isEqual(
        normalizeOptions(editData.options),
        normalizeOptions(question.options),
      )
    ) {
      return true;
    }
    if (isDeleteFile) return true;
    if (newFile) return true;
    return false;
  })();

  const handleDownload = async () => {
    try {
      const blob = await handleDownloadFile(question.id);
      const url = window.URL.createObjectURL(blob.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = question.fileName || `question-${question.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      addToast.error("Tải xuống thất bại");
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="flex items-center gap-4 mb-6">
        <button
          className="px-2 py-1 rounded-lg hover:bg-primary-lighter text-primary-darkest border border-gray-200"
          onClick={() =>
            router.push(
              `/admin/questions?courseId=${question?.course?.id}&gradeId=${question?.grade?.id}`,
            )
          }
        >
          <IoReturnUpBack className="inline-block mr-2" />
          Trở về
        </button>
        {!isEdit && userData?.genId === question?.createdBy?.genId && (
          <button
            className="px-2 py-1 rounded-lg hover:bg-primary-lighter text-primary-darkest border border-gray-200"
            onClick={() => setIsEdit(true)}
          >
            <MdOutlineEdit className="inline-block mr-2" />
            Chỉnh sửa câu hỏi
          </button>
        )}
      </div>
      <h1 className="text-xl font-bold mb-4 text-primary-darker">
        Chi tiết câu hỏi
      </h1>
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        {isEdit ? (
          <>
            <div className="mb-3 flex">
              <span className="font-semibold mt-1">Mô tả:</span>
              <textarea
                className="ml-2 border focus:outline-primary-darker rounded px-2 py-1 w-3/5
                min-h-[40px] max-h-[180px] resize-y"
                value={editData?.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <span className="font-semibold">Khối:</span>
              <input
                className="ml-2 border focus:outline-primary-darker rounded px-2 py-1 w-32"
                value={editData?.grade?.name || ""}
                disabled
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
                className="ml-2 border focus:outline-primary-darker rounded px-2 py-1 w-32"
                value={editData?.course?.name || ""}
                disabled
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
              <input
                className="ml-2 border focus:outline-primary-darker rounded px-2 py-1 w-48 bg-gray-100 text-gray-700"
                value={
                  editData?.questionType === "MULTIPLE_CHOICE"
                    ? "Trắc nghiệm"
                    : "Tự luận"
                }
                disabled
              />
            </div>
            {editData?.fileName && editData.questionType === "ESSAY" && (
              <div className="mb-3 flex items-center gap-3">
                <span className="font-semibold">File đính kèm:</span>
                <span
                  className={`ml-2 text-primary-darker ${
                    isDeleteFile ? "line-through text-gray-400" : ""
                  }`}
                >
                  {editData.fileName}
                </span>
                <button
                  type="button"
                  className={`px-2 py-1 rounded text-xs ${
                    isDeleteFile
                      ? "bg-gray-200 text-gray-700"
                      : "bg-red-100 text-red-600"
                  }`}
                  onClick={() => setIsDeleteFile((prev) => !prev)}
                >
                  {isDeleteFile ? "Hủy xóa" : "Xóa file"}
                </button>
              </div>
            )}
            {editData?.questionType === "ESSAY" &&
              (isDeleteFile || !editData?.fileName) && (
                <div className="mb-3 w-fit items-center">
                  <span className="font-semibold">Tải lên file mới:</span>
                  <FileUpload
                    value={newFile}
                    onChange={(file, baseName) => {
                      setNewFile(file);
                      setCustomBaseName(baseName);
                    }}
                    customBaseName={customBaseName}
                    setCustomBaseName={setCustomBaseName}
                    isEditing={isEditingFileName}
                    setIsEditing={setIsEditingFileName}
                    error={undefined}
                  />
                </div>
              )}
            {editData?.questionType === "ESSAY" && (
              <div className="mb-3 flex">
                <span className="font-semibold mt-1">Tiêu chí chấm điểm:</span>
                <textarea
                  // className="ml-2 border focus:outline-primary-darker rounded px-2 py-1 w-2/3"
                  className="ml-2 border focus:outline-primary-darker rounded px-2 py-1 w-1/2
                    min-h-[40px] max-h-[180px] resize-y"
                  value={editData?.scoringCriteria || ""}
                  onChange={(e) =>
                    handleChange("scoringCriteria", e.target.value)
                  }
                />
              </div>
            )}
            {editData && editData.questionType === "MULTIPLE_CHOICE" && (
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-3">Đáp án:</span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox
                      checked={!!editData.isManyAnswers}
                      label="Chọn nhiều đáp án"
                      onChange={(checked: boolean) => {
                        if (!checked && editData.options) {
                          // Nếu chuyển sang chỉ chọn 1 đáp án, chỉ giữ lại đáp án đúng đầu tiên
                          const firstCorrectIdx = editData.options.findIndex(
                            (o) => o.isCorrect,
                          );
                          const newOptions = editData.options.map((o, i) =>
                            i === firstCorrectIdx
                              ? { ...o, isCorrect: true }
                              : { ...o, isCorrect: false },
                          );
                          handleChange("isManyAnswers", false);
                          handleChange("options", newOptions);
                        } else {
                          handleChange("isManyAnswers", checked);
                        }
                      }}
                    />
                  </label>
                </div>
                <ul className="mt-2 space-y-2">
                  {editData.options?.map((opt, idx) => (
                    <li key={opt.id} className="flex items-center gap-2">
                      <span className="inline-block w-6 font-bold">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        className="border focus:outline-primary-dark rounded px-2 py-1 w-1/2"
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
                        <Checkbox
                          checked={!!opt.isCorrect}
                          label="Đúng"
                          labelClassName="text-sm text-gray-700"
                          onChange={(checked: boolean) => {
                            let newOptions;
                            if (editData.isManyAnswers) {
                              newOptions = editData.options!.map((o, i) =>
                                i === idx ? { ...o, isCorrect: checked } : o,
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
                        <FaRegTrashAlt
                          className={`
                          ${editData.options!.length <= 2 ? "opacity-50" : ""}`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`mt-2 px-3 py-1 rounded-lg text-primary-darkest ${
                    (editData.options?.length || 0) >= 6
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if ((editData.options?.length || 0) < 6) {
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
                    }
                  }}
                  disabled={(editData.options?.length || 0) >= 6}
                >
                  + Thêm đáp án
                </button>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-primary-light hover:bg-primary text-primary-darkest
                disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={!isChanged}
              >
                Lưu
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => {
                  setIsEdit(false);
                  setEditData(question);
                }}
              >
                Hủy
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <span className="font-semibold">Mô tả:</span>{" "}
              <MarkdownInput content={question.description} />
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
                ? (question.options?.filter((o) => o.isCorrect).length || 0) > 1
                  ? "Trắc nghiệm nhiều đáp án"
                  : "Trắc nghiệm 1 đáp án"
                : "Tự luận"}
            </div>
            {question.fileName && (
              <div className="mb-3">
                <span className="font-semibold">File đính kèm:</span>{" "}
                <span
                  className="text-primary-darker underline cursor-pointer"
                  onClick={handleDownload}
                >
                  {question.fileName}
                </span>
              </div>
            )}
            <div className="mb-3">
              <span className="font-semibold">Cập nhật lần cuối:</span>{" "}
              {new Date(question.lastModified).toLocaleString("vi-VN")}
            </div>
            {question.questionType === "ESSAY" && (
              <div className="mb-3">
                <span className="font-semibold">Tiêu chí chấm điểm:</span>{" "}
                {question.scoringCriteria || (
                  <span className="italic text-gray-400">(Không có)</span>
                )}
              </div>
            )}
            {question.questionType === "MULTIPLE_CHOICE" &&
              question.options && (
                <div className="mb-3">
                  <span className="font-semibold">Đáp án chi tiết:</span>
                  <ul className="mt-2 space-y-1">
                    {question.options.map((opt, idx) => (
                      <li
                        key={opt.id}
                        className={`flex gap-2 ${
                          opt.isCorrect
                            ? "text-green-700 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="inline-block w-6 font-bold">
                          {String.fromCharCode(65 + idx)}.
                        </span>{" "}
                        <MarkdownInput content={opt.description} />
                        {opt.isCorrect && (
                          <span className="ml-2 bg-primary-light text-primary-darkest px-2 py-0.5 rounded-full text-xs">
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
