"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { getListUserDetail } from "@/app/lib/services/user";
import { AccountDetailItem, ClassUserItem } from "@/app/types/type";
import { getListUserClass } from "@/app/lib/services/class";
import ApproveClassStudentModal from "@/app/ui/components/admin/accounts/ApproveClassStudentModal";
import Image from "next/image";

const AccountDetail = () => {
  const params = useParams();
  const userId = Array.isArray(params.userID)
    ? params.userID[0]
    : params.userID;
  const [user, setUser] = useState<AccountDetailItem>();
  const [classes, setClasses] = useState<ClassUserItem[]>([]);
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectUserId, setSelectUserId] = useState<string | null>(null);

  const getStatusDisplayName = (status: string) => {
    const statusMapping: Record<string, string> = {
      ACTIVE: "Hoạt động",
      DELETED: "Đã xóa",
      LOCKED: "Đã khóa",
    };

    return statusMapping[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      ACTIVE: "text-green-500 font-bold",
      DELETED: "text-red-500 font-bold",
      LOCKED: "text-yellow-500 font-bold",
    };

    return statusColors[status] || "text-gray-500";
  };

  const getRoleDisplayName = (roleName: string) => {
    const roleMapping: Record<string, string> = {
      Admin: "Admin",
      Teacher: "Giáo viên",
      Parent: "Phụ huynh",
      Clerk: "Giáo vụ",
      Student: "Học sinh",
    };

    return roleMapping[roleName] || roleName;
  };

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const response = await getListUserDetail(userId as string);
        setUser(response.data);

        // Chỉ gọi API lấy danh sách lớp học nếu user là Student hoặc Teacher
        if (["Student", "Teacher"].includes(response.data.role?.name)) {
          fetchClasses(response.data.role?.name);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const fetchClasses = async (role: string) => {
    if (!["Student", "Teacher"].includes(role)) return; // Kiểm tra lại role

    try {
      const response = await getListUserClass(userId as string, "", 0, 100);
      setClasses(response.content);
    } catch (error) {
      console.error("Failed to fetch user classes:", error);
    }
  };

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push("/admin/accounts");
    }, 500);
  };

  const handleEditClick = (id?: string) => {
    if (!id) {
      console.warn("ID không hợp lệ!");
      return;
    }
    setSelectUserId(id);
    setIsModalOpen(true);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="flex flex-col px-4 py-6 gap-4"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        >
          <div className="flex justify-between items-center">
            <div
              className="flex items-center cursor-pointer p-4 rounded-full bg-primary-light hover:bg-primary transition duration-300"
              onClick={handleBack}
            >
              <IoChevronBackOutline />
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
                />
                <div className="text-3xl font-bold drop-shadow-lg">
                  {user.name}
                </div>
              </div>
            )}
            <div className="flex items-center cursor-pointer p-3 rounded-full bg-red-500 hover:bg-red-600 transition duration-300 shadow-lg">
              <FaTrashAlt className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex flex-col mt-6 gap-4 justify-center items-center text-lg w-[60%] mx-auto bg-white/10 p-6 rounded-lg shadow-md">
            <table className="min-w-full table-auto border-collapse">
              <tbody>
                {[
                  { label: "Email", value: user?.email },
                  { label: "Mã số", value: user?.genId },
                  {
                    label: "Giới tính",
                    value: user?.gender === "FEMALE" ? "Nữ" : "Nam",
                  },
                  {
                    label: "Ngày tạo",
                    value: user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                      : "N/A",
                  },
                  {
                    label: "Vai trò",
                    value: user?.role
                      ? getRoleDisplayName(user.role.name)
                      : "Không xác định",
                  },
                  {
                    label: "Trạng thái",
                    value: (
                      <span className={getStatusColor(user?.status || "")}>
                        {user?.status
                          ? getStatusDisplayName(user.status)
                          : "Không xác định"}
                      </span>
                    ),
                  },
                ].map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/30 hover:bg-white/20 transition duration-300"
                  >
                    <td className="px-4 py-4 font-semibold">{item.label}:</td>
                    <td className="px-4 py-4 flex justify-between items-center">
                      {item.value}
                      <FaEdit className="text-primary-dark hover:text-primary-darker cursor-pointer" />
                    </td>
                  </tr>
                ))}
                {["Student", "Teacher"].includes(user?.role?.name ?? "") && (
                  <tr className="border-b border-white/30 hover:bg-white/20 transition duration-300">
                    <td className="px-4 py-4 font-semibold">
                      Danh sách lớp học:
                    </td>
                    <td className="px-4 py-4 flex justify-between items-center">
                      {Array.isArray(classes) && classes.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto rounded-lg p-2">
                          <ul className="list-disc pl-4">
                            {classes.map((classItem, index) => (
                              <li key={index}>
                                {`${classItem.name} (${classItem.course.name} - ${classItem.grade.name})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        "Không có lớp học nào"
                      )}
                      <FaEdit
                        className="text-primary-dark hover:text-primary-darker cursor-pointer"
                        onClick={() => handleEditClick(user?.id)} // Truyền ID vào
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      {isModalOpen && (
        <ApproveClassStudentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={selectUserId}
        />
      )}
    </AnimatePresence>
  );
};

export default AccountDetail;
