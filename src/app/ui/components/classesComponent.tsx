// KHÔNG DÙNG ////////////////////////////////////////////////////////////

// "use client";
// import React, { useActionState, useEffect, useState } from "react";
// import { Button, SelectingButton } from "./button";
// import { Input, SearchField } from "./input";
// import { CircleX } from "lucide-react";
// import Modal from "./modal";
// import { createClass, CreateClassFormState } from "@/app/lib/action";
// import clsx from "clsx";
// import {
//   CourseItem,
//   GradeItem,
//   RoomItem,
//   TimeItem,
//   ScheduleItem,
//   Schedule,
//   Duration,
// } from "@/app/types/type";
// import { Spinner } from "./spinner";
// import { IoArrowDown } from "react-icons/io5";
// import { FaTrashCan } from "react-icons/fa6";
// import { getAllGrades } from "@/app/lib/api";

// const MockBranchID = "e7a865f8-baf6-4fb1-afed-58a3454aa257";

// export default function CoursesComponent() {
//   // const router = useRouter();
//   // DÀNH CHO SEARCH
//   // const searchParams = props.searchParams;
//   // const query = searchParams?.query || "";
//   // const currentPage = Number(searchParams?.page) || 1;
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isFlexibleTime, setIsFlexibleTime] = useState<boolean>(false);

//   // DÀNH CHO MODAL
//   const [selectedSubject, setSelectedSubject] = useState<string>("");
//   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

//   const [isSelectingSubject, setIsSelectingSubject] = useState<boolean>(false);
//   const [isSelectingGrade, setIsSelectingGrade] = useState<boolean>(false);
//   const [isSelectingDuration, setIsSelectingDuration] =
//     useState<boolean>(false);
//   const [isSelectingTime, setIsSelectingTime] = useState<boolean>(false);
//   const [isSelectingRoom, setIsSelectingRoom] = useState<boolean>(false);
//   const [isSelectingUnit, setIsSelectingUnit] = useState<boolean>(false);
//   const [isSelectingStartEndTime, setIsSelectingStartEndTime] =
//     useState<boolean>(false);
//   /////////////////////////////////////////////////////////////////////////////////

//   // DATA ĐỂ HIỂN THỊ
//   const [grades, setGrades] = useState<GradeItem[]>([]);
//   const [courses, setCourses] = useState<CourseItem[]>([]);
//   const [rooms, setRooms] = useState<RoomItem[]>([]);
//   const [duration, setDuration] = useState<Duration>({
//     quantity: 0,
//     unit: null,
//   });
//   const [selectedDay, setSelectedDay] = useState<number>(0);

//   const durationUnits: string[] = ["Tuần", "Tháng", "Năm"];
//   /////////////////////////////////////////////////////////////////////////////////

//   const initialState: CreateClassFormState = {
//     errors: {
//       name: null,
//       teacher: null,
//       subject: null,
//       date: null,
//       description: null,
//       fee: null,
//       grade: null,
//       duration: null,
//     },
//     message: null,
//   };
//   const [state, action, isPending] = useActionState(createClass, initialState);

//   const [time, setTime] = useState<string>("");
//   const [room, setRoom] = useState<string>("");

//   const [gradeId, setGradeId] = useState<string>("");

//   const [branchId, setBranchId] = useState<string>(MockBranchID);
//   const [roomId, setRoomId] = useState<string>("");
//   const [startTime, setStartTime] = useState<string>("00:00");
//   const [endTime, setEndTime] = useState<string>("00:00");

//   // CHỈNH SỬA DATA
//   const [className, setClassName] = useState<string>("");
//   const [grade, setGrade] = useState<GradeItem | null>(null);
//   const [course, setCourse] = useState<CourseItem | null>(null);
//   const [description, setDescription] = useState<string>("");
//   const [fee, setFee] = useState<number>(0);
//   const [startDateObj, setStartDateObj] = useState<string>("");
//   const [endDateObj, setEndDateObj] = useState<string>("");
//   const [fixTimes, setFixTimes] = useState<TimeItem[]>([]);
//   const [flexTimes, setFlexTimes] = useState<TimeItem[]>([]);

//   const [baseSchedule, setBaseSchedule] = useState<ScheduleItem[]>(Schedule);
//   /////////////////////////////////////////////////////////////////////////////////

//   useEffect(() => {
//     console.log(fixTimes);
//     console.log(flexTimes);
//   }, [fixTimes, flexTimes]);

