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
import clsx from "clsx";
import { FaChevronDown, FaTrashCan } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { BranchRootState } from "@/app/store/store";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useRouter } from "next/navigation";
import Loading from "@/app/ui/components/common/Loading";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/app/ui/components/common/Dialog";
import { Select, SelectItem } from "@/app/ui/components/common/Select";
import { getAllGrades } from "@/app/lib/services/grade";
import { getCoursesByGradeId } from "@/app/lib/services/course";
import { getAvailableRooms } from "@/app/lib/services/room";
import { createNewClass } from "@/app/lib/services/class";

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
      const res = await getCoursesByGradeId(gradeId);
      setCourses(res.content);
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
        className="relative group w-[180px] bg-gradient-to-tr from-blue-800 via-blue-600  to-blue-800 bg-[length:200%] bg-[0%_100%] hover:bg-[100%_0%] transition-all duration-200"
      >
        <span className="-translate-x-0 group-hover:-translate-x-4 transition-all duration-300">
          Thêm lớp học
        </span>
        <PlusIcon className="size-8 absolute translate-x-14 opacity-0 rotate-45 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" />
      </Button>
      <Dialog
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        className="w-full md:w-[60vw] lg:w-[50vw] xl:w-[40vw]"
      >
        <DialogHeader>
          <h1 className="">Tạo lớp học</h1>
        </DialogHeader>
        <DialogContent>
          <form
            // action={action}
            className="flex flex-col gap-2 md:gap-5"
          >
            <Input
              className="w-full h-11 text-base"
              placeholder="Tên lớp"
              label="Tên lớp"
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
              <div className="flex-1">
                <SelectingButton
                  onClick={() => {
                    setIsSelectingGrade(true);
                  }}
                  placeholder={grade === null ? "Khối" : grade?.name}
                  nameForInput="grade"
                  isError={errors.grade !== null}
                  errorMsg={errors.grade}
                  // className="w-[8vw]"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
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
                  // className="w-[7vw]"
                  className="w-full"
                  isError={errors.course !== null}
                  errorMsg={errors.course}
                  disabled={grade === null}
                />
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
                  className="w-full"
                  isError={errors.duration !== null}
                  errorMsg={errors.duration}
                />
              </div>
            </div>

            <div className="flex justify-between gap-6">
              <div className="w-full">
                <label
                  className="text-sm text-secondary-text mb-1 ml-1"
                  htmlFor="start-date-create-class"
                >
                  Ngày bắt đầu
                </label>
                <Input
                  type="date"
                  id="start-date-create-class"
                  placeholder="Ngày bắt đầu"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrors({ ...errors, startDate: null });
                  }}
                  isError={errors?.startDate != null}
                  errorMsg={errors?.startDate}
                />
              </div>
              <div className="w-full">
                <label
                  className="text-sm text-secondary-text mb-1 ml-1"
                  htmlFor="end-date-create-class"
                >
                  Ngày kết thúc
                </label>
                <Input
                  type="date"
                  id="end-date-create-class"
                  placeholder="Ngày kết thúc"
                  name="endDate"
                  value={endDate}
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-between gap-6">
              <div className="flex flex-col w-full">
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
                  errorMsg={errors.classTimes}
                />
              </div>

              <div className="flex flex-col w-full">
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
                  errorMsg={errors.room}
                />
              </div>
            </div>

            <Input
              className="w-full h-11 text-base text-secondary-text"
              placeholder="Mô tả"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              className="w-full h-11 text-base text-secondary-text"
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
          </form>
        </DialogContent>
        <DialogFooter>
          <Button
            onClick={() => {
              handleCreateClass();
            }}
            // isPending={isPending}
            type="button"
            // className="bg-blue-600 hover:bg-blue-800"
            className="w-full"
          >
            Tạo lớp học
          </Button>
        </DialogFooter>
      </Dialog>
      {/* MODAL CHỌN KHỐI */}
      <Dialog
        isOpen={isSelectingGrade}
        onClose={() => {
          setIsSelectingGrade(false);
        }}
        className="w-[25vw]"
      >
        <DialogHeader>
          <h1 className="text-center">Chọn khối</h1>
        </DialogHeader>
        <DialogContent>
          <div>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-3 gap-2">
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
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* MODAL CHỌN MÔN */}
      <Dialog
        isOpen={isSelectingSubject}
        onClose={() => {
          setIsSelectingSubject(false);
        }}
        className="w-[25vw]"
      >
        <DialogHeader>
          <h1 className="text-center">Chọn môn học</h1>
        </DialogHeader>
        <DialogContent>
          <div>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {courses.map((data, i) => (
                  <div
                    onClick={() => {
                      setIsSelectingSubject(false);
                      setErrors({ ...errors, course: null });
                      setCourse(data);
                    }}
                    key={i}
                    className="font-bold border-2 rounded-lg border-sky-500 px-2 py-1 text-sm text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer"
                  >
                    {data.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL CHỌN THỜI GIAN HỌC */}
      <Dialog
        isOpen={isSelectingDuration}
        onClose={() => setIsSelectingDuration(false)}
        className=""
      >
        <DialogHeader>
          <h1 className="text-center">Thời gian học</h1>
        </DialogHeader>
        <DialogContent className="">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min={1}
              placeholder="VD: 1"
              value={durationQuantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setDurationQuantity(isNaN(value) ? "" : value);
              }}
            />
            {/*<select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
              className="border-2 border-sky-500 p-2.5 text-sm rounded-lg h-fit"
            >
              <option value="Tháng">Tháng</option>
              <option value="Tuần">Tuần</option>
              <option value="Năm">Năm</option>
            </select>*/}
            <Select
              onValueChange={(value) => setDurationUnit(value as DurationUnit)}
              defaultValue="Tháng"
              defaultLabel="Tháng"
              className="w-[200px]"
            >
              <SelectItem value="Tháng">Tháng</SelectItem>
              <SelectItem value="Tuần">Tuần</SelectItem>
              <SelectItem value="Năm">Năm</SelectItem>
            </Select>
          </div>
        </DialogContent>
        <DialogFooter>
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
            className="mx-auto w-[30%]"
          >
            Hoàn tất
          </Button>
        </DialogFooter>
      </Dialog>
      {/* MODAL CHỌN KHUNG GIỜ HỌC */}
      <Dialog
        isOpen={isSelectingSchedule}
        onClose={() => {
          setIsSelectingSchedule(false);
        }}
        displayCloseButton={false}
        className="w-[40vw] h-min-[60%] h-[60%]"
      >
        <DialogHeader>
          <div className="grid grid-cols-2">
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
        </DialogHeader>

        <DialogContent>
          {scheduleType === "Giờ linh hoạt" ? (
            <div>
              <div className="flex items-end gap-3">
                {/*<select
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
                </select>*/}
                <Select
                  onValueChange={(value) => setSelectedDay(value as number)}
                  className="w-[120px] flex-none h-[40px]"
                  defaultLabel="Chọn thứ"
                >
                  <SelectItem value={2}>Thứ 2</SelectItem>
                  <SelectItem value={3}>Thứ 3</SelectItem>
                  <SelectItem value={4}>Thứ 4</SelectItem>
                  <SelectItem value={5}>Thứ 5</SelectItem>
                  <SelectItem value={6}>Thứ 6</SelectItem>
                  <SelectItem value={7}>Thứ 7</SelectItem>
                  <SelectItem value={1}>Chủ Nhật</SelectItem>
                </Select>
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col justify-between">
                    <label
                      htmlFor="start-time-create-class-flex"
                      className="ml-2 text-sm"
                    >
                      Bắt đầu:
                    </label>
                    {/*<input
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      type="time"
                      className="cursor-pointer h-[5vh] text-sm border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
                    />*/}
                    <Input
                      id="start-time-create-class-flex"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      type="time"
                      className="mt-1 h-[40px]"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <label
                      htmlFor="end-time-create-class-flex"
                      className="ml-2 text-sm"
                    >
                      Kết thúc:
                    </label>
                    {/*<input
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      type="time"
                      className="cursor-pointer h-[5vh] text-sm border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
                    />*/}
                    <Input
                      id="end-time-create-class-flex"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      type="time"
                      className="mt-1 h-[40px]"
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
                  className="rounded-xl h-[40px]"
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
              {/*CHỌN GIỜ CỐ ĐỊNH*/}
              <div className="">
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
                  <label htmlFor="start-time-create-class" className="ml-2">
                    Bắt đầu:
                  </label>
                  {/*<input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    type="time"
                    className="cursor-pointer border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
                  />*/}
                  <Input
                    id="start-time-create-class"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    type="time"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="end-time-create-class" className="ml-2">
                    Kết thúc:
                  </label>
                  {/*<input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    type="time"
                    className="cursor-pointer border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
                  />*/}
                  <Input
                    id="end-time-create-class"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    type="time"
                    className="mt-1"
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>

        <DialogFooter>
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
            className="w-1/3 mx-auto"
          >
            Hoàn tất
          </Button>
        </DialogFooter>
      </Dialog>

      {/* MODAL CHỌN PHÒNG HỌC */}
      <Dialog
        isOpen={isSelectingRoom}
        onClose={() => {
          setIsSelectingRoom(false);
        }}
        className="w-[25vw]"
      >
        <DialogHeader>
          <h1 className="text-center">Chọn phòng học</h1>
        </DialogHeader>
        <DialogContent>
          {!isLoading ? (
            <div className="grid grid-cols-3 gap-2">
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
            <Loading />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
