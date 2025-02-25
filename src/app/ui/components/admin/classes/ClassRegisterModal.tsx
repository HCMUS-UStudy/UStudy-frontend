"use client";

import React, { useState, useEffect } from "react";
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
  getClassById,
  getListAvailableTea,
  getListMembers,
} from "@/app/lib/services/class";
import { ArrowRightCircle } from "lucide-react";

interface ClassRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string | null;
}

interface FailedMember {
  genId: string;
  name: string;
}

const ClassRegisterModal: React.FC<ClassRegisterModalProps> = ({
  isOpen,
  onClose,
  classId,
}) => {
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

  const [classDetail, setClassDetail] = useState<{
    name: string;
    description: string;
  } | null>(null);

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
    const isStudentTab = currentTab === "students";
    const defaultRole = isStudentTab ? "STUDENT" : "TEACHER";
    const selectedUsers = isStudentTab ? selectedStus : selectedTeas;

    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người dùng.");
      return;
    }

    if (!classId) {
      toast.error("Vui lòng chọn một lớp.");
      return;
    }

    setLoading(true);
    try {
      const response = await addMembers(selectedUsers, classId, defaultRole);

      // Kiểm tra nếu có thành viên không thể thêm
      if (response.data?.failedCount > 0) {
        const failedList = response.data.failedMembers
          .map(
            (member: { genId: string; name: string }) =>
              `${member.name} (ID: ${member.genId})`,
          )
          .join(", ");

        toast.error(`Không thể thêm: ${failedList}`, {
          position: "bottom-right",
          autoClose: 5000,
        });
      } else {
        toast.success(
          `Thêm ${defaultRole === "STUDENT" ? "học viên" : "giáo viên"} thành công!`,
          {
            position: "bottom-right",
            autoClose: 3000,
          },
        );
      }

      if (defaultRole === "STUDENT") {
        setSelectedStus([]);
      } else {
        setSelectedTeas([]);
      }

      // Cập nhật dữ liệu
      fetchStudents();
      fetchTeachers();
      fetchStudentsInClass();
      fetchTeachersInClass();
    } catch (error) {
      console.error("Lỗi khi thêm thành viên:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
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

  const fetchDetailClasses = async (classId: string) => {
    try {
      const response = await getClassById(classId); // Lấy tối đa 100 lớp
      console.log(response);
      setClassDetail({
        name: response.data.name,
        description: response.data.description,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp:", error);
    }
  };

  const fetchStudents = async () => {
    if (!classId) {
      toast.error("Vui lòng chọn một lớp.");
      return;
    }
    let StudentData: RegisterClassItem[] = [];
    setLoading(true);

    try {
      const response = await getStuClassRegister(classId, currentPageStu - 1);

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
    if (!classId) {
      toast.error("Vui lòng chọn một lớp.");
      return;
    }
    let StudentClassData: MemberItem[] = [];
    setLoading(true);

    try {
      const response = await getListMembers(
        classId,
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
    if (!classId) {
      toast.error("Vui lòng chọn một lớp.");
      return;
    }
    let TeacherData: RegisterClassItem[] = [];
    setLoading(true);

    try {
      const response = await getListAvailableTea(
        classId,
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
    if (!classId) {
      toast.error("Vui lòng chọn một lớp.");
      return;
    }
    let TeacherClassData: MemberItem[] = [];
    setLoading(true);

    try {
      const response = await getListMembers(
        classId,
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
    if (isOpen && classId) {
      fetchDetailClasses(classId);
    }
  }, [isOpen, classId]);

  useEffect(() => {
    if (isOpen && classId) {
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
    classId,
  ]); // Trigger fetch when page changes

  const handleAdd = async (userId: string) => {
    setLoading(true);

    if (!classId) {
      toast.error("Vui lòng chọn một lớp.");
      return;
    }

    try {
      const defaultRole = currentTab === "students" ? "STUDENT" : "TEACHER";
      const response = await addMembers([userId], classId, defaultRole);

      if (response.data?.failedCount > 0) {
        const failedUsers = response.data.failedMembers
          .map(
            (member: FailedMember) =>
              `ID: ${member.genId}, Name: ${member.name}`,
          )
          .join("\n");

        toast.error(`Thêm không thành công:\n${failedUsers}`, {
          position: "bottom-right",
          autoClose: 5000,
        });
      } else {
        toast.success(
          defaultRole === "STUDENT"
            ? "Thêm học viên thành công"
            : "Thêm giáo viên thành công",
          { position: "bottom-right", autoClose: 3000 },
        );

        if (defaultRole === "STUDENT") {
          setSelectedStus([]);
        } else {
          setSelectedTeas([]);
        }
      }

      fetchStudents();
      fetchTeachers();
      fetchStudentsInClass();
      fetchTeachersInClass();
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
      <Dialog
        className="min-h-[90vh] min-w-[80vw] m-4"
        isOpen={isOpen}
        onClose={onClose}
      >
        <DialogHeader>Thông tin học viên, giáo viên cần duyệt</DialogHeader>
        <div className="flex items-center gap-4 p-4 border rounded-lg shadow bg-white">
          <div className="flex-shrink-0">
            <ArrowRightCircle size={32} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {classDetail?.name || "Không có dữ liệu"} -{" "}
              {classDetail?.description || "Không có dữ liệu"}
            </h2>
          </div>
        </div>

        {classId ? (
          <>
            <DialogContent>
              <Tabs
                value="students"
                onTabChange={(value) => setCurrentTab(value)}
              >
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
          </>
        ) : (
          <p className="text-center text-gray-600 font-semibold mt-10">
            Vui lòng chọn lớp trước khi tiếp tục.
          </p>
        )}
      </Dialog>
    </>
  );
};

export default ClassRegisterModal;
