"use client";
import React, { useActionState, useEffect, useState } from "react";
import { Button, SelectingButton } from "./button";
import { Input, SearchField } from "./input";
import Pagination from "./pagination";
import { CircleX } from "lucide-react";
import Modal from "./modal";
import { createClass, CreateClassFormState } from "@/app/lib/action";
import clsx from "clsx";
import axiosInstance from "@/app/lib/axios";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

const MockBranchID = "e7a865f8-baf6-4fb1-afed-58a3454aa257";

type GradeItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type CourseItem = {
  id: string;
  name: string;
};

type TimeItem = {
  id: string;
  day: string;
  time: string;
};

type RoomItem = {
  id: string;
  name: string;
};

type TeacherItem = {
  email: string;
  genId: string;
  id: string;
  name: string;
};

type ClassSchema = {
  name: string;
  courseId: string;
  gradeId: string;
  startDate: string;
  endDate: string;
  description: string;
  fee: number;
  teacherId: string;
  branchId: string;
  timeId: string;
  roomId: string;
};

export default function CoursesComponent(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const router = useRouter();
  // DÀNH CHO SEARCH
  // const searchParams = props.searchParams;
  // const query = searchParams?.query || "";
  // const currentPage = Number(searchParams?.page) || 1;

  // DÀNH CHO MODAL
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [isSelectingSubject, setIsSelectingSubject] = useState<boolean>(false);
  const [subjectForCreateClass, setSubjectForCreateClass] =
    useState<string>("");
  const [isSelectingGrade, setIsSelectingGrade] = useState<boolean>(false);
  const [gradeForCreateClass, setGradeForCreateClass] = useState<string>("");
  const [classDuration, setClassDuration] = useState<string>("");
  const [isSelectingDuration, setIsSelectingDuration] =
    useState<boolean>(false);
  const [isSelectingTime, setIsSelectingTime] = useState<boolean>(false);
  const [isSelectingRoom, setIsSelectingRoom] = useState<boolean>(false);
  const [isSelectingTeacher, setIsSelectingTeacher] = useState<boolean>(false);
  /////////////////////////////////////////////////////////////////////////////////

  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [times, setTimes] = useState<TimeItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);

  const durations: string[] = ["3 tháng", "6 tháng", "1 năm"];

  const initialState: CreateClassFormState = {
    errors: {
      name: null,
      teacher: null,
      subject: null,
      date: null,
      description: null,
      fee: null,
      grade: null,
      duration: null,
    },
    message: null,
  };
  const [state, action, isPending] = useActionState(createClass, initialState);

  const [teacher, setTeacher] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  // DATA ĐỂ TẠO CLASS
  const [className, setClassName] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const [gradeId, setGradeId] = useState<string>("");
  const [startDateObj, setStartDateObj] = useState<string>("");
  const [endDateObj, setEndDateObj] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fee, setFee] = useState<number>(0);
  const [teacherId, setTeacherId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>(MockBranchID);
  const [timeId, setTimeId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  /////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (startDate !== "" && classDuration !== "") {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(startDate);
      switch (classDuration) {
        case "3 tháng":
          endDateObj.setMonth(startDateObj.getMonth() + 3);
          break;
        case "6 tháng":
          endDateObj.setMonth(startDateObj.getMonth() + 6);
          break;
        case "1 năm":
          endDateObj.setFullYear(startDateObj.getFullYear() + 1);
          break;
      }
      setEndDate(endDateObj.toISOString().split("T")[0]);

      setStartDateObj(startDateObj.toISOString());
      setEndDateObj(endDateObj.toISOString());
    }
  }, [startDate, classDuration]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchGrades, fetchTimes] = await Promise.all([
          axiosInstance.get("/grade/clerk/get-all", {
            params: {
              page: 0,
              limit: 10,
            },
          }),
          axiosInstance.get("/time/all/get", {
            params: {
              branchId: MockBranchID,
            },
          }),
        ]);
        setGrades(fetchGrades.data.content);
        setTimes(fetchTimes.data);
        console.log(fetchTimes.data);
      } catch (error) {
        console.log("cannot fetch data: " + error);
      }
    };
    fetchData();
  }, []);

  const selectCoursesByGrade = async (gradeId: string) => {
    try {
      const response = await axiosInstance.get(
        "/course/clerk/get-course-by-grade-id",
        {
          params: {
            page: 0,
            limit: 10,
            gradeId: gradeId,
          },
        }
      );
      const filterdData = response.data.content.map(
        ({ id, name }: { id: string; name: string }) => ({ id, name })
      );
      setCourses(filterdData);
      // console.log(filterdData);
    } catch (error) {
      console.log(error);
    }
  };

  const getAvailableRoom = async (
    branchId: string,
    timeId: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await axiosInstance.get("/room/clerk/available", {
        params: {
          "branch-id": branchId,
          "time-id": timeId,
          "start-date": startDate.split("T")[0],
          "end-date": endDate.split("T")[0],
        },
      });
      setRooms(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAvailableTeacher = async (
    branchId: string,
    timeId: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await axiosInstance.get(
        "/user/clerk/available-teachers",
        {
          params: {
            "branch-id": branchId,
            "time-id": timeId,
            "start-date": startDate.split("T")[0],
            "end-date": endDate.split("T")[0],
          },
        }
      );
      setTeachers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const CreateNewClass = async (newClass: ClassSchema) => {
    try {
      console.log(newClass);
      const response = await axiosInstance.post("/class/clerk/add", {
        name: newClass.name,
        courseId: newClass.courseId,
        gradeId: newClass.gradeId,
        startDate: newClass.startDate,
        endDate: newClass.endDate,
        description: newClass.description,
        fee: newClass.fee,
        teacherId: newClass.teacherId,
        branchId: newClass.branchId,
        timeId: newClass.timeId,
        roomId: newClass.roomId,
      });
      console.log(response.data);
      console.log(response.status);
      if (response.status === 200) {
        router.push(`/classes/${response.data.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sampleClasses = [
    {
      ID: 1,
      MaLop: "T1",
      TenLop: "Toán 1",
      SiSo: 30,
      NgayBatDau: "2024-01-10",
      NgayKetThuc: "2024-05-20",
    },
    {
      ID: 2,
      MaLop: "TC1",
      TenLop: "Toán Chuyên 1",
      SiSo: 25,
      NgayBatDau: "2024-02-01",
      NgayKetThuc: "2024-06-15",
    },
    {
      ID: 3,
      MaLop: "L1",
      TenLop: "Lý 1",
      SiSo: 28,
      NgayBatDau: "2024-01-15",
      NgayKetThuc: "2024-05-30",
    },
    {
      ID: 4,
      MaLop: "LC1",
      TenLop: "Lý Chuyên 1",
      SiSo: 20,
      NgayBatDau: "2024-03-01",
      NgayKetThuc: "2024-07-10",
    },
    {
      ID: 5,
      MaLop: "H1",
      TenLop: "Hóa 1",
      SiSo: 32,
      NgayBatDau: "2024-01-20",
      NgayKetThuc: "2024-06-25",
    },
  ];
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Quản lý lớp học
      </h2>

      <div className="relative flex items-center justify-between mt-6 mr-6">
        <div className="flex gap-3 items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả các khối</option>
            <option value="">Khối 10</option>
            <option value="">Khối 11</option>
            <option value="">Khối 12</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả các môn</option>
            <option value="">Toán</option>
            <option value="">Lý</option>
            <option value="">Hóa</option>
            <option value="">Văn</option>
            <option value="">Anh</option>
            <option value="">Sinh</option>
          </select>
          <SearchField
            className="w-[200px]"
            placeholder="Tìm theo tên lớp..."
          />
        </div>

        <Button
          onClick={() => {
            setIsOpenModal(true);
          }}
          type="button"
          className="pl-6 pr-6">
          Thêm lớp học
        </Button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 mr-6">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                ID
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center ">
                Mã lớp
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center w-[150px]">
                Tên lớp
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Sỉ số
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Ngày bắt đầu
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Ngày kết thúc
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleClasses.map((c, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.ID}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.MaLop}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 ">{c.TenLop}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.SiSo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.NgayBatDau}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.NgayKetThuc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination className="flex justify-end mt-5" totalPages={3} />
      </div>
      <Modal
        modalName="ModalCreateClass"
        isOpen={isOpenModal}
        className="h-fit pb-6">
        <div className="flex flex-col relative">
          <CircleX
            onClick={() => {
              setIsOpenModal(false);
            }}
            className="absolute top-4 right-6 bg-clip-padding w-[8%] h-auto opacity-50 hover:opacity-100 transition duration-200 bg-white cursor-pointer"
          />
          <h1 className="mx-auto mt-5 font-bold text-2xl text-gray-700">
            Tạo lớp học
          </h1>
          <form
            action={action}
            className=" mx-6 mt-10 flex flex-col gap-2 md:gap-5">
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Tên lớp"
              name="className"
              isError={state.errors?.name != null}
              errorMsg={state.errors?.name}
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />

            <div className="flex gap-5">
              <div>
                <SelectingButton
                  onClick={() => {
                    setIsSelectingGrade(true);
                  }}
                  placeholder={
                    gradeForCreateClass === "" ? "Khối" : gradeForCreateClass
                  }
                  nameForInput="grade"
                  className="w-[8vw]"
                />
                {state.errors?.grade && (
                  <span className="text-[13px] text-error">
                    {state.errors.grade}
                  </span>
                )}
              </div>
              <div>
                <SelectingButton
                  onClick={() => {
                    if (gradeForCreateClass === "") {
                      return;
                    }
                    setIsSelectingSubject(true);
                  }}
                  placeholder={
                    subjectForCreateClass === ""
                      ? "Môn học"
                      : subjectForCreateClass
                  }
                  nameForInput="subject"
                  className="w-[7vw]"
                  disabled={gradeForCreateClass === ""}
                />
                {state.errors?.subject && (
                  <span className="text-[13px] text-error">
                    {state.errors.subject}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <SelectingButton
                  onClick={() => {
                    setIsSelectingDuration(true);
                  }}
                  placeholder={
                    classDuration === "" ? "Thời gian học" : classDuration
                  }
                  nameForInput="duration"
                  className="w-full"
                />
                {state.errors?.duration && (
                  <span className="text-[13px] text-error">
                    {state.errors.duration}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-8">
              <div className="w-[15vw]">
                <h2 className="text-sm text-secondary_text mb-1 ml-1">
                  Ngày bắt đầu
                </h2>
                <input
                  type="date"
                  id="default-datepicker"
                  className={clsx(
                    {
                      "border-2 border-error": state.errors?.date,
                      "border border-gray-300": !state.errors?.date,
                    },
                    "bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
                  )}
                  placeholder="Ngày bắt đầu"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                {state.errors?.date && (
                  <span className="text-[13px] text-error">
                    {state.errors.date[0]}
                  </span>
                )}
              </div>
              <div className="w-[15vw]">
                <h2 className="text-sm text-secondary_text mb-1 ml-1">
                  Ngày kết thúc
                </h2>
                <input
                  type="date"
                  id="default-datepicker"
                  className={clsx(
                    "bg-gray-50 text-gray-900 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
                  )}
                  placeholder="Ngày kết thúc"
                  name="startDate"
                  value={endDate}
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-between gap-8">
              <SelectingButton
                onClick={() => {
                  setIsSelectingTime(true);
                }}
                nameForInput=""
                placeholder={time === "" ? "Khung giờ học" : time}
                className="w-[15vw]"
              />
              <SelectingButton
                onClick={() => {
                  if (
                    time !== "" &&
                    endDateObj !== "" &&
                    startDateObj !== "" &&
                    branchId !== ""
                  ) {
                    getAvailableRoom(
                      branchId,
                      timeId,
                      startDateObj,
                      endDateObj
                    );
                    setIsSelectingRoom(true);
                  }
                }}
                nameForInput=""
                placeholder={room === "" ? "Phòng học" : room}
                className="w-[15vw]"
                disabled={
                  time === "" ||
                  endDateObj === "" ||
                  startDateObj === "" ||
                  branchId === ""
                }
              />
            </div>

            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Mô tả"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Học phí"
              name="fee"
              isError={state.errors?.fee != null}
              errorMsg={state.errors?.fee}
              value={fee}
              onChange={(e) => setFee(parseFloat(e.target.value))}
            />
            {/* <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Giáo viên"
              name="teacher"
              isError={state.errors?.teacher != null}
              errorMsg={state.errors?.teacher}
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            /> */}
            <SelectingButton
              onClick={() => {
                if (
                  time !== "" &&
                  endDateObj !== "" &&
                  startDateObj !== "" &&
                  branchId !== ""
                ) {
                  getAvailableTeacher(
                    branchId,
                    timeId,
                    startDateObj,
                    endDateObj
                  );
                  setIsSelectingTeacher(true);
                }
              }}
              nameForInput=""
              placeholder={teacher === "" ? "Chọn giáo viên" : teacher}
              className="w-full"
              disabled={
                time === "" ||
                endDateObj === "" ||
                startDateObj === "" ||
                branchId === ""
              }
            />
            <Button
              onClick={() => {
                const newClass: ClassSchema = {
                  name: className,
                  courseId: courseId,
                  gradeId: gradeId,
                  startDate: startDateObj,
                  endDate: endDateObj,
                  description: description,
                  fee: fee,
                  teacherId: teacherId,
                  branchId: branchId,
                  timeId: timeId,
                  roomId: roomId,
                };
                CreateNewClass(newClass);
              }}
              isPending={isPending}
              type="submit"
              className="mt-5">
              {isPending ? "Đang tạo..." : "Tạo lớp học"}
            </Button>
          </form>
        </div>
      </Modal>
      {/* MODAL CHỌN MÔN */}
      <Modal
        onClose={() => {
          setIsSelectingSubject(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingSubject}
        className="w-[25vw] py-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Chọn môn học
          </h1>
          <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
            {courses.map((data, i) => (
              <div
                onClick={() => {
                  setSubjectForCreateClass(data.name);
                  setIsSelectingSubject(false);
                  setCourseId(data.id);
                }}
                key={i}
                className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
                {data.name}
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {/* MODAL CHỌN KHỐI */}
      <Modal
        onClose={() => {
          setIsSelectingGrade(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingGrade}
        className="w-[25vw] py-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Chọn khối
          </h1>
          <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
            {grades.map((data, i) => (
              <div
                onClick={() => {
                  setGradeForCreateClass(data.name);
                  setIsSelectingGrade(false);
                  selectCoursesByGrade(data.id);
                  setSubjectForCreateClass("Môn học");
                  setGradeId(data.id);
                }}
                key={i}
                className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
                {data.name}
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {/* MODAL CHỌN THỜI GIAN HỌC */}
      <Modal
        onClose={() => {
          setIsSelectingDuration(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingDuration}
        className="w-[25vw] py-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Thời gian học
          </h1>
          <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
            {durations.map((data, i) => (
              <div
                onClick={() => {
                  setClassDuration(data);
                  setIsSelectingDuration(false);
                }}
                key={i}
                className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
                {data}
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {/* MODAL CHỌN KHUNG GIỜ HỌC */}
      <Modal
        onClose={() => {
          setIsSelectingTime(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingTime}
        className="w-[25vw] py-8">
        <div className="">
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Khung giờ học
          </h1>
          <div className="grid grid-cols-2 gap-2 mx-8 mt-4">
            {times.map((data, i) => (
              <div
                onClick={() => {
                  setTime(data.day + ", " + data.time);
                  setIsSelectingTime(false);
                  setTimeId(data.id);
                }}
                key={i}
                className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
                <div>{data.day}</div>
                <div>{data.time}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {/* MODAL CHO PHÒNG HỌC */}
      <Modal
        onClose={() => {
          setIsSelectingRoom(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingRoom}
        className="w-[25vw] py-8">
        <div className="">
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Phòng học
          </h1>
          <div className="grid grid-cols-2 gap-2 mx-8 mt-4">
            {rooms.map((data, i) => (
              <div
                onClick={() => {
                  setRoom(data.name);
                  setIsSelectingRoom(false);
                  setRoomId(data.id);
                }}
                key={i}
                className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
                <div>{data.name}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {/* MODAL CHO GIÁO VIÊN */}
      <Modal
        onClose={() => {
          setIsSelectingTeacher(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingTeacher}
        className="w-[25vw] py-8">
        <div className="">
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Giáo viên
          </h1>
          <div className="grid grid-cols-2 gap-2 mx-8 mt-4">
            {teachers.map((data, i) => (
              <div
                onClick={() => {
                  setTeacher(data.name);
                  setIsSelectingTeacher(false);
                  setTeacherId(data.id);
                }}
                key={i}
                className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
                <div>{data.name}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
