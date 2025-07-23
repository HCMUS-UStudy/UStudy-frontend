import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdUploadFile } from "react-icons/md";
import { FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { FiEdit3 } from "react-icons/fi";
import Tooltip from "./Tooltip";
import { AnimatePresence, motion } from "framer-motion";
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

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null, baseName: string) => void;
  customBaseName: string;
  setCustomBaseName: (name: string) => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  customBaseName,
  setCustomBaseName,
  isEditing,
  setIsEditing,
  error,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          onChange(null, "");
          return;
        }
        const baseName = file.name.substring(0, file.name.lastIndexOf("."));
        setCustomBaseName(baseName);
        onChange(file, baseName);
      }
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const handleRemoveFile = () => {
    onChange(null, "");
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col max-w-[600px] mt-[6px]">
      {!value ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg text-center cursor-pointer transition duration-300 ${
            isDragActive
              ? "py-[89px] border-primary-dark bg-primary-lighter"
              : "py-12 border-gray-300 hover:border-[#29ba76]"
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
        <div className="flex flex-col gap-3 bg-gray-50 border p-4 rounded-xl max-w-[600px] mb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-fit">
              <div>
                {(() => {
                  const icon = fileTypeIcons.find((icon) =>
                    value?.name.endsWith(icon.type),
                  );
                  return icon ? <div>{icon.icon}</div> : null;
                })()}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded mr-1 pl-2 py-1 text-sm focus:outline-1
                   focus:outline-primary-dark min-w-[70px] max-w-[250px]"
                  placeholder="Tên tệp"
                  value={customBaseName}
                  onChange={(e) => setCustomBaseName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditing(false);
                  }}
                  onBlur={() => setIsEditing(false)}
                  style={{ width: `${customBaseName.length}ch` }}
                />
              ) : (
                <span className="text-gray-800 text-sm font-medium ml-2 truncate max-w-[280px]">
                  {customBaseName}
                </span>
              )}
              <span className="text-gray-800 text-sm">
                .{value?.name.split(".").pop() || ""}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <button type="button" onClick={() => setIsEditing(!isEditing)}>
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
            Kích thước: {value ? (value.size / 1024 / 1024).toFixed(2) : "0"} MB
          </p>
        </div>
      )}
      {!value && (
        <div className="mt-4 mx-1">
          <div className="flex-row items-start justify-between mb-2 text-[13px] text-gray-600 sm:flex sm:gap-2 sm:items-center">
            <p>Hỗ trợ tệp: PDF, DOC, DOCX, PPT, TXT, ZIP, JPG, PNG</p>
            <p>
              Kích thước tối đa: <span className="font-medium">10MB</span>
            </p>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default FileUpload;
