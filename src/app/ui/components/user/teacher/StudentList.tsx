"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getListMembers } from "@/app/lib/services/class";
import { IoClose } from "react-icons/io5";
import { MemberData } from "@/app/types/type";

const StudentList = ({
  classId,
  onClose,
}: {
  classId: string;
  onClose: () => void;
}) => {
  const [students, setStudents] = useState<MemberData>();

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await getListMembers(classId, "", 0, 100, "STUDENT");
      setStudents(response);
    };
    fetchStudents();
  }, [classId]);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute inset-y-0 right-0 w-[60%] bg-white shadow-lg border-l border-gray-200 z-40 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b shadow-sm">
        <h2 className="text-2xl font-bold">Danh sách học viên</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* Nội dung danh sách */}
      <div className="p-6 overflow-y-auto flex-1">
        <ul className="space-y-3">
          {students ? (
            students.content.map((student) => (
              <li key={student.id} className="p-4 border rounded-lg shadow-sm">
                {student.name}
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Không có học viên nào.</p>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

export default StudentList;
