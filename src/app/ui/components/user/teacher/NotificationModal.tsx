import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Button } from "../../_common/Button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IoReturnUpBack } from "react-icons/io5";
import { Input } from "../../_common/text-field/Input";
import { createClassNotification } from "@/app/lib/services/notification";
import TextArea from "../../_common/text-field/TextArea";

const NotificationModal = ({
  onGoBack,
  onClose,
  classId,
}: {
  onGoBack: () => void;
  onClose: (value: boolean) => void;
  classId: string;
}) => {
  const [title, setTittle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    const body = {
      receiverId: classId,
      title: title,
      content: content,
    };
    try {
      await createClassNotification(body);
      toast.success("Thêm thông báo thành công", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    } catch (error) {
      console.error("Failed to create question:", error);
      toast.error("Thêm thông báo thất bại", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    }
    setTittle("");
    setContent("");
    onClose(false);
  };

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => onClose(false)}
    >
      <motion.div
        className="bg-white p-5 rounded-lg w-1/2 shadow-lg"
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
          <h1 className="text-lg font-bold">Thêm thông báo</h1>
          <RxCross1
            className="cursor-pointer hover:text-primary-darkest"
            onClick={() => onClose(false)}
          />
        </div>
        <div className="mt-3">
          <label className="font-medium">Tiêu đề</label>
          <Input value={title} onChange={(e) => setTittle(e.target.value)} />
        </div>
        <div className="mt-3">
          <label className="font-medium">Nội dung</label>
          <TextArea
            className="min-h-24 max-h-80"
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
