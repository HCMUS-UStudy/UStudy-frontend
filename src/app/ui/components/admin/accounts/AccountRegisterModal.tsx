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
        gender: item.gender,
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
        gender: item.gender,
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
      const response = await confirmRegister(userId);

      if (response.status === 200) {
        toast.success("Phê duyệt thành công! Đang chuyển hướng...", {
          position: "bottom-right",
          autoClose: 3000,
        });

        fetchStudents();
        fetchTeachers();
      } else {
        toast.error("Đã xảy ra lỗi khi phê duyệt.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    setLoading(true);

    try {
      const response = await rejectRegister(userId);

      if (response.status === 200) {
        toast.success("Từ chối thành công! Đang chuyển hướng...", {
          position: "bottom-right",
          autoClose: 3000,
        });

        fetchStudents();
        fetchTeachers();
      } else {
        toast.error("Đã xảy ra lỗi khi phê duyệt.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
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
      <Button onClick={handleOpenModal} className="pl-6 pr-6 mr-4">
        {buttonLabel}
      </Button>
      <Dialog
        className="min-h-[90vh] min-w-[80vw]"
        isOpen={showModalRe}
        onClose={() => setShowModalRe(false)}
      >
        <DialogHeader>Thông tin người dùng cần xác nhận</DialogHeader>
        <DialogContent>
          <Tabs value="students">
            <TabList>
              <Tab label="Học viên" value="students" />
              <Tab label="Giáo viên" value="teachers" />
            </TabList>

            <TabPanel value="students">
              <Table>
                <TableHeader
                  columns={[
                    "Tên",
                    "Email",
                    "Địa chỉ",
                    "Ngày sinh",
                    "Số điện thoại",
                    "Giới tính",
                    "Hành động",
                  ]}
                />
                <TableBody isLoading={loading}>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.address}</TableCell>
                      <TableCell>
                        {new Date(student.birthday).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>{student.gender}</TableCell>
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
              <Table>
                <TableHeader
                  columns={[
                    "Tên",
                    "Email",
                    "Địa chỉ",
                    "Ngày sinh",
                    "Số điện thoại",
                    "Giới tính",
                    "Hành động",
                  ]}
                />
                <TableBody isLoading={loading}>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.address}</TableCell>
                      <TableCell>
                        {new Date(teacher.birthday).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>{teacher.gender}</TableCell>
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