//   useEffect(() => {
//     if (
//       startDateObj !== "" &&
//       duration !== null &&
//       duration.quantity !== null &&
//       duration.unit !== null
//     ) {
//       console.log("here");
//       const startDate = new Date(startDateObj);
//       const endDate = new Date(startDateObj);
//       switch (duration.unit) {
//         case "Tuần":
//           endDate.setDate(startDate.getDate() + duration.quantity * 7);
//           break;
//         case "Tháng":
//           endDate.setMonth(startDate.getMonth() + duration.quantity);
//           break;
//         case "Năm":
//           endDate.setFullYear(startDate.getFullYear() + duration.quantity);
//           break;
//       }
//       setEndDateObj(endDate.toISOString());
//     }
//   }, [startDateObj, duration]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const fetchGrades = await getAllGrades();
//         // console.log(fetchGrades);
//         setGrades(fetchGrades);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const selectCoursesByGrade = async (gradeId: string) => {
//     try {
//       setIsLoading(true);
//       const courses = await getCoursesByGrade(gradeId);
//       setCourses(courses);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const getAvailableRoom = async (
//   //   branchId: string,
//   //   timeId: string,
//   //   startDate: string,
//   //   endDate: string
//   // ) => {
//   //   try {
//   //     const response = await axiosInstance.get("/room/clerk/available", {
//   //       params: {
//   //         "branch-id": branchId,
//   //         "time-id": timeId,
//   //         "start-date": startDate.split("T")[0],
//   //         "end-date": endDate.split("T")[0],
//   //       },
//   //     });
//   //     setRooms(response.data);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   // const CreateNewClass = async (newClass: ClassSchema) => {
//   //   try {
//   //     console.log(newClass);
//   //     const response = await axiosInstance.post("/class/clerk/add", {
//   //       name: newClass.name,
//   //       courseId: newClass.courseId,
//   //       gradeId: newClass.gradeId,
//   //       startDate: newClass.startDate,
//   //       endDate: newClass.endDate,
//   //       description: newClass.description,
//   //       fee: newClass.fee,
//   //       teacherId: newClass.teacherId,
//   //       branchId: newClass.branchId,
//   //       timeId: newClass.timeId,
//   //       roomId: newClass.roomId,
//   //     });
//   //     console.log(response.data);
//   //     console.log(response.status);
//   //     if (response.status === 200) {
//   //       router.push(`/classes/${response.data.id}`);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   const toggleDaysInSchedule = (day: number) => {
//     setBaseSchedule((schedule) =>
//       schedule.map((item: ScheduleItem) =>
//         item.dataToSend === day ? { ...item, isChosen: !item.isChosen } : item
//       )
//     );
//   };
//   return (
//     <>
//       <h2 className="text-3xl font-bold tracking-tight my-4">
//         Quản lý lớp học
//       </h2>

//       <div className="relative flex items-center justify-between mt-6 mr-6">
//         <div className="flex gap-3 items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
//             <option value="">Tất cả các khối</option>
//             <option value="">Khối 10</option>
//             <option value="">Khối 11</option>
//             <option value="">Khối 12</option>
//           </select>
//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
//             <option value="">Tất cả các môn</option>
//             <option value="">Toán</option>
//             <option value="">Lý</option>
//             <option value="">Hóa</option>
//             <option value="">Văn</option>
//             <option value="">Anh</option>
//             <option value="">Sinh</option>
//           </select>
//           <SearchField
//             className="w-[200px]"
//             placeholder="Tìm theo tên lớp..."
//           />
//         </div>

//         <Button
//           onClick={() => {
//             setIsOpenModal(true);
//           }}
//           type="button"
//           className="pl-6 pr-6">
//           Thêm lớp học
//         </Button>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto mt-6 mr-6"></div>
//       <Modal
//         modalName="ModalCreateClass"
//         isOpen={isOpenModal}
//         className="h-fit pb-6">
//         <div className="flex flex-col relative">
//           <CircleX
//             onClick={() => {
//               setIsOpenModal(false);
//             }}
//             className="absolute top-4 right-6 bg-clip-padding w-[8%] h-auto opacity-50 hover:opacity-100 transition duration-200 bg-white cursor-pointer"
//           />
//           <h1 className="mx-auto mt-5 font-bold text-2xl text-gray-700">
//             Tạo lớp học
//           </h1>
//           <form
//             action={action}
//             className=" mx-6 mt-10 flex flex-col gap-2 md:gap-5">
//             <Input
//               className="w-full h-11 text-base text-secondary_text"
//               placeholder="Tên lớp"
//               name="className"
//               isError={state.errors?.name != null}
//               errorMsg={state.errors?.name}
//               value={className}
//               onChange={(e) => setClassName(e.target.value)}
//             />

