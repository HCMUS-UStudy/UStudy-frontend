"use client";

import { useState, useEffect } from "react";
import { Button } from "../Button";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";

interface EditAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (file: File) => Promise<void>;
}

const EditAvatarModal: React.FC<EditAvatarModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSave,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  const handleSave = async () => {
    if (selectedFile) {
      await onSave(selectedFile);
      handleClose();
    }
  };

  const fallbackAvatar = "/bg-login.jpg";
  const oldAvatarSrc =
    currentAvatar && currentAvatar.trim() !== ""
      ? currentAvatar
      : fallbackAvatar;
  const newAvatarSrc = preview;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
          Thay đổi ảnh đại diện
        </h2>

        {/* Avatar Preview */}
        <div className="flex items-center justify-center gap-5 mb-6">
          <div className="relative w-24 h-24 rounded-full border-4 border-gray-300 shadow overflow-hidden">
            <Image
              src={oldAvatarSrc}
              alt="Ảnh cũ"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-3xl text-gray-400">
            <IoIosArrowForward />
          </div>

          <div className="relative w-24 h-24 rounded-full border-4 border-green-500 shadow overflow-hidden">
            {newAvatarSrc ? (
              <Image
                src={newAvatarSrc}
                alt="Ảnh mới"
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src={oldAvatarSrc}
                alt="Ảnh hiện tại"
                fill
                className="object-cover opacity-30"
              />
            )}
          </div>
        </div>

        {/* File Input (Styled) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ảnh mới:
          </label>

          <div className="flex items-center gap-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block bg-primary-lighter text-primary-dark font-semibold py-2 px-4 rounded-lg hover:bg-primary-light transition-all"
            >
              Chọn ảnh
            </label>
            <span className="text-sm text-gray-600 truncate max-w-[200px]">
              {selectedFile?.name || "Chưa có tệp nào được chọn"}
            </span>
          </div>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
            className="hidden"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            onClick={handleClose}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-4 py-2 transition-all"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFile
                ? "bg-primary-dark text-white hover:bg-primary-darker"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAvatarModal;
