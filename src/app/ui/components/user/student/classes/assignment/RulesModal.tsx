import React from "react";
import { Button } from "@/app/ui/components/_common/Button";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assignmentTitle: string;
  duration?: number;
  currentAttempts: number;
  maxAttempts: number;
}

const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  assignmentTitle,
  duration,
  currentAttempts,
  maxAttempts,
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const durationInMinutes = duration ? Math.ceil(duration / 60) : 0;
  const remainingAttempts = maxAttempts - currentAttempts;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      onConfirm();
    } catch (error) {
      console.error("Có lỗi xảy ra khi xác nhận:", error);
      setIsConfirming(false);
    }
  };

  if (!isOpen && !isConfirming) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        opacity: isConfirming ? 1 : undefined,
        pointerEvents: isConfirming ? "auto" : undefined,
      }}
      onClick={!isConfirming ? onClose : undefined}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary-darker text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold">Nội quy làm bài</h2>
          <p className="text-primary-lighter mt-1">{assignmentTitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Trước khi bắt đầu, vui lòng đọc kỹ các nội quy sau:
            </h3>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">•</span>
                <span>
                  Bạn đã làm{" "}
                  <span className="font-semibold">
                    {currentAttempts}/{maxAttempts}
                  </span>{" "}
                  lần (còn lại {remainingAttempts} lần).
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">•</span>
                <span>
                  Bài kiểm tra sẽ được thực hiện trong chế độ{" "}
                  <span className="font-semibold">toàn màn hình bắt buộc</span>.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">•</span>
                <span>
                  Không được{" "}
                  <span className="font-semibold">tải lại trang</span> hoặc{" "}
                  <span className="font-semibold">thoát khỏi bài kiểm tra</span>{" "}
                  khi đang làm bài.
                </span>
              </li>
              {/* <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">•</span>
                <span>Không được <span className="font-semibold">chụp màn hình</span> hoặc <span className="font-semibold">lưu lại đề bài</span> dưới mọi hình thức.</span>
              </li> */}
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">•</span>
                <span>
                  Nghiêm cấm mọi hành vi{" "}
                  <span className="font-semibold">gian lận</span> trong quá
                  trình làm bài.
                </span>
              </li>
              {durationInMinutes > 0 && (
                <li className="flex items-start">
                  <span className="text-red-500 font-bold mr-2">•</span>
                  <span>
                    Bạn có{" "}
                    <span className="font-semibold">
                      {durationInMinutes} phút
                    </span>{" "}
                    để hoàn thành bài kiểm tra.
                  </span>
                </li>
              )}
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">Lưu ý quan trọng:</span> Hệ
                    thống sẽ tự động nộp bài khi hết thời gian. Hãy chắc chắn
                    bạn đã hoàn thành bài làm trước khi thời gian kết thúc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-between items-center">
          <Button
            onClick={onClose}
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`bg-primary-darker hover:bg-primary-darkest text-white ${
              isConfirming ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isConfirming ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang vào trang làm bài...
              </div>
            ) : (
              "Tôi đã hiểu và đồng ý"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