//             <div className="flex gap-5">
//               <div>
//                 <SelectingButton
//                   onClick={() => {
//                     setIsSelectingGrade(true);
//                   }}
//                   placeholder={grade === null ? "Khối" : grade?.name}
//                   nameForInput="grade"
//                   className="w-[8vw]"
//                 />
//                 {state.errors?.grade && (
//                   <span className="text-[13px] text-error">
//                     {state.errors.grade}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <SelectingButton
//                   onClick={() => {
//                     if (grade === null) {
//                       return;
//                     }
//                     selectCoursesByGrade(grade.id);
//                     setIsSelectingSubject(true);
//                   }}
//                   placeholder={course === null ? "Môn học" : course.name}
//                   nameForInput="subject"
//                   className="w-[7vw]"
//                   disabled={grade === null}
//                 />
//                 {state.errors?.subject && (
//                   <span className="text-[13px] text-error">
//                     {state.errors.subject}
//                   </span>
//                 )}
//               </div>

//               <div className="flex-1">
//                 <SelectingButton
//                   onClick={() => {
//                     setIsSelectingDuration(true);
//                   }}
//                   placeholder={
//                     duration.unit === null
//                       ? "Thời gian học"
//                       : `${duration.quantity} ${duration.unit}`
//                   }
//                   nameForInput="duration"
//                   className="w-full"
//                 />
//                 {state.errors?.duration && (
//                   <span className="text-[13px] text-error">
//                     {state.errors.duration}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-between gap-8">
//               <div className="w-[15vw]">
//                 <h2 className="text-sm text-secondary_text mb-1 ml-1">
//                   Ngày bắt đầu
//                 </h2>
//                 <input
//                   type="date"
//                   id="default-datepicker"
//                   className={clsx(
//                     {
//                       "border-2 border-error": state.errors?.date,
//                       "border border-gray-300": !state.errors?.date,
//                     },
//                     "bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
//                   )}
//                   placeholder="Ngày bắt đầu"
//                   name="startDate"
//                   value={startDateObj}
//                   onChange={(e) => setStartDateObj(e.target.value)}
//                 />
//                 {state.errors?.date && (
//                   <span className="text-[13px] text-error">
//                     {state.errors.date[0]}
//                   </span>
//                 )}
//               </div>
//               <div className="w-[15vw]">
//                 <h2 className="text-sm text-secondary_text mb-1 ml-1">
//                   Ngày kết thúc
//                 </h2>
//                 <input
//                   type="date"
//                   id="default-datepicker"
//                   className={clsx(
//                     "bg-gray-50 text-gray-900 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
//                   )}
//                   placeholder="Ngày kết thúc"
//                   name="startDate"
//                   value={endDateObj.split("T")[0]}
//                   disabled
//                 />
//               </div>
//             </div>

//             <div className="flex justify-between gap-8">
//               <SelectingButton
//                 onClick={() => {
//                   setIsSelectingTime(true);
//                 }}
//                 nameForInput=""
//                 placeholder={"Khung giờ học"}
//                 className="w-[15vw]"
//               />
//               <SelectingButton
//                 onClick={() => {
//                   if (
//                     time !== "" &&
//                     endDateObj !== "" &&
//                     startDateObj !== "" &&
//                     branchId !== ""
//                   ) {
//                     // getAvailableRoom(
//                     //   branchId,
//                     //   timeId,
//                     //   startDateObj,
//                     //   endDateObj
//                     // );
//                     setIsSelectingRoom(true);
//                   }
//                 }}
//                 nameForInput=""
//                 placeholder={room === "" ? "Phòng học" : room}
//                 className="w-[15vw]"
//                 disabled={
//                   time === "" ||
//                   endDateObj === "" ||
//                   startDateObj === "" ||
//                   branchId === ""
//                 }
//               />
//             </div>

