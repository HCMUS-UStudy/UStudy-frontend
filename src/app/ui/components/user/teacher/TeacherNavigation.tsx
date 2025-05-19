import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function TeacherNavigation({
  activeTab,
}: {
  activeTab: string;
}) {
  const navigation = [
    { title: "Thông tin lớp học", urlPush: "" },
    { title: "Thông báo", urlPush: "notification" },
    { title: "Tài liệu", urlPush: "material" },
    { title: "Bài tập", urlPush: "assignment" },
    { title: "Thành viên", urlPush: "members" },
    { title: "Điểm danh", urlPush: "attendance" },
  ];

  const router = useRouter();
  const params = useParams<{ classId: string }>();
  const classId = params?.classId;
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="px-4 mb-2">
      <div className="hidden sm:flex gap-4 border-b border-gray-200 relative">
        {navigation.map((tab, index) => (
          <button
            key={index}
            className={`relative py-2 mx-2 px-2 ${
              activeTab === tab.urlPush
                ? "text-primary-darkest font-semibold"
                : "text-gray-500 hover:text-primary-darkest"
            }`}
            onClick={() => {
              router.push(`/teacher/classes/${classId}/${tab.urlPush}`);
            }}
          >
            {tab.title}
            {activeTab === tab.urlPush && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-darkest"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="sm:hidden relative w-fit" ref={dropdownRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-fit flex justify-between items-center ml-1 px-1 py-2 text-left text-primary-darkest
           text-[15px] gap-2 font-bold border-b-2 border-primary-darkest cursor-pointer"
        >
          {navigation.find((tab) => tab.urlPush === activeTab)?.title ||
            "Chọn mục"}
          <IoIosArrowDown />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-fit mt-1 bg-white shadow rounded-md border">
            {navigation.map((tab, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/teacher/classes/${classId}/${tab.urlPush}`);
                }}
                className={`whitespace-nowrap
                  ${
                    activeTab === tab.urlPush
                      ? "bg-primary-light font-bold text-primary-darkest"
                      : ""
                  } block w-full text-left text-[14px] px-3 py-2 hover:bg-primary-light`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
