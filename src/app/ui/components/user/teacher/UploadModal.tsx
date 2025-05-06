import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdUploadFile } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
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
import { FiEdit3 } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import Tooltip from "../../_common/Tooltip";
import { toast } from "react-toastify";

interface UploadModalProps {
  onClose: () => void;
  onUpload: (file: File) => void;
}

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

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customBaseName, setCustomBaseName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.", {
            closeOnClick: true,
            autoClose: 3000,
          });
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

  const handleUpload = () => {
    if (!selectedFile) return;
    if (!customBaseName) {
      toast.error("Tên tệp không được để trống.", {
        pauseOnHover: false,
        closeOnClick: true,
        autoClose: 3000,
      });
      return;
    }

    const extension = selectedFile.name.split(".").pop();
    const newFileName = `${customBaseName}.${extension}`;

    const renamedFile = new File([selectedFile], newFileName, {
      type: selectedFile.type,
    });

    onUpload(renamedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg relative w-[85%] max-w-[620px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-700 text-left">
            Tải tài liệu lên
          </h2>
          <Tooltip text="Đóng">
            <button
              className=" text-gray-500 hover:text-gray-800 transition"
              onClick={onClose}
            >
              <RxCross2 size={24} />
            </button>
          </Tooltip>
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
                  <FaCloudUploadAlt size={60} className="text-primary-dark" />
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
                      selectedFile.name.endsWith(icon.type),
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
                  .{selectedFile.name.split(".").pop()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditing(!isEditing)}>
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
                <button onClick={handleRemoveFile}>
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
              Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
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
                Dung lượng tối đa: <span className="font-medium">10MB</span>
              </p>
            </div>
          </div>
        )}
        <div className="mt-5 mr-1 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`px-5 py-2 rounded-lg text-white transition ${
              selectedFile
                ? "bg-primary-dark hover:bg-primary-darker"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
