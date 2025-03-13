"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { ArrowRightCircle } from "lucide-react";
import { getListUserDetail } from "@/app/lib/services/user";
import { ClassItem, ClassUserItem } from "@/app/types/type";
import {
  addMembers,
  getAllClasses,
  getListUserClass,
} from "@/app/lib/services/class";
import ApproveAccountTable from "./ApproveAccountTable";

interface ApproveClassStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

// interface FailedMember {
//   genId: string;
//   name: string;
// }

const ApproveClassStudentModal: React.FC<ApproveClassStudentModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [userDetail, setUserDetail] = useState<{
    genId: string;
    name: string;
  } | null>(null);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [stuClass, setStuClass] = useState<ClassUserItem[]>([]);

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isSelectingClass, setIsSelectingClass] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentPageCl] = useState(1);
  const [currentPageStuCl] = useState(1);
  const [totalPagesCl, setTotalPagesCl] = useState(0);
  const [totalPagesStuCl, setTotalPagesStuCl] = useState(0);

  useEffect(() => {
    if (isOpen && userId) {
      fetchDetailUser(userId);
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchClasses();
      fetchClassStudentsIn();
    }
  }, [currentPageCl, currentPageStuCl, userId]);

  const fetchDetailUser = async (userId: string) => {
    try {
      const response = await getListUserDetail(userId); // Lấy tối đa 100 lớp
      console.log(response);
      setUserDetail({
        genId: response.data.genId,
        name: response.data.name,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp:", error);
    }
  };

  const fetchClasses = async () => {
    let ClassData: ClassItem[] = [];
    setLoading(true);

    try {
      const response = await getAllClasses("", "", "", currentPageCl - 1, 5);

      ClassData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        course: item.course,
        fee: item.fee,
        room: item.room,
        grade: item.grade,
      }));

      // Set total pages for students based on API response
      console.log(totalPagesCl);
      setTotalPagesCl(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setClasses(ClassData);
      setLoading(false);
    }
  };

  const fetchClassStudentsIn = async () => {
    if (!userId) {
      toast.error("Vui lòng chọn một học sinh.");
      return;
    }
    let ClassStudentData: ClassUserItem[] = [];
    setLoading(true);

    try {
      const response = await getListUserClass(
        userId as string,
        "",
        currentPageStuCl,
        5,
      );

      ClassStudentData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        course: item.course,
        grade: item.grade,
      }));

      // Set total pages for students based on API response
      console.log(totalPagesStuCl);
      setTotalPagesStuCl(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setStuClass(ClassStudentData);
      setLoading(false);
    }
  };

  const toggleSelectMode = () => {
    console.log(loading);
    setIsSelectingClass(!isSelectingClass);
    if (isSelectingClass) setSelectedClasses([]); // Reset khi tắt chọn nhiều
  };

  const toggleSelection = (id: string) => {
    setSelectedClasses((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((classId) => classId !== id)
        : [...prevSelected, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedClasses.length === classes.length) {
      setSelectedClasses([]); // Bỏ chọn tất cả
    } else {
      setSelectedClasses(classes.map((s) => s.id)); // Chọn tất cả
    }
  };

  const handleBulkAction = async () => {
    if (selectedClasses.length === 0) {
      toast.error("Vui lòng chọn ít nhất một lớp học.");
      return;
    }

    if (!userId) {
      toast.error("Vui lòng chọn một học sinh.");
      return;
    }

    setLoading(true);
    try {
      // Dùng Promise.all để chạy nhiều request cùng lúc
      const responses: Array<{ data: { failedCount: number } }> =
        await Promise.all(
          selectedClasses.map((classId: string) =>
            addMembers([userId], classId, "STUDENT"),
          ),
        );

      let failedCount = 0;
      responses.forEach(
        (response: { data: { failedCount: number } }, index: number) => {
          if (response.data.failedCount > 0) {
            failedCount++;
            toast.error(`Không thể thêm vào lớp ${selectedClasses[index]}`, {
              position: "bottom-right",
              autoClose: 5000,
            });
          }
        },
      );

      if (failedCount === 0) {
        toast.success("Thêm học viên vào tất cả lớp thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }

      setSelectedClasses([]);

      // Cập nhật dữ liệu sau khi thêm
      setTimeout(() => {
        fetchClasses();
        fetchClassStudentsIn();
      }, 500);
    } catch (error) {
      console.error("Lỗi khi thêm thành viên:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (classId: string) => {
    setLoading(true);

    if (!userId) {
      toast.error("Vui lòng chọn một học sinh.");
      return;
    }

    try {
      const response = await addMembers([userId], classId, "STUDENT");

      if (response.data?.failedCount > 0) {
        toast.error(`Thêm không thành công vào lớp ${classId}`, {
          position: "bottom-right",
          autoClose: 5000,
        });
      } else {
        toast.success(`Thêm học viên vào lớp ${classId} thành công!`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }

      // Cập nhật dữ liệu
      setTimeout(() => {
        fetchClassStudentsIn();
        fetchClasses();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Dialog
        className="min-h-[90vh] min-w-[80vw] m-4"
        isOpen={isOpen}
        onClose={onClose}
      >
        <DialogHeader>Thông tin lớp để duyệt HS, GV vào</DialogHeader>
        <div className="flex items-center gap-4 p-4 border rounded-lg shadow bg-white">
          <div className="flex-shrink-0">
            <ArrowRightCircle size={32} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {userDetail?.genId || "Không có dữ liệu"} -{" "}
              {userDetail?.name || "Không có dữ liệu"}
            </h2>
          </div>
        </div>

        {userId ? (
          <>
            <DialogContent>
              <div className="grid grid-cols-2 gap-4">
                <ApproveAccountTable
                  title="Danh sách lớp"
                  fetchData={(page, searchQuery, courseQuery) =>
                    getAllClasses(searchQuery, courseQuery, "", page, 5)
                  }
                  classes={classes}
                  isSelecting={isSelectingClass}
                  selectedClasses={selectedClasses}
                  toggleSelection={toggleSelection}
                  toggleSelectMode={toggleSelectMode}
                  toggleSelectAll={toggleSelectAll}
                  handleBulkAction={handleBulkAction}
                  handleAdd={handleAdd}
                />

                <ApproveAccountTable
                  title="Danh sách lớp đã xác nhận"
                  fetchData={(page, searchQuery) =>
                    getListUserClass(userId, searchQuery, page, 3)
                  }
                  classes={stuClass}
                />
              </div>
            </DialogContent>
          </>
        ) : (
          <p className="text-center text-gray-600 font-semibold mt-10">
            Vui lòng chọn học sinh trước khi tiếp tục.
          </p>
        )}
      </Dialog>
    </>
  );
};

export default ApproveClassStudentModal;
