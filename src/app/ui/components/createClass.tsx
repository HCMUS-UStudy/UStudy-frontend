"use client";
import React, { useEffect, useState } from "react";
import { Button, SelectingButton } from "./common/Button";
import Modal from "./modal";
import { CircleX, Plus, PlusIcon } from "lucide-react";
import { Input } from "./common/Input";
import {
  ClassSchema,
  CourseItem,
  DurationUnit,
  GradeItem,
  RoomItem,
  Schedule,
  ScheduleItem,
  ScheduleType,
  TimeItem,
} from "@/app/types/type";
import { Spinner } from "./common/Spinner";
import {
  createNewClass,
  getAllGrades,
  getAvailableRooms,
  getCoursesByGradeId,
} from "@/app/lib/api";
import clsx from "clsx";
import { FaTrashCan } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { BranchRootState } from "@/app/store/store";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useRouter } from "next/navigation";

type CreateClassError = {
  course?: string | null;
  room?: string | null;
  name?: string | null;
  duration?: string | null;
  startDate?: string | null;
  fee?: string | null;
  grade?: string | null;
  classTimes?: string | null;
};

export default function CreateClass() {
  // CÁC STATE PHỤ
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedBranchId } = useSelector(
    (state: BranchRootState) => state.branch,
  );
  const [errors, setErrors] = useState<CreateClassError>({
    course: null,
    room: null,
    name: null,
    duration: null,
    startDate: null,
    fee: null,
    grade: null,
    classTimes: null,
  });

  //   STATE CHO MODAL
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isSelectingGrade, setIsSelectingGrade] = useState<boolean>(false);
  const [isSelectingSubject, setIsSelectingSubject] = useState<boolean>(false);
  const [isSelectingDuration, setIsSelectingDuration] =
    useState<boolean>(false);
  const [isSelectingSchedule, setIsSelectingSchedule] =
    useState<boolean>(false);
  // const [isFlexibleTime, setIsFlexibleTime] = useState<boolean | null>(false);
  const [isSelectingRoom, setIsSelectingRoom] = useState<boolean>(false);

  // STATE ĐỂ GỌI API TẠO CLASS
  const [name, setName] = useState<string>("");
  const [grade, setGrade] = useState<GradeItem | null>(null);
  const [course, setCourse] = useState<CourseItem | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [fixedSchedule, setFixedSchedule] = useState<TimeItem[]>([]);
  const [flexSchedule, setFlexSchedule] = useState<TimeItem[]>([]);
  const [startTime, setStartTime] = useState<string>("00:00");
  const [endTime, setEndTime] = useState<string>("00:00");
  const [room, setRoom] = useState<RoomItem | null>(null);
  const [description, setDescription] = useState<string>("");
  const [fee, setFee] = useState<number | string>("");

  // STATE ĐỂ HIỂN THỊ
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [durationQuantity, setDurationQuantity] = useState<number | string>("");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("Tháng");
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [baseSchedule, setBaseSchedule] = useState<ScheduleItem[]>(Schedule);
  const [scheduleType, setScheduleType] = useState<ScheduleType>("Giờ cố định");
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  // USE EFFECT
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchGrades = await getAllGrades();
        setGrades(fetchGrades);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (
      typeof durationQuantity === "number" &&
      durationQuantity !== 0 &&
      startDate !== ""
    ) {
      const endDateObj = new Date(startDate);
      switch (durationUnit) {
        case "Tuần":
          endDateObj.setDate(endDateObj.getDate() + durationQuantity * 7);
          break;
        case "Tháng":
          endDateObj.setMonth(endDateObj.getMonth() + durationQuantity);
          break;
        case "Năm":
          endDateObj.setFullYear(endDateObj.getFullYear() + durationQuantity);
          break;
        default:
          break;
      }
      setEndDate(endDateObj.toISOString().split("T")[0]);
    }
  }, [durationUnit, durationQuantity, startDate]);

  // useEffect(() => {
  //   if (!selectedBranchId) {
  //     console.log("Chưa chọn branch");
  //   } else {
  //     console.log(selectedBranchId);
  //   }
  // }, [selectedBranchId]);

  // CÁC FUNCTION KHÁC
  const displayCourses = async (gradeId: string) => {
    try {
      setIsLoading(true);
      const courses = await getCoursesByGradeId(gradeId);
      setCourses(courses);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDaysInSchedule = (day: number) => {
    setBaseSchedule((schedule) =>
      schedule.map((item: ScheduleItem) =>
        item.dataToSend === day ? { ...item, isChosen: !item.isChosen } : item,
      ),
    );
  };

  const displayAvailableRooms = async (
    branchId: string,
    times: TimeItem[],
    startDate: string,
    endDate: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await getAvailableRooms(
        branchId,
        times,
        startDate,
        endDate,
      );
      // console.log(response);
      setRooms(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidForm = (data: ClassSchema): boolean => {
    let isValid: boolean = true;
    const msg = "Trường bắt buộc";
    const newErrors: CreateClassError = {
      course: null,
      room: null,
      name: null,
      duration: null,
      startDate: null,
      fee: null,
      grade: null,
      classTimes: null,
    };
    if (data.courseId === "") {
      newErrors.course = msg;
      isValid = false;
    }
    if (data.gradeId === "") {
      newErrors.grade = msg;
      isValid = false;
    }
    if (data.fee === 0) {
      newErrors.fee = msg;
      isValid = false;
    } else if (data.fee < 0) {
      newErrors.fee = "Học phí không thể âm";
      isValid = false;
    }
    if (data.branchId === null || data.branchId === "") {
      toast.error("Vui lòng chọn chi nhánh trước khi tạo lớp", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        transition: Bounce,
      });
      isValid = false;
    }
    if (data.name === "") {
      newErrors.name = msg;
      isValid = false;
    }
    if (data.startDate === "") {
      newErrors.startDate = msg;
      isValid = false;
    }
    if (data.classTimes.length === 0) {
      newErrors.classTimes = msg;
      isValid = false;
    }
    if (data.roomId === "") {
      newErrors.room = msg;
      isValid = false;
    }
    if (durationQuantity === "" || durationQuantity === 0) {
      newErrors.duration = msg;
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleCreateClass = async () => {
    try {
      setIsLoading(true);
      const newClass: ClassSchema = {
        name: name,
        courseId: typeof course?.id === "undefined" ? "" : course?.id,
        gradeId: typeof grade?.id === "undefined" ? "" : grade?.id,
        startDate: startDate,
        endDate: endDate,
        description: description,
        fee: typeof fee === "string" ? 0 : fee,
        branchId: selectedBranchId ? selectedBranchId : "",
        classTimes: [],
        roomId: typeof room?.id === "undefined" ? "" : room?.id,
      };
      console.log(newClass);

      switch (scheduleType) {
        case "Giờ cố định":
          newClass.classTimes = fixedSchedule;
          break;
        case "Giờ linh hoạt":
          newClass.classTimes = flexSchedule;
          break;
      }
      if (isValidForm(newClass) === true) {
        // console.log("here");
        const response = await createNewClass(newClass);
        console.log(response);
        if (response.status === 200) {
          setName("");
          setGrade(null);
          setCourse(null);
          setStartDate("");
          setEndDate("");
          setFixedSchedule([]);
          setFlexSchedule([]);
          setEndDate("");
          setRoom(null);
          setDurationQuantity("");
          setFee("");
          setDescription("");
          toast.success("Tạo lớp học thành công ! Đang chuyển hướng...", {
            position: "bottom-right",
            autoClose: 3000,
          });
          router.push(`/clerk/classes/${response.data.id}/classManagement`);
        } else {
          toast.error(`Tạo lớp học thất bại`, {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      }
      console.log(errors);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Button
        onClick={() => {
          setIsOpenModal(true);
        }}
        type="button"
        className="relative group px-8 bg-gradient-to-tr from-blue-800 via-blue-600  to-blue-800 bg-[length:200%] bg-[0%_100%] hover:bg-[100%_0%] transition-all duration-200"
      >
        <span className="-translate-x-0 group-hover:-translate-x-4 transition-all duration-300">
          Thêm lớp học
        </span>
        <PlusIcon className="size-8 absolute translate-x-14 opacity-0 rotate-45 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" />
      </Button>
      <Modal
        modalName="ModalCreateClass"
        isOpen={isOpenModal}
        className="h-fit pb-6"
      >
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
            // action={action}
            className=" mx-6 mt-10 flex flex-col gap-2 md:gap-5"
          >
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Tên lớp"
              name="name"
              isError={errors.name !== null}
              errorMsg={errors.name}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: null });
              }}
            />

            <div className="flex gap-3">
              <div>
                <SelectingButton
                  onClick={() => {
                    setIsSelectingGrade(true);
                  }}
                  placeholder={grade === null ? "Khối" : grade?.name}
                  nameForInput="grade"
                  isError={errors.grade !== null}
                  className="w-[8vw]"
                />
                <span className="text-[13px] text-error">{errors.grade}</span>
              </div>
              <div>
                <SelectingButton
                  onClick={() => {
                    if (grade === null) {
                      return;
                    }
                    displayCourses(grade.id);
                    setIsSelectingSubject(true);
                  }}
                  placeholder={course === null ? "Môn học" : course.name}
                  nameForInput="subject"
                  className="w-[7vw]"
                  isError={errors.course !== null}
                  disabled={grade === null}
                />
                <span className="text-[13px] text-error">{errors.course}</span>
              </div>

              <div className="flex-1">
                <SelectingButton
                  onClick={() => {
                    setIsSelectingDuration(true);
                  }}
                  placeholder={
                    durationQuantity === 0 || durationQuantity === ""
                      ? "Thời gian học"
                      : `${durationQuantity} ${durationUnit}`
                  }
                  nameForInput="duration"
                  className="w-full h-fit"
                  isError={errors.duration !== null}
                />
                <span className="text-[13px] text-error">
                  {errors.duration}
                </span>
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
                      "border-2 border-error": errors?.startDate,
                      "border border-gray-300": !errors?.startDate,
                    },
                    "bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5",
                  )}
                  placeholder="Ngày bắt đầu"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrors({ ...errors, startDate: null });
                  }}
                />
                <span className="text-[13px] text-error">
                  {errors.startDate}
                </span>
              </div>
              <div className="w-[15vw]">
                <h2 className="text-sm text-secondary_text mb-1 ml-1">
                  Ngày kết thúc
                </h2>
                <input
                  type="date"
                  id="default-datepicker"
                  className={clsx(
                    "bg-gray-50 text-gray-900 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5",
                  )}
                  placeholder="Ngày kết thúc"
                  name="startDate"
                  value={endDate}
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-between gap-8">
              <div className="flex flex-col w-[15vw]">
                <SelectingButton
                  onClick={() => {
                    setIsSelectingSchedule(true);
                    // setScheduleType("Giờ cố định");
                  }}
                  nameForInput=""
                  placeholder={
                    scheduleType === null ? "Khung giờ học" : scheduleType
                  }
                  className="w-full h-fit"
                  isError={errors.classTimes !== null}
                />
                <span className="text-[13px] text-error">
                  {errors.classTimes}
                </span>
              </div>

              <div className="flex flex-col w-[15vw]">
                <SelectingButton
                  onClick={() => {
                    if (
                      (flexSchedule.length === 0 &&
                        fixedSchedule.length === 0) ||
                      endDate === "" ||
                      startDate === "" ||
                      !selectedBranchId
                    ) {
                      return;
                    }
                    switch (scheduleType) {
                      case "Giờ cố định":
                        displayAvailableRooms(
                          selectedBranchId,
                          fixedSchedule,
                          startDate,
                          endDate,
                        );
                        break;
                      case "Giờ linh hoạt":
                        displayAvailableRooms(
                          selectedBranchId,
                          flexSchedule,
                          startDate,
                          endDate,
                        );
                        break;
                    }
                    setIsSelectingRoom(true);
                  }}
                  nameForInput=""
                  placeholder={room === null ? "Phòng học" : room.name}
                  className="w-full h-fit"
                  disabled={
                    (flexSchedule.length === 0 && fixedSchedule.length === 0) ||
                    endDate === "" ||
                    startDate === "" ||
                    !selectedBranchId
                  }
                  isError={errors.room !== null}
                />
                <span className="text-[13px] text-error">{errors.room}</span>
              </div>
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
              placeholder="Học phí: Đơn vị VNĐ"
              name="fee"
              isError={errors?.fee != null}
              errorMsg={errors?.fee}
              value={fee}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFee(isNaN(value) ? "" : value);
              }}
            />
            <Button
              onClick={() => {
                handleCreateClass();
              }}
              // isPending={isPending}
              type="button"
              className="mt-5 bg-blue-600 hover:bg-blue-800"
            >
              Tạo lớp học
            </Button>
          </form>
        </div>
      </Modal>
      {/* MODAL CHỌN KHỐI */}
      <Modal
        onClose={() => {
          setIsSelectingGrade(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingGrade}
        className="w-[25vw] py-8"
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Chọn khối
          </h1>
          {isLoading === false ? (
            <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
              {grades.map((data, i) => (
                <div
                  onClick={() => {
                    setGrade(data);
                    setErrors({ ...errors, grade: null });
                    setIsSelectingGrade(false);
                  }}
                  key={i}
                  className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer"
                >
                  {data.name}
                </div>
              ))}
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </Modal>
      {/* MODAL CHỌN MÔN */}
      <Modal
        onClose={() => {
          setIsSelectingSubject(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingSubject}
        className="w-[25vw] py-8"
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Chọn môn học
          </h1>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
              {courses.map((data, i) => (
                <div
                  onClick={() => {
                    setIsSelectingSubject(false);
                    setErrors({ ...errors, course: null });
                    setCourse(data);
                  }}
                  key={i}
                  className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer"
                >
                  {data.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
      {/* MODAL CHỌN THỜI GIAN HỌC */}
      <Modal
        modalName="ModalSelectSubject"
        isOpen={isSelectingDuration}
        className="w-[25vw] py-8"
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Thời gian học
          </h1>
          <div className="grid grid-cols-2 gap-2 mx-8 mt-4">
            <input
              type="number"
              min={1}
              placeholder="VD: 1"
              value={durationQuantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setDurationQuantity(isNaN(value) ? "" : value);
              }}
              className=" border-2 border-sky-500 focus:border-sky-600 rounded-lg px-2 py-1.5"
            />
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
              className="border-2 border-sky-500 p-2.5 text-sm rounded-lg h-fit"
            >
              <option value="Tháng">Tháng</option>
              <option value="Tuần">Tuần</option>
              <option value="Năm">Năm</option>
            </select>
          </div>
          <Button
            onClick={() => {
              if (typeof durationQuantity !== "string") {
                if (durationQuantity < 0) {
                  // setErrors({
                  //   ...errors,
                  //   duration: "Thời gian không thể âm",
                  // });
                  toast.error("Thời gian không thể âm", {
                    position: "bottom-right",
                    autoClose: 3000,
                  });
                  return;
                } else {
                  setErrors({ ...errors, duration: null });
                }
              } else {
                setErrors({ ...errors, duration: "Trường bắt buộc" });
              }
              setIsSelectingDuration(false);
            }}
            className="mx-auto mt-3 w-[30%]"
          >
            Hoàn tất
          </Button>
        </div>
      </Modal>
      {/* MODAL CHỌN KHUNG GIỜ HỌC */}
      <Modal
        onClose={() => {
          setIsSelectingSchedule(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingSchedule}
        className="w-[35vw] h-min-[60%] h-[60%] py-8"
      >
        <div className="flex flex-col items-center justify-between h-full">
          <div className="grid grid-cols-2 gap-8">
            <div
              onClick={() => {
                setScheduleType("Giờ cố định");
              }}
              className={
                "border-sky-500 rounded px-2 text-xl text-center cursor-pointer"
              }
            >
              Giờ cố định
              <div
                className={clsx(
                  {
                    "opacity-100 scale-y-100": scheduleType === "Giờ cố định",
                    "opcacity-0 scale-y-0": scheduleType === "Giờ linh hoạt",
                  },
                  "h-[1vh] rounded-xl bg-sky-500 mt-1 transition-all duration-100",
                )}
              ></div>
            </div>
            <div
              onClick={() => {
                setScheduleType("Giờ linh hoạt");
                // setIsSelectingStartEndTime(false);
              }}
              className={
                "border-sky-500 rounded px-2 text-xl text-center cursor-pointer"
              }
            >
              Giờ linh hoạt
              <div
                className={clsx(
                  {
                    "opacity-100 scale-y-100": scheduleType === "Giờ linh hoạt",
                    "opcacity-0 scale-y-0": scheduleType === "Giờ cố định",
                  },
                  "h-[1vh] rounded-xl bg-sky-500 mt-1 transition",
                )}
              ></div>
            </div>
          </div>
          {/* CHỌN GIỜ LINH HOẠT */}
          {scheduleType === "Giờ linh hoạt" ? (
            <div>
              <div className="flex items-end gap-3 mt-5">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                  className="border-2 border-sky-500 p-2 text-sm rounded-xl h-[5vh]"
                >
                  <option value={0}>Chọn thứ</option>
                  <option value={1}>Thứ 2</option>
                  <option value={2}>Thứ 3</option>
                  <option value={3}>Thứ 4</option>
                  <option value={4}>Thứ 5</option>
                  <option value={5}>Thứ 6</option>
                  <option value={6}>Thứ 7</option>
                  <option value={7}>Chủ Nhật</option>
                </select>
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col justify-between">
                    <h1 className="ml-2 text-sm">Bắt đầu:</h1>
                    <input
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      type="time"
                      className="cursor-pointer h-[5vh] text-sm border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <h1 className="ml-2 text-sm">Kết thúc:</h1>
                    <input
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      type="time"
                      className="cursor-pointer h-[5vh] text-sm border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (endTime < startTime) {
                      console.log("ne");
                      toast.error("Giờ bắt đầu phải lớn hơn giờ kết thúc", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: false,
                        theme: "light",
                        transition: Bounce,
                      });
                      return;
                    }
                    if (selectedDay === 0) {
                      return;
                    }
                    const newTimes: TimeItem[] = [...flexSchedule];
                    const existingItem = newTimes.find(
                      (item) => item.day === selectedDay,
                    );
                    if (existingItem) {
                      existingItem.startTime = startTime;
                      existingItem.endTime = endTime;
                    } else {
                      newTimes.push({
                        day: selectedDay,
                        startTime: startTime,
                        endTime: endTime,
                      });
                    }
                    setFlexSchedule(newTimes);
                  }}
                  className="rounded-xl h-[5vh] mx-auto mt-3 px-5"
                >
                  <Plus size={20} />
                </Button>
              </div>

              <div className="flex flex-col gap-3 w-full bg-background border-2 border-gray-300 h-[20vh] mt-5 rounded-lg py-3 px-2 text-sm overflow-y-auto">
                {flexSchedule.map((data, i) => (
                  <div key={i}>
                    <div className="flex justify-evenly font-bold">
                      <div>
                        {data.day !== 7
                          ? "Thứ " + (Number(data.day) + 1)
                          : "Chủ Nhật"}
                      </div>
                      <div>
                        {data.startTime} - {data.endTime}
                      </div>
                      <FaTrashCan
                        onClick={() => {
                          const newTimes: TimeItem[] = [...flexSchedule];
                          const updatedTimes = newTimes.filter(
                            (item) => item.day !== data.day,
                          );
                          setFlexSchedule(updatedTimes);
                        }}
                        size={15}
                        color="red"
                        className="cursor-pointer hover:scale-125 transition-all"
                      />
                    </div>
                    <div className="w-[80%] mx-auto h-[0.2vh] bg-gray-300"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* CHỌN GIỜ CỐ ĐỊNH */}
              <div className="mt-5 mx-3">
                <h1 className="text-center">Chọn các ngày sẽ học</h1>
                <div className="flex flex-wrap justify-center gap-2 text-sm mt-3 font-bold">
                  {baseSchedule.map((data, i) => (
                    <div
                      onClick={() => {
                        toggleDaysInSchedule(data.dataToSend);
                      }}
                      key={i}
                      className={clsx(
                        {
                          "bg-sky-100 hover:bg-sky-300 transition-colors":
                            !data.isChosen,
                          "bg-sky-300": data.isChosen,
                        },
                        "border-2 border-sky-500  rounded-xl px-4 py-1.5 cursor-pointer",
                      )}
                    >
                      {data.display}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-3 text-sm">
                <div>
                  <h1 className="ml-2 mb-1">Bắt đầu:</h1>
                  <input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    type="time"
                    className="cursor-pointer border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
                  />
                </div>
                <div>
                  <h1 className="ml-2 mb-1">Kết thúc:</h1>
                  <input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    type="time"
                    className="cursor-pointer border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
                  />
                </div>
              </div>
            </>
          )}
          <Button
            onClick={() => {
              console.log(endTime);
              if (endTime < startTime) {
                toast.error(
                  "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc",
                  {
                    position: "bottom-right",
                    autoClose: 3000,
                  },
                );
                return;
              }
              const newTimes: TimeItem[] = [];
              baseSchedule.map((data) => {
                if (data.isChosen === true) {
                  newTimes.push({
                    day: data.dataToSend,
                    startTime: startTime,
                    endTime: endTime,
                  });
                }
              });
              setFixedSchedule(newTimes);
              setErrors({ ...errors, classTimes: null });
              setIsSelectingSchedule(false);
            }}
            className="w-1/3 mt-5"
          >
            Hoàn tất
          </Button>
        </div>
      </Modal>
      {/* MODAL CHỌN PHÒNG HỌC */}
      <Modal
        onClose={() => {
          setIsSelectingRoom(false);
        }}
        modalName="ModalSelectSubject"
        isOpen={isSelectingRoom}
        className="w-[25vw] py-8"
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Chọn phòng học
          </h1>
          {isLoading === false ? (
            <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
              {rooms.map((data, i) => (
                <div
                  onClick={() => {
                    setRoom(data);
                    setErrors({ ...errors, room: null });
                    setIsSelectingRoom(false);
                  }}
                  key={i}
                  className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer"
                >
                  {data.name}
                </div>
              ))}
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </Modal>
    </div>
  );
}
