import React from "react";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaTrash, FaCheckCircle } from "react-icons/fa";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  type?: "confirm" | "delete" | "success" | "warning";
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  type = "confirm",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
}) => {
  if (!isOpen) return null;

  // Xác định icon và màu theo loại modal
  const icon =
    type === "delete" ? (
      <FaTrash className="text-red-500 text-3xl" />
    ) : type === "success" ? (
      <FaCheckCircle className="text-green-500 text-3xl" />
    ) : type === "warning" ? (
      <FaExclamationCircle className="text-yellow-500 text-3xl" />
    ) : (
      <FaExclamationCircle className="text-blue-500 text-3xl" />
    );

  const confirmBtnColor =
    type === "delete"
      ? "bg-red-500 hover:bg-red-600"
      : type === "success"
        ? "bg-green-500 hover:bg-green-600"
        : type === "warning"
          ? "bg-primary-dark hover:bg-primary-light"
          : "bg-blue-500 hover:bg-blue-600";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-[400px] text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-3">{icon}</div>

        {/* Tiêu đề */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        {/* Nội dung */}
        <p className="text-gray-600 mt-2 text-sm">{message}</p>

        {/* Nút hành động */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition ${confirmBtnColor}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;
