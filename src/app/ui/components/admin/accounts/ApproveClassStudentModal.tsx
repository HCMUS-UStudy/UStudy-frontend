"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { ArrowRightCircle } from "lucide-react";
import { getListUserDetail } from "@/app/lib/services/user";
import { ApproveResponse, ClassItem, ClassUserItem } from "@/app/types";
import {
  addMembers,
  getAllClasses,
  getListUserClass,
} from "@/app/lib/services/class";
import ApproveAccountTable from "./ApproveAccountTable";
import { useCustomToast } from "@/app/lib/hooks/useToast";

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

  const { addToast } = useCustomToast();

  const fetchClasses = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getAllClasses("", currentPageCl - 1, 5);

      // Set total pages for students based on API response
      console.log(totalPagesCl);
      setClasses(response.content);
      setTotalPagesCl(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentPageCl, setClasses, setTotalPagesCl, setLoading, totalPagesCl]);

  const fetchClassStudentsIn = useCallback(async () => {
    if (!userId) {
      addToast.error("Vui lòng chọn một học sinh.");
      return;
    }
    setLoading(true);

    try {
      const response = await getListUserClass(
        userId as string,
        "",
        currentPageStuCl,
        5,
      );

      console.log(totalPagesStuCl);
      setStuClass(response.content);
      setTotalPagesStuCl(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [
    userId,
    currentPageStuCl,
    setStuClass,
    setTotalPagesStuCl,
    setLoading,
    totalPagesStuCl,
  ]);

  const fetchDetailUser = async (userId: string) => {
    try {
      const response = await getListUserDetail(userId);
      setUserDetail({
        genId: response.data.genId,
        name: response.data.name,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp:", error);
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
      addToast.error("Vui lòng chọn ít nhất một lớp học.");
      return;
    }

    if (!userId) {
      addToast.error("Vui lòng chọn một học sinh.");
      return;
    }

    setLoading(true);
    try {
      // Dùng Promise.all để chạy nhiều request cùng lúc
      const responses: Array<ApproveResponse> = await Promise.all(
        selectedClasses.map((classId: string) =>
          addMembers([userId], classId, "STUDENT"),
        ),
      );

      let failedCount = 0;
      responses.forEach((response, index: number) => {
        if (response.failedCount > 0) {
          failedCount++;
          addToast.error(`Không thể thêm vào lớp ${selectedClasses[index]}`);
        }
      });

      if (failedCount === 0) {
        addToast.success("Thêm học viên vào tất cả lớp thành công!");
      }

      setSelectedClasses([]);

      // Cập nhật dữ liệu sau khi thêm
      setTimeout(() => {
        fetchClasses();
        fetchClassStudentsIn();
      }, 500);
    } catch (error) {
      console.error("Lỗi khi thêm thành viên:", error);
      addToast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (classId: string) => {
    setLoading(true);

    if (!userId) {
      addToast.error("Vui lòng chọn một học sinh.");
      return;
    }

    try {
      const response = await addMembers([userId], classId, "STUDENT");

      if (response.failedCount > 0) {
        addToast.error(`Thêm không thành công vào lớp ${classId}`);
      } else {
        addToast.success(`Thêm học viên vào lớp ${classId} thành công!`);
      }

      fetchClassStudentsIn();
      fetchClasses();
    } catch (error) {
      console.log(error);
      addToast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

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
  }, [
    currentPageCl,
    currentPageStuCl,
    fetchClassStudentsIn,
    fetchClasses,
    isOpen,
    userId,
  ]);

  return (
    <>
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
                    getAllClasses(searchQuery, page, 5, courseQuery)
                  }
                  class={classes}
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
                  class={stuClass}
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
