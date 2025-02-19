"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import { RegisterClassItem, MemberItem } from "@/app/types/type";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import { getStuClassRegister } from "@/app/lib/services/register";
import ClassTable from "./ClassTable";
import {
  addMembers,
  getListAvailableTea,
  getListMembers,
} from "@/app/lib/services/class";

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

  const [studentsClass, setStudentsClass] = useState<MemberItem[]>([]);
  const [teachersClass, setTeachersClass] = useState<MemberItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [currentPageStu, setCurrentPageStu] = useState(1);
  const [currentPageTea, setCurrentPageTea] = useState(1);
  const [totalPagesStu, setTotalPagesStu] = useState(0);
  const [totalPagesTea, setTotalPagesTea] = useState(0);

  const [currentPageStuCl, setCurrentPageStuCl] = useState(1);
  const [currentPageTeaCl, setCurrentPageTeaCl] = useState(1);
  const [totalPagesStuCl, setTotalPagesStuCl] = useState(0);
  const [totalPagesTeaCl, setTotalPagesTeaCl] = useState(0);

  const [selectedStus, setSelectedStus] = useState<string[]>([]);
  const [isSelectingStu, setIsSelectingStu] = useState(false);

  const [selectedTeas, setSelectedTeas] = useState<string[]>([]);
  const [isSelectingTea, setIsSelectingTea] = useState(false);

  const [currentTab, setCurrentTab] = useState("students");

  const toggleSelectModeForStu = () => {
    console.log(loading);
    setIsSelectingStu(!isSelectingStu);
    if (isSelectingStu) setSelectedStus([]); // Reset khi tắt chọn nhiều
  };

  const toggleSelectionForStu = (id: string) => {
    setSelectedStus((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id],
    );
  };

  const toggleSelectAll = () => {
    if (currentTab == "students") {
      if (selectedStus.length === students.length) {
        setSelectedStus([]); // Bỏ chọn tất cả
      } else {
        setSelectedStus(students.map((s) => s.id)); // Chọn tất cả
      }
    } else {
      if (selectedTeas.length === teachers.length) {
        setSelectedTeas([]); // Bỏ chọn tất cả
      } else {
        setSelectedTeas(teachers.map((s) => s.id)); // Chọn tất cả
      }
    }
  };

  const toggleSelectModeForTea = () => {
    console.log(loading);
    setIsSelectingTea(!isSelectingTea);
    if (isSelectingTea) setSelectedTeas([]); // Reset khi tắt chọn nhiều
  };

  const toggleSelectionForTea = (id: string) => {
    setSelectedTeas((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id],
    );
  };

  const handleBulkAction = async () => {
    if (selectedStus.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người dùng.");
      return;
    }
    setLoading(true);
    try {
      const defaultRole = currentTab === "students" ? "STUDENT" : "TEACHER";
      // const roleResponse = await getAllRolesByDefault(defaultRole);
      // console.log(roleResponse);
      // const roleId = roleResponse[0]?.id; // Lấy ID đầu tiên trong mảng

      // if (!roleId) {
      //   throw new Error("Không tìm thấy roleId.");
      // }
      if (defaultRole == "STUDENT") {
        await addMembers(
          selectedStus,
          "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
          defaultRole,
        );
        toast.success("Thêm học viên thành công", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setSelectedStus([]);
      } else {
        await addMembers(
          selectedTeas,
          "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
          defaultRole,
        );
        toast.success("Thêm giáo viên thành công", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setSelectedTeas([]);
      }

      fetchStudents();
      fetchTeachers();
      fetchStudentsInClass();
      fetchTeachersInClass();
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
      const response = await getStuClassRegister(
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
    let StudentClassData: MemberItem[] = [];
    setLoading(true);

    try {
      const response = await getListMembers(
        "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
        "",
        currentPageStuCl - 1,
        5,
        "STUDENT",
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
      const response = await getListAvailableTea(
        "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
        "",
        currentPageTea - 1,
        5,
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

  const fetchTeachersInClass = async () => {
    let TeacherClassData: MemberItem[] = [];
    setLoading(true);

    try {
      const response = await getListMembers(
        "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
        "",
        currentPageTeaCl - 1,
        5,
        "TEACHER",
      );

      TeacherClassData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        gender: getGenderDisplayName(item.gender),
      }));

      // Set total pages for students based on API response
      setTotalPagesTeaCl(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setTeachersClass(TeacherClassData);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModalRe) {
      fetchStudents();
      fetchTeachers();
      fetchStudentsInClass();
      fetchTeachersInClass();
    }
  }, [
    currentPageStu,
    currentPageTea,
    currentPageStuCl,
    currentPageTeaCl,
    showModalRe,
  ]); // Trigger fetch when page changes

  const handleAdd = async (userId: string) => {
    setLoading(true);

    try {
      const defaultRole = currentTab === "students" ? "STUDENT" : "TEACHER";
      if (defaultRole == "STUDENT") {
        await addMembers(
          [userId],
          "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
          defaultRole,
        );
        toast.success("Thêm học viên thành công", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setSelectedStus([]);
      } else {
        await addMembers(
          [userId],
          "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
          defaultRole,
        );
        toast.success("Thêm giáo viên thành công", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setSelectedTeas([]);
      }

      fetchStudents();
      fetchTeachers();
      fetchStudentsInClass();
      fetchTeachersInClass();
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

  const handlePreviousPageTeaCl = () => {
    if (currentPageTeaCl > 1) setCurrentPageTeaCl(currentPageTeaCl - 1);
  };

  const handleNextPageTeaCl = () => {
    if (currentPageTeaCl < totalPagesTeaCl)
      setCurrentPageTeaCl(currentPageTeaCl + 1);
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
                  title="Danh sách chờ"
                  users={students}
                  isSelecting={isSelectingStu}
                  selectedUsers={selectedStus}
                  toggleSelection={toggleSelectionForStu}
                  toggleSelectMode={toggleSelectModeForStu}
                  toggleSelectAll={toggleSelectAll}
                  handleBulkAction={handleBulkAction}
                  handleAdd={handleAdd}
                  currentPage={currentPageStu}
                  totalPages={totalPagesStu}
                  setCurrentPage={setCurrentPageStu}
                  handlePreviousPage={handlePreviousPageStu}
                  handleNextPage={handleNextPageStu}
                />

                <ClassTable
                  title="Danh sách lớp"
                  users={studentsClass}
                  currentPage={currentPageStuCl}
                  totalPages={totalPagesStuCl}
                  setCurrentPage={setCurrentPageStuCl}
                  handlePreviousPage={handlePreviousPageStuCl}
                  handleNextPage={handleNextPageStuCl}
                />
              </div>
            </TabPanel>

            <TabPanel value="teachers">
              <div className="grid grid-cols-2 gap-4">
                <ClassTable
                  title="Danh sách chờ"
                  users={teachers}
                  isSelecting={isSelectingTea}
                  selectedUsers={selectedTeas}
                  toggleSelection={toggleSelectionForTea}
                  toggleSelectMode={toggleSelectModeForTea}
                  toggleSelectAll={toggleSelectAll}
                  handleBulkAction={handleBulkAction}
                  handleAdd={handleAdd}
                  currentPage={currentPageTea}
                  totalPages={totalPagesTea}
                  setCurrentPage={setCurrentPageTea}
                  handlePreviousPage={handlePreviousPageTea}
                  handleNextPage={handleNextPageTea}
                />

                <ClassTable
                  title="Danh sách lớp"
                  users={teachersClass}
                  currentPage={currentPageTeaCl}
                  totalPages={totalPagesTeaCl}
                  setCurrentPage={setCurrentPageTeaCl}
                  handlePreviousPage={handlePreviousPageTeaCl}
                  handleNextPage={handleNextPageTeaCl}
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
