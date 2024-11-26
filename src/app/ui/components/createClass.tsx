"use client";
import React, { useEffect, useState } from "react";
import { Button, SelectingButton } from "./button";
import Modal from "./modal";
import { CircleX } from "lucide-react";
import { Input } from "./input";
import clsx from "clsx";
import {
  CourseItem,
  Duration,
  DurationUnit,
  GradeItem,
} from "@/app/types/type";
import Spinner from "./spinner";
import { getAllGrades, getCoursesByGradeId } from "@/app/lib/api";

export default function CreateClass() {
  // CÁC STATE PHỤ
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //   STATE CHO MODAL
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isSelectingGrade, setIsSelectingGrade] = useState<boolean>(false);
  const [isSelectingSubject, setIsSelectingSubject] = useState<boolean>(false);
  const [isSelectingDuration, setIsSelectingDuration] =
    useState<boolean>(false);
  const [isSelectingUnit, setIsSelectingUnit] = useState<boolean>(false);

  // STATE ĐỂ GỌI API TẠO CLASS
  const [name, setName] = useState<string>("");
  const [grade, setGrade] = useState<GradeItem | null>(null);
  const [course, setCourse] = useState<CourseItem | null>(null);

  // STATE ĐỂ HIỂN THỊ
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [duration, setDuration] = useState<Duration>({
    quantity: 0,
    unit: null,
  });
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("Tháng");

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

  return (
    <div>
      <Button
        onClick={() => {
          setIsOpenModal(true);
        }}
        type="button"
        className="pl-6 pr-6">
        Thêm lớp học
      </Button>
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
            // action={action}
            className=" mx-6 mt-10 flex flex-col gap-2 md:gap-5">
            <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Tên lớp"
              name="name"
              //   isError={state.errors?.name != null}
              //   errorMsg={state.errors?.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex gap-5">
              <div>
                <SelectingButton
                  onClick={() => {
                    setIsSelectingGrade(true);
                  }}
                  placeholder={grade === null ? "Khối" : grade?.name}
                  nameForInput="grade"
                  className="w-[8vw]"
                />
                {/* {state.errors?.grade && (
                  <span className="text-[13px] text-error">
                    {state.errors.grade}
                  </span>
                )} */}
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
                  disabled={grade === null}
                />
                {/* {state.errors?.subject && (
                  <span className="text-[13px] text-error">
                    {state.errors.subject}
                  </span>
                )} */}
              </div>

              <div className="flex-1">
                <SelectingButton
                  onClick={() => {
                    setIsSelectingDuration(true);
                  }}
                  placeholder={
                    duration.unit === null
                      ? "Thời gian học"
                      : `${duration.quantity} ${duration.unit}`
                  }
                  nameForInput="duration"
                  className="w-full"
                />
                {/* {state.errors?.duration && (
                  <span className="text-[13px] text-error">
                    {state.errors.duration}
                  </span>
                )} */}
              </div>
            </div>

            <div className="flex justify-between gap-8">
              {/* <div className="w-[15vw]">
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
                  value={startDateObj}
                  onChange={(e) => setStartDateObj(e.target.value)}
                />
                {state.errors?.date && (
                  <span className="text-[13px] text-error">
                    {state.errors.date[0]}
                  </span>
                )}
              </div> */}
              {/* <div className="w-[15vw]">
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
                  value={endDateObj.split("T")[0]}
                  disabled
                />
              </div> */}
            </div>

            <div className="flex justify-between gap-8">
              {/* <SelectingButton
                onClick={() => {
                  setIsSelectingTime(true);
                }}
                nameForInput=""
                placeholder={"Khung giờ học"}
                className="w-[15vw]"
              /> */}
              {/* <SelectingButton
                onClick={() => {
                  if (
                    time !== "" &&
                    endDateObj !== "" &&
                    startDateObj !== "" &&
                    branchId !== ""
                  ) {
                    // getAvailableRoom(
                    //   branchId,
                    //   timeId,
                    //   startDateObj,
                    //   endDateObj
                    // );
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
              /> */}
            </div>

            {/* <Input
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Mô tả"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /> */}
            {/* <Input
              type="number"
              className="w-full h-11 text-base text-secondary_text"
              placeholder="Học phí"
              name="fee"
              isError={state.errors?.fee != null}
              errorMsg={state.errors?.fee}
              value={fee}
              onChange={(e) => setFee(parseFloat(e.target.value))}
            /> */}
            {/* <Button
              onClick={() => {
                // const newClass: ClassSchema = {
                //   name: className,
                //   courseId: courseId,
                //   gradeId: gradeId,
                //   startDate: startDateObj,
                //   endDate: endDateObj,
                //   description: description,
                //   fee: fee,
                //   branchId: branchId,
                //   timeId: timeId,
                //   roomId: roomId,
                // };
                // CreateNewClass(newClass);
              }}
              isPending={isPending}
              type="submit"
              className="mt-5">
              {isPending ? "Đang tạo..." : "Tạo lớp học"}
            </Button> */}
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
        className="w-[25vw] py-8">
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
                    setIsSelectingGrade(false);
                  }}
                  key={i}
                  className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
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
        className="w-[25vw] py-8">
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
                    setCourse(data);
                  }}
                  key={i}
                  className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
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
        className="w-[25vw] py-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Thời gian học
          </h1>
          <div className="grid grid-cols-2 gap-2 mx-8 mt-4">
            <input
              type="number"
              placeholder="VD: 1"
              value={duration?.quantity === null ? 0 : duration?.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) {
                  setDuration({
                    quantity: 0,
                    unit: null,
                  });
                }
                if (duration === null) {
                  setDuration({
                    quantity: parseInt(e.target.value),
                    unit: null,
                  });
                } else {
                  setDuration({
                    ...duration,
                    quantity: parseInt(e.target.value),
                  });
                }
              }}
              className=" border-2 border-sky-500 focus:border-sky-600 rounded-lg px-2 py-1.5"
            />
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
              className="border-2 border-sky-500 p-2.5 text-sm rounded-lg h-fit">
              <option value="Tháng">Tháng</option>
              <option value="Tuần">Tuần</option>
              <option value="Năm">Năm</option>
            </select>
          </div>
          <Button
            onClick={() => {
              setIsSelectingDuration(false);
            }}
            className="mx-auto mt-3 w-[30%]">
            Hoàn tất
          </Button>
        </div>
      </Modal>
    </div>
  );
}
