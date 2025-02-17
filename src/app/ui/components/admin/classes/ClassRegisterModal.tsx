"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import { RegisterClassItem, StudentItem } from "@/app/types/type";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import {
  confirmRegister,
  getClassRegister,
  rejectRegister,
} from "@/app/lib/services/register";
import { getAllRolesByDefault } from "@/app/lib/services/role";
import ClassTable from "./ClassTable";
import { getListStudent } from "@/app/lib/services/class";

interface ClassRegisterModalProps {
  buttonLabel: string;
}

const ClassRegisterModal: React.FC<ClassRegisterModalProps> = ({
  buttonLabel,
}) => {
  const [showModalRe, setShowModalRe] = useState(false);
  const handleOpenModal = () => setShowModalRe(true);

  const [students, setStudents] = useState<RegisterClassItem[]>([]);
  const [teachers, setTeachers] = useState<RegisterClassItem[]>([]);

  const [studentsClass, setStudentsClass] = useState<StudentItem[]>([]);
  //const [teachers, setTeachers] = useState<RegisterClassItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [currentPageStu, setCurrentPageStu] = useState(1);
  const [currentPageTea, setCurrentPageTea] = useState(1);
  const [totalPagesStu, setTotalPagesStu] = useState(0);
  const [totalPagesTea, setTotalPagesTea] = useState(0);

  const [currentPageStuCl, setCurrentPageStuCl] = useState(1);
  //const [currentPageTea, setCurrentPageTea] = useState(1);
  const [totalPagesStuCl, setTotalPagesStuCl] = useState(0);
  //const [totalPagesTea, setTotalPagesTea] = useState(0);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const [selectedUsersCl, setSelectedUsersCl] = useState<string[]>([]);
  const [isSelectingCl, setIsSelectingCl] = useState(false);

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

  const toggleSelectModeCl = () => {
    setIsSelectingCl(!isSelectingCl);
    if (isSelectingCl) setSelectedUsersCl([]); // Reset khi tắt chọn nhiều
  };

  const toggleSelectionCl = (id: string) => {
    setSelectedUsersCl((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id],
    );
  };

  const toggleSelectAllCl = () => {
    console.log(loading);
    if (currentTab == "students") {
      if (selectedUsersCl.length === studentsClass.length) {
        setSelectedUsersCl([]); // Bỏ chọn tất cả
      } else {
        setSelectedUsersCl(studentsClass.map((s) => s.id)); // Chọn tất cả
      }
    } else {
      // if (selectedUsersCl.length === teachers.length) {
      //   setSelectedUsers([]); // Bỏ chọn tất cả
      // } else {
      //   setSelectedUsers(teachers.map((s) => s.id)); // Chọn tất cả
      // }
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
    let StudentData: RegisterClassItem[] = [];
    setLoading(true);

    try {
      const response = await getClassRegister(
        "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
        currentPageStu - 1,
      );

      StudentData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        genId: item.genId,
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

  const fetchStudentsInClass = async () => {
    let StudentClassData: StudentItem[] = [];
    setLoading(true);

    try {
      const response = await getListStudent(
        "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
        "",
        currentPageStuCl - 1,
        5,
      );

      StudentClassData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        gender: getGenderDisplayName(item.gender),
      }));

      // Set total pages for students based on API response
      setTotalPagesStuCl(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setStudentsClass(StudentClassData);
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    let TeacherData: RegisterClassItem[] = [];
    setLoading(true);

    try {
      const response = await getClassRegister(
        "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
        currentPageTea - 1,
      );

      TeacherData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        genId: item.genId,
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
      fetchStudentsInClass();
    }
  }, [currentPageStu, currentPageTea, currentPageStuCl, showModalRe]); // Trigger fetch when page changes

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

  const handlePreviousPageStuCl = () => {
    if (currentPageStuCl > 1) setCurrentPageStuCl(currentPageStuCl - 1);
  };

  const handleNextPageStuCl = () => {
    if (currentPageStuCl < totalPagesStuCl)
      setCurrentPageStu(currentPageStuCl + 1);
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
        className="min-h-[90vh] min-w-[80vw] m-4"
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
              <div className="grid grid-cols-2 gap-4">
                <ClassTable
                  title="Cần xác nhận"
                  users={students}
                  isSelecting={isSelecting}
                  selectedUsers={selectedUsers}
                  toggleSelection={toggleSelection}
                  toggleSelectMode={toggleSelectMode}
                  toggleSelectAll={toggleSelectAll}
                  handleBulkAction={handleBulkAction}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                  currentPage={currentPageStu}
                  totalPages={totalPagesStu}
                  setCurrentPage={setCurrentPageStu}
                  handlePreviousPage={handlePreviousPageStu}
                  handleNextPage={handleNextPageStu}
                />

                <ClassTable
                  title="Đã xác nhận"
                  users={studentsClass}
                  isSelecting={isSelectingCl}
                  selectedUsers={selectedUsersCl}
                  toggleSelection={toggleSelectionCl}
                  toggleSelectMode={toggleSelectModeCl}
                  toggleSelectAll={toggleSelectAllCl}
                  handleBulkAction={handleBulkAction}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                  currentPage={currentPageStuCl}
                  totalPages={totalPagesStuCl}
                  setCurrentPage={setCurrentPageStuCl}
                  handlePreviousPage={handlePreviousPageStuCl}
                  handleNextPage={handleNextPageStuCl}
                />
              </div>
            </TabPanel>

            <TabPanel value="teachers">
              {/* <div className="mb-4 flex gap-2">
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
                      <TableCell>{teacher.genId}</TableCell>
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
              /> */}
              <div className="grid grid-cols-2 gap-4">
                <ClassTable
                  title="Cần xác nhận"
                  users={teachers}
                  isSelecting={isSelecting}
                  selectedUsers={selectedUsers}
                  toggleSelection={toggleSelection}
                  toggleSelectMode={toggleSelectMode}
                  toggleSelectAll={toggleSelectAll}
                  handleBulkAction={handleBulkAction}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                  currentPage={currentPageTea}
                  totalPages={totalPagesTea}
                  setCurrentPage={setCurrentPageTea}
                  handlePreviousPage={handlePreviousPageTea}
                  handleNextPage={handleNextPageTea}
                />

                <ClassTable
                  title="Đã xác nhận"
                  users={studentsClass}
                  isSelecting={isSelectingCl}
                  selectedUsers={selectedUsersCl}
                  toggleSelection={toggleSelectionCl}
                  toggleSelectMode={toggleSelectModeCl}
                  toggleSelectAll={toggleSelectAllCl}
                  handleBulkAction={handleBulkAction}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                  currentPage={currentPageStuCl}
                  totalPages={totalPagesStuCl}
                  setCurrentPage={setCurrentPageStuCl}
                  handlePreviousPage={handlePreviousPageStuCl}
                  handleNextPage={handleNextPageStuCl}
                />
              </div>
            </TabPanel>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClassRegisterModal;
