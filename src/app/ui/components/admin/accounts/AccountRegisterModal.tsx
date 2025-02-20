"use client";

import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Button } from "@/app/ui/components/_common/Button";
import Pagination from "@/app/ui/components/_common/Pagination";
import { RegisterItem } from "@/app/types/type";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import {
  confirmRegister,
  getRegister,
  rejectRegister,
} from "@/app/lib/services/register";
import { getAllRolesByDefault } from "@/app/lib/services/role";
import { FaList } from "react-icons/fa6";

interface AccountRegisterModalProps {
  buttonLabel: string;
}

const AccountRegisterModal: React.FC<AccountRegisterModalProps> = ({
  buttonLabel,
}) => {
  const [showModalRe, setShowModalRe] = useState(false);
  const handleOpenModal = () => setShowModalRe(true);

  const [students, setStudents] = useState<RegisterItem[]>([]);
  const [teachers, setTeachers] = useState<RegisterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPageStu, setCurrentPageStu] = useState(1);
  const [currentPageTea, setCurrentPageTea] = useState(1);
  const [totalPagesStu, setTotalPagesStu] = useState(0);
  const [totalPagesTea, setTotalPagesTea] = useState(0);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const [currentTab, setCurrentTab] = useState("students");

  const toggleSelectMode = () => {
    setIsSelecting(!isSelecting);
    if (isSelecting) setSelectedUsers([]); // Reset khi tắt chọn nhiều
  };

  const toggleSelection = (id: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id],
    );
  };

  const toggleSelectAll = () => {
    if (currentTab == "students") {
      if (selectedUsers.length === students.length) {
        setSelectedUsers([]); // Bỏ chọn tất cả
      } else {
        setSelectedUsers(students.map((s) => s.id)); // Chọn tất cả
      }
    } else {
      if (selectedUsers.length === teachers.length) {
        setSelectedUsers([]); // Bỏ chọn tất cả
      } else {
        setSelectedUsers(teachers.map((s) => s.id)); // Chọn tất cả
      }
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người dùng.");
      return;
    }
    setLoading(true);
    try {
      const defaultRole = currentTab === "students" ? "STUDENT" : "TEACHER";
      const roleResponse = await getAllRolesByDefault(defaultRole);
      console.log(roleResponse);
      const roleId = roleResponse[0]?.id; // Lấy ID đầu tiên trong mảng

      if (!roleId) {
        throw new Error("Không tìm thấy roleId.");
      }
      if (action === "approve") {
        console.log(selectedUsers);
        await confirmRegister(selectedUsers, roleId);
        toast.success("Phê duyệt thành công! Đang chuyển hướng...", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        await rejectRegister(selectedUsers);
        toast.success("Từ chối thành công! Đang chuyển hướng...", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
      setSelectedUsers([]);
      fetchStudents();
      fetchTeachers();
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const getGenderDisplayName = (genderName: string) => {
    const genderMapping: Record<string, string> = {
      MALE: "Nam",
      FEMALE: "Nữ",
    };

    return genderMapping[genderName] || genderName;
  };

  const fetchStudents = async () => {
    let StudentData: RegisterItem[] = [];
    setLoading(true);

    try {
      const response = await getRegister("STUDENT", currentPageStu - 1);

      StudentData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        address: item.address,
        birthday: item.birthday,
        phone: item.phone,
        gender: getGenderDisplayName(item.gender),
      }));

      // Set total pages for students based on API response
      setTotalPagesStu(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setStudents(StudentData);
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    let TeacherData: RegisterItem[] = [];
    setLoading(true);

    try {
      const response = await getRegister("TEACHER", currentPageStu - 1);

      TeacherData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        address: item.address,
        birthday: item.birthday,
        phone: item.phone,
        gender: getGenderDisplayName(item.gender),
      }));
      // Set total pages for teachers based on API response
      setTotalPagesTea(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setTeachers(TeacherData);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModalRe) {
      fetchStudents();
      fetchTeachers();
    }
  }, [currentPageStu, currentPageTea, showModalRe]); // Trigger fetch when page changes

  const handleApprove = async (userId: string) => {
    setLoading(true);

    try {
      const defaultRole = currentTab === "students" ? "STUDENT" : "TEACHER";
      const roleResponse = await getAllRolesByDefault(defaultRole);

      const roleId = roleResponse[0]?.id; // Lấy ID đầu tiên trong mảng

      if (!roleId) {
        throw new Error("Không tìm thấy roleId.");
      }

      await confirmRegister([userId], roleId);

      toast.success("Phê duyệt thành công! Đang chuyển hướng...", {
        position: "bottom-right",
        autoClose: 3000,
      });

      fetchStudents();
      fetchTeachers();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    setLoading(true);

    try {
      await rejectRegister([userId]);

      toast.success("Từ chối thành công! Đang chuyển hướng...", {
        position: "bottom-right",
        autoClose: 3000,
      });

      fetchStudents();
      fetchTeachers();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle previous and next page functions
  const handlePreviousPageStu = () => {
    if (currentPageStu > 1) setCurrentPageStu(currentPageStu - 1);
  };

  const handleNextPageStu = () => {
    if (currentPageStu < totalPagesStu) setCurrentPageStu(currentPageStu + 1);
  };

  const handlePreviousPageTea = () => {
    if (currentPageTea > 1) setCurrentPageTea(currentPageTea - 1);
  };

  const handleNextPageTea = () => {
    if (currentPageTea < totalPagesTea) setCurrentPageTea(currentPageTea + 1);
  };

  return (
    <>
      <ToastContainer />
      <Button onClick={handleOpenModal} className="pl-6 pr-6 mr-4 rounded-2xl">
        {buttonLabel}
      </Button>
      <Dialog
        className="min-h-[90vh] min-w-[80vw]"
        isOpen={showModalRe}
        onClose={() => setShowModalRe(false)}
      >
        <DialogHeader>Thông tin người dùng cần xác nhận</DialogHeader>
        <DialogContent>
          <Tabs value="students" onTabChange={(value) => setCurrentTab(value)}>
            <TabList>
              <Tab label="Học viên" value="students" />
              <Tab label="Giáo viên" value="teachers" />
            </TabList>

            <TabPanel value="students">
              <div className="mb-4 flex gap-2">
                <Button onClick={toggleSelectMode} className="mr-2">
                  {isSelecting ? "Hủy bỏ" : "Chọn nhiều"}
                </Button>

                {isSelecting && (
                  <>
                    <Button
                      onClick={() => toggleSelectAll()}
                      className="bg-blue-500 text-white p-2"
                    >
                      <FaList className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("approve")}
                      className="bg-green-500 text-white p-2"
                    >
                      <FaCheck className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("reject")}
                      className="bg-red-500 text-white p-2"
                    >
                      <FaTimes className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              <Table>
                <TableHeader
                  columns={[
                    ...(isSelecting ? ["✔ Chọn"] : []),
                    "Tên",
                    "Email",
                    "Địa chỉ",
                    "Ngày sinh",
                    "Số điện thoại",
                    "Giới tính",
                    ...(!isSelecting ? ["Hành động"] : []),
                  ]}
                />
                <TableBody isLoading={loading}>
                  {students.map((student) => (
                    <TableRow
                      key={student.id}
                      className={` ${
                        selectedUsers.includes(student.id)
                          ? "bg-green-100"
                          : "hover:bg-green-100"
                      }`}
                    >
                      {isSelecting && (
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(student.id)}
                            onChange={() => toggleSelection(student.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.address}</TableCell>
                      <TableCell>
                        {new Date(student.birthday).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      {!isSelecting && (
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="basic"
                              onClick={() => handleApprove(student.id)}
                              className="bg-success text-white hover:bg-success/80"
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="basic"
                              onClick={() => handleReject(student.id)}
                              className="bg-error text-white hover:bg-error/80 ml-4"
                            >
                              <FaTimes />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPageStu}
                totalPages={totalPagesStu}
                handlePageClick={(page) => setCurrentPageStu(page)}
                handlePreviousPage={handlePreviousPageStu}
                handleNextPage={handleNextPageStu}
              />
            </TabPanel>

            <TabPanel value="teachers">
              <div className="mb-4 flex gap-2">
                <Button onClick={toggleSelectMode} className="mr-2">
                  {isSelecting ? "Hủy bỏ" : "Chọn nhiều"}
                </Button>

                {isSelecting && (
                  <>
                    <Button
                      onClick={() => toggleSelectAll()}
                      className="bg-blue-500 text-white p-2"
                    >
                      <FaList className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("approve")}
                      className="bg-green-500 text-white p-2"
                    >
                      <FaCheck className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleBulkAction("reject")}
                      className="bg-red-500 text-white p-2"
                    >
                      <FaTimes className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
              <Table>
                <TableHeader
                  columns={[
                    ...(isSelecting ? ["✔ Chọn"] : []),
                    "Tên",
                    "Email",
                    "Địa chỉ",
                    "Ngày sinh",
                    "Số điện thoại",
                    "Giới tính",
                    ...(!isSelecting ? ["Hành động"] : []),
                  ]}
                />
                <TableBody isLoading={loading}>
                  {teachers.map((teacher) => (
                    <TableRow
                      key={teacher.id}
                      className={`hover:bg-green-100 ${
                        selectedUsers.includes(teacher.id) ? "bg-green-100" : ""
                      }`}
                    >
                      {isSelecting && (
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(teacher.id)}
                            onChange={() => toggleSelection(teacher.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.address}</TableCell>
                      <TableCell>
                        {new Date(teacher.birthday).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>{teacher.gender}</TableCell>
                      {!isSelecting && (
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="basic"
                              onClick={() => handleApprove(teacher.id)}
                              className="bg-success text-white hover:bg-success/80"
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="basic"
                              onClick={() => handleReject(teacher.id)}
                              className="bg-error text-white hover:bg-error/80 ml-4"
                            >
                              <FaTimes />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPageTea}
                totalPages={totalPagesTea}
                handlePageClick={(page) => setCurrentPageTea(page)}
                handlePreviousPage={handlePreviousPageTea}
                handleNextPage={handleNextPageTea}
              />
            </TabPanel>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountRegisterModal;
