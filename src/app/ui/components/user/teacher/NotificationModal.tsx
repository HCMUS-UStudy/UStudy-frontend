import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { Button } from "../../_common/Button";
import { motion } from "framer-motion";
import { IoReturnUpBack } from "react-icons/io5";
import { Input } from "../../_common/text-field/Input";
import {
  createNotification,
  updateNotification,
} from "@/app/lib/services/notification";
import TextArea from "../../_common/text-field/TextArea";
import Tooltip from "../../_common/Tooltip";
import { useCustomToast } from "@/app/lib/hooks/useToast";

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
  const [sendMail, setSendMail] = useState<boolean>(false);
  const { addToast } = useCustomToast();

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
            receiverType: "CLASS",
            sendMail: sendMail,
          };
      if (notification) {
        await updateNotification(notification.id, body);
      } else {
        await createNotification(body);
      }
      addToast.success(
        notification
          ? "Chỉnh sửa thông báo thành công"
          : "Thêm thông báo thành công",
      );
    } catch (error) {
      console.error("Failed to create question:", error);
      addToast.error(
        notification
          ? "CHỉnh sửa thông báo thất bại"
          : "Thêm thông báo thất bại",
      );
    }
    setTittle("");
    setContent("");
    setSendMail(false);
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

        <div className="flex justify-between items-center mt-4 border-t pt-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendMail"
              checked={sendMail}
              onChange={(e) => setSendMail(e.target.checked)}
              className="w-4 h-4 accent-primary-light hover:accent-primary"
            />
            <label htmlFor="sendMail" className="font-medium cursor-pointer">
              Gửi email cho học viên
            </label>
          </div>
          <Button className="px-4 py-2 rounded-lg" onClick={handleSubmit}>
            Lưu
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationModal;