//             <Input
//               className="w-full h-11 text-base text-secondary_text"
//               placeholder="Mô tả"
//               name="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//             <Input
//               type="number"
//               className="w-full h-11 text-base text-secondary_text"
//               placeholder="Học phí"
//               name="fee"
//               isError={state.errors?.fee != null}
//               errorMsg={state.errors?.fee}
//               value={fee}
//               onChange={(e) => setFee(parseFloat(e.target.value))}
//             />
//             <Button
//               onClick={() => {
//                 // const newClass: ClassSchema = {
//                 //   name: className,
//                 //   courseId: courseId,
//                 //   gradeId: gradeId,
//                 //   startDate: startDateObj,
//                 //   endDate: endDateObj,
//                 //   description: description,
//                 //   fee: fee,
//                 //   branchId: branchId,
//                 //   timeId: timeId,
//                 //   roomId: roomId,
//                 // };
//                 // CreateNewClass(newClass);
//               }}
//               isPending={isPending}
//               type="submit"
//               className="mt-5">
//               {isPending ? "Đang tạo..." : "Tạo lớp học"}
//             </Button>
//           </form>
//         </div>
//       </Modal>
//       {/* MODAL CHỌN MÔN */}
//       <Modal
//         onClose={() => {
//           setIsSelectingSubject(false);
//         }}
//         modalName="ModalSelectSubject"
//         isOpen={isSelectingSubject}
//         className="w-[25vw] py-8">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-800 text-center">
//             Chọn môn học
//           </h1>
//           {isLoading ? (
//             <Spinner />
//           ) : (
//             <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
//               {courses.map((data, i) => (
//                 <div
//                   onClick={() => {
//                     // setSubjectForCreateClass(data.name);
//                     setIsSelectingSubject(false);
//                     setCourse(data);
//                     // setCourseId(data.id);
//                   }}
//                   key={i}
//                   className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
//                   {data.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </Modal>
//       {/* MODAL CHỌN KHỐI */}
//       <Modal
//         onClose={() => {
//           setIsSelectingGrade(false);
//         }}
//         modalName="ModalSelectSubject"
//         isOpen={isSelectingGrade}
//         className="w-[25vw] py-8">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-800 text-center">
//             Chọn khối
//           </h1>
//           {isLoading === false ? (
//             <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
//               {grades.map((data, i) => (
//                 <div
//                   onClick={() => {
//                     setGrade(data);
//                     setIsSelectingGrade(false);
//                     setGradeId(data.id);
//                   }}
//                   key={i}
//                   className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
//                   {data.name}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <Spinner />
//           )}
//         </div>
//       </Modal>
//       {/* MODAL CHỌN THỜI GIAN HỌC */}
//       <Modal
//         modalName="ModalSelectSubject"
//         isOpen={isSelectingDuration}
//         className="w-[25vw] py-8">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-800 text-center">
//             Thời gian học
//           </h1>
//           <div className="grid grid-cols-2 gap-2 mx-8 mt-4">
//             <input
//               type="number"
//               placeholder="VD: 1"
//               value={duration?.quantity === null ? 0 : duration?.quantity}
//               onChange={(e) => {
//                 if (duration === null) {
//                   setDuration({
//                     quantity: parseInt(e.target.value),
//                     unit: null,
//                   });
//                 } else {
//                   setDuration({
//                     ...duration,
//                     quantity: parseInt(e.target.value),
//                   });
//                 }
//               }}
//               className=" border-2 border-sky-500 focus:border-sky-600 rounded-lg px-2 py-1.5"
//             />
//             <SelectingButton
//               onClick={() => {
//                 setIsSelectingUnit(true);
//               }}
//               placeholder={
//                 duration?.unit === null || duration === null
//                   ? "Đơn vị thời gian"
//                   : duration?.unit
//               }
//               nameForInput="subject"
//               className="w-full"
//             />
//           </div>
//           <Button
//             onClick={() => {
//               setIsSelectingDuration(false);
//             }}
//             className="mx-auto mt-3 w-[30%]">
//             Hoàn tất
//           </Button>
//         </div>
//       </Modal>
//       {/* MODAL CHỌN KHUNG GIỜ HỌC */}
//       <Modal
//         onClose={() => {
//           setIsSelectingTime(false);
//         }}
//         modalName="ModalSelectSubject"
//         isOpen={isSelectingTime}
//         className="w-[25vw] h-min-[60%] h-[60%] py-8">
//         <div className="flex flex-col items-center justify-between h-full">
//           <div className="grid grid-cols-2 gap-8">
//             <div
//               onClick={() => {
//                 setIsFlexibleTime(false);
//                 setIsSelectingStartEndTime(false);
//               }}
//               className={
//                 "border-sky-500 rounded px-2 text-xl text-center cursor-pointer"
//               }>
//               Giờ cố định
//               <div
//                 className={clsx(
//                   {
//                     "opacity-100 scale-y-100": isFlexibleTime === false,
//                     "opcacity-0 scale-y-0": isFlexibleTime === true,
//                   },
//                   "h-[1vh] rounded-xl bg-sky-500 mt-1 transition-all duration-100"
//                 )}></div>
//             </div>
//             <div
//               onClick={() => {
//                 setIsFlexibleTime(true);
//                 setIsSelectingStartEndTime(false);
//               }}
//               className={
//                 "border-sky-500 rounded px-2 text-xl text-center cursor-pointer"
//               }>
//               Giờ linh hoạt
//               <div
//                 className={clsx(
//                   {
//                     "opacity-100 scale-y-100": isFlexibleTime === true,
//                     "opcacity-0 scale-y-0": isFlexibleTime === false,
//                   },
//                   "h-[1vh] rounded-xl bg-sky-500 mt-1 transition"
//                 )}></div>
//             </div>
//           </div>
//           {/* CHỌN GIỜ LINH HOẠT */}
//           {isFlexibleTime === true ? (
//             <div>
//               <div className="flex items-end gap-3">
//                 <select
//                   value={selectedDay}
//                   onChange={(e) => setSelectedDay(parseInt(e.target.value))}
//                   className="border-2 border-sky-500 p-2.5 text-sm rounded-lg h-fit">
//                   <option value={0}>Chọn thứ</option>
//                   <option value={1}>Thứ 2</option>
//                   <option value={2}>Thứ 3</option>
//                   <option value={3}>Thứ 4</option>
//                   <option value={4}>Thứ 5</option>
//                   <option value={5}>Thứ 6</option>
//                   <option value={6}>Thứ 7</option>
//                   <option value={7}>Chủ Nhật</option>
//                 </select>
//                 <div className="flex justify-center gap-4">
//                   <div>
//                     <h1 className="ml-2 mb-1">Bắt đầu:</h1>
//                     <input
//                       value={startTime}
//                       onChange={(e) => setStartTime(e.target.value)}
//                       type="time"
//                       className="cursor-pointer border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <h1 className="ml-2 mb-1">Kết thúc:</h1>
//                     <input
//                       value={endTime}
//                       onChange={(e) => setEndTime(e.target.value)}
//                       type="time"
//                       className="cursor-pointer border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <Button
//                 onClick={() => {
//                   if (selectedDay === 0) {
//                     return;
//                   }
//                   const newTimes: TimeItem[] = [...flexTimes];
//                   const existingItem = newTimes.find(
//                     (item) => item.dayInWeek === selectedDay
//                   );
//                   if (existingItem) {
//                     existingItem.startTime = startTime;
//                     existingItem.endTime = endTime;
//                   } else {
//                     newTimes.push({
//                       dayInWeek: selectedDay,
//                       startTime: startTime,
//                       endTime: endTime,
//                     });
//                   }
//                   setFlexTimes(newTimes);
//                 }}
//                 className="rounded-full mx-auto mt-3 px-5">
//                 <IoArrowDown size={20} />
//               </Button>
//               <div className="flex flex-col gap-3 w-full bg-background border-2 border-gray-300 h-[20vh] mt-5 rounded-lg py-3 px-2 text-sm overflow-y-auto">
//                 {flexTimes.map((data, i) => (
//                   <>
//                     <div key={i} className="flex justify-evenly font-bold">
//                       <div>
//                         {data.dayInWeek !== 7
//                           ? "Thứ " + (Number(data.dayInWeek) + 1)
//                           : "Chủ Nhật"}
//                       </div>
//                       <div>
//                         {data.startTime} - {data.endTime}
//                       </div>
//                       <FaTrashCan
//                         onClick={() => {
//                           const newTimes: TimeItem[] = [...flexTimes];
//                           const updatedTimes = newTimes.filter(
//                             (item) => item.dayInWeek !== data.dayInWeek
//                           );
//                           setFlexTimes(updatedTimes);
//                         }}
//                         size={15}
//                         color="red"
//                         className="cursor-pointer hover:scale-125 transition-all"
//                       />
//                     </div>
//                     <div className="w-[80%] mx-auto h-[0.2vh] bg-gray-300"></div>
//                   </>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* CHỌN GIỜ CỐ ĐỊNH */}
//               <div className="mt-5 mx-3">
//                 <h1 className="text-center">Chọn các ngày sẽ học</h1>
//                 <div className="flex flex-wrap justify-center gap-2 text-sm mt-3 font-bold">
//                   {baseSchedule.map((data, i) => (
//                     <div
//                       onClick={() => {
//                         toggleDaysInSchedule(data.dataToSend);
//                       }}
//                       key={i}
//                       className={clsx(
//                         {
//                           "bg-sky-100 hover:bg-sky-300 transition-colors":
//                             !data.isChosen,
//                           "bg-sky-300": data.isChosen,
//                         },
//                         "border-2 border-sky-500  rounded-xl px-4 py-1.5 cursor-pointer"
//                       )}>
//                       {data.display}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex justify-center gap-4 mt-3">
//                 <div>
//                   <h1 className="ml-2 mb-1">Bắt đầu:</h1>
//                   <input
//                     value={startTime}
//                     onChange={(e) => setStartTime(e.target.value)}
//                     type="time"
//                     className="cursor-pointer border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <h1 className="ml-2 mb-1">Kết thúc:</h1>
//                   <input
//                     value={endTime}
//                     onChange={(e) => setEndTime(e.target.value)}
//                     type="time"
//                     className="cursor-pointer border-2 border-sky-500 rounded-xl px-2 py-2 font-bold bg-sky-100 hover:bg-sky-300 transition-colors"
//                   />
//                 </div>
//               </div>
//             </>
//           )}
//           {isSelectingStartEndTime === false ? (
//             <Button
//               onClick={() => {
//                 const newTimes: TimeItem[] = [];
//                 baseSchedule.map((data) => {
//                   if (data.isChosen === true) {
//                     newTimes.push({
//                       dayInWeek: data.dataToSend,
//                       startTime: startTime,
//                       endTime: endTime,
//                     });
//                   }
//                 });
//                 setFixTimes(newTimes);
//                 setIsSelectingTime(false);
//               }}
//               className="w-1/3 mt-5">
//               Hoàn tất
//             </Button>
//           ) : (
//             <Button onClick={() => {}} className="w-1/3 mt-5">
//               Thêm
//             </Button>
//           )}
//         </div>
//       </Modal>
//       {/* MODAL CHO PHÒNG HỌC */}
//       <Modal
//         onClose={() => {
//           setIsSelectingRoom(false);
//         }}
//         modalName="ModalSelectSubject"
//         isOpen={isSelectingRoom}
//         className="w-[25vw] py-8">
//         <div className="">
//           <h1 className="text-xl font-semibold text-gray-800 text-center">
//             Phòng học
//           </h1>
//           <div className="grid grid-cols-2 gap-2 mx-8 mt-4">
//             {rooms.map((data, i) => (
//               <div
//                 onClick={() => {
//                   setRoom(data.name);
//                   setIsSelectingRoom(false);
//                   setRoomId(data.id);
//                 }}
//                 key={i}
//                 className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
//                 <div>{data.name}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Modal>
//       {/* MODAL CHỌN ĐƠN VỊ THỜI GIAN */}
//       <Modal
//         onClose={() => {
//           setIsSelectingUnit(false);
//         }}
//         modalName="ModalSelectSubject"
//         isOpen={isSelectingUnit}
//         className="w-[25vw] py-8">
//         <div className="">
//           <h1 className="text-xl font-semibold text-gray-800 text-center">
//             Đơn vị thời gian
//           </h1>
//           <div className="grid grid-cols-3 gap-2 mx-8 mt-4">
//             {durationUnits.map((data, i) => (
//               <div
//                 onClick={() => {
//                   if (duration !== null) {
//                     setDuration({ ...duration, unit: data });
//                   } else {
//                     setDuration({
//                       quantity: null,
//                       unit: data,
//                     });
//                   }
//                   setIsSelectingUnit(false);
//                 }}
//                 key={i}
//                 className="font-bold border-2 rounded-lg border-sky-500 py-1 text-sm  text-center bg-sky-100 hover:bg-sky-300 transition-colors cursor-pointer">
//                 <div>{data}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// }
