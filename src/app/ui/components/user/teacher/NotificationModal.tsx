import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { Button } from "../../_common/Button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IoReturnUpBack } from "react-icons/io5";
import { Input } from "../../_common/text-field/Input";
import {
  createClassNotification,
  updateClassNotification,
} from "@/app/lib/services/notification";
import TextArea from "../../_common/text-field/TextArea";
import Tooltip from "../../_common/Tooltip";

const NotificationModal = ({
  onGoBack,
  returnButton = false,
  onClose,
  classId,
  notification,
}: {
  onGoBack?: () => void;
  returnButton?: boolean;
  onClose: (value: boolean) => void;
  classId: string;
  notification?: {
    id: string;
    title: string;
    content: string;
    type: string;
  } | null;
}) => {
  const [title, setTittle] = useState<string | undefined>("");
  const [content, setContent] = useState<string | undefined>("");

  const handleSubmit = async () => {
    try {
      const body = notification
        ? {
            title: title,
            content: content,
          }
        : {
            receiverId: classId,
            title: title,
            content: content,
          };
      if (notification) {
        await updateClassNotification(classId, notification.id, body);
      } else {
        await createClassNotification(classId, body);
      }
      toast.success(
        notification
          ? "Chỉnh sửa thông báo thành công"
          : "Thêm thông báo thành công",
        {
          position: "top-right",
          autoClose: 2500,
          pauseOnHover: false,
          closeOnClick: true,
        },
      );
    } catch (error) {
      console.error("Failed to create question:", error);
      toast.error(
        notification
          ? "CHỉnh sửa thông báo thất bại"
          : "Thêm thông báo thất bại",
        {
          position: "top-right",
          autoClose: 2500,
          pauseOnHover: false,
          closeOnClick: true,
        },
      );
    }
    setTittle("");
    setContent("");
    onClose(false);
  };

  useEffect(() => {
    if (notification) {
      setTittle(notification.title);
      setContent(notification.content);
    }
  }, [notification]);

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => onClose(false)}
    >
      <motion.div
        className="bg-white p-5 rounded-lg w-2/3 sm:w-1/2 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between pb-3 border-b">
          {returnButton ? (
            <Tooltip text="Quay lại">
              <IoReturnUpBack
                className="cursor-pointer text-[25px] text-primary-dark hover:text-primary-darkest"
                onClick={onGoBack}
              />
            </Tooltip>
          ) : (
            <div className="w-6"></div>
          )}
          <h1 className="text-lg font-bold">Thêm thông báo</h1>
          <Tooltip text="Đóng">
            <RxCross1
              className="cursor-pointer hover:text-primary-darkest"
              onClick={() => onClose(false)}
            />
          </Tooltip>
        </div>
        <div className="mt-3">
          <label className="font-medium">Tiêu đề</label>
          <Input value={title} onChange={(e) => setTittle(e.target.value)} />
        </div>
        <div className="mt-3">
          <label className="font-medium">Nội dung</label>
          <TextArea
            className="min-h-32 max-h-80"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end mt-4 border-t pt-3">
          <Button className="px-4 py-2 rounded-lg" onClick={handleSubmit}>
            Lưu
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationModal;
