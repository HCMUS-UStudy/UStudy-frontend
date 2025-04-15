import { IoMdNotificationsOutline } from "react-icons/io";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { MdOutlineAssignment } from "react-icons/md";
import { RiFileAddLine } from "react-icons/ri";
import { MdOutlineQuiz } from "react-icons/md";
import { Button } from "../../_common/Button";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import QuizModal from "./QuizModal";
import NotificationModal from "./NotificationModal";
import { AnimatePresence } from "framer-motion"; // Import Framer Motion
import { motion } from "framer-motion"; // Import Framer Motion
import { ClassDetail, ClassTeacher } from "@/app/types";

const EachItem = ({
  Icon,
  title,
  desc,
  onClick,
}: {
  Icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="border p-2 flex flex-col gap-2 rounded-lg cursor-pointer shadow-sm hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex gap-2 items-center p-1">
        {Icon}
        <div className="text-[15px] font-bold">{title}</div>
      </div>
      <div className="text-[14px] mx-2">{desc}</div>
    </div>
  );
};

const AddingModal = ({
  classDetail,
  setAddingModal,
}: {
  classDetail: ClassTeacher | ClassDetail;
  setAddingModal: (value: boolean) => void;
}) => {
  // const [addingQuiz, setAddingQuiz] = useState(false);
  const [activeModal, setActiveModal] = useState("main");
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const handleGoBack = () => {
    setIsNavigatingBack(true);
    setActiveModal("main");
  };

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => setAddingModal(false)}
    >
      <AnimatePresence>
        {activeModal === "main" && (
          <motion.div
            className="flex flex-col gap-5 bg-foreground p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
            initial={isNavigatingBack ? { x: "-100%" } : { x: "0" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between pb-3 border-b border-gray-200 items-center">
              <h1 className="text-lg font-bold ml-1"> Thêm nội dung mới </h1>
              <RxCross1
                className="w-4 h-4 cursor-pointer hover:h-5 hover:w-5"
                onClick={() => setAddingModal(false)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <EachItem
                Icon={
                  <div className="p-1 text-white rounded-lg bg-red-500">
                    <IoMdNotificationsOutline />
                  </div>
                }
                title="Thông báo"
                desc="Thêm thông báo mới cho học viên"
                onClick={() => setActiveModal("notification")}
              />
              <EachItem
                Icon={
                  <div className="p-1 font-bold text-white rounded-lg bg-blue-500">
                    <IoDocumentAttachOutline />
                  </div>
                }
                title="Tài liệu"
                desc="Thêm tài liệu mới cho học viên"
                onClick={() => {}}
              />
              <EachItem
                Icon={
                  <div className="p-1 text-white rounded-lg bg-teal-500">
                    <MdOutlineAssignment />
                  </div>
                }
                title="Bài tập"
                desc="Thêm bài tập mới cho học viên"
                onClick={() => {}}
              />
              <EachItem
                Icon={
                  <div className="p-1 text-white rounded-lg bg-yellow-500">
                    <MdOutlineQuiz />
                  </div>
                }
                title="Quiz"
                desc="Tạo quiz mới cho lớp học"
                onClick={() => {}}
              />
              <EachItem
                Icon={
                  <div className="p-1 text-white rounded-lg bg-purple-500">
                    <RiFileAddLine />
                  </div>
                }
                title="Câu hỏi"
                desc="Thêm câu hỏi quiz mới vào ngân hàng đề"
                onClick={() => setActiveModal("question")}
              />
            </div>
            <div className="flex pt-2 border-t border-gray-200 justify-end">
              <Button
                className="bg-white px-4 py-2 rounded-lg hover:bg-gray-200"
                onClick={() => setAddingModal(false)}
              >
                Hủy
              </Button>
            </div>
          </motion.div>
        )}

        {/* {addingQuiz && <QuizModal setQuizModal={setAddingQuiz} />} */}
        {activeModal === "question" && (
          <QuizModal
            classDetail={classDetail}
            onGoBack={handleGoBack}
            onClose={setAddingModal}
          />
        )}
        {activeModal === "notification" && (
          <NotificationModal
            classId={classDetail.id}
            onGoBack={handleGoBack}
            onClose={setAddingModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddingModal;
