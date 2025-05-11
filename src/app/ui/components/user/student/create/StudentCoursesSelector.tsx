// import { StudentRegisterInputs } from "@/app/register/page";
// import React, { useEffect, useState } from "react";
// import { useFormContext } from "react-hook-form";
// import SelectorLoading from "../../../_common/loading/SelectorLoading";
// import { FaCheck } from "react-icons/fa6";
// import { getClassSession } from "@/app/lib/services/session";
// import { ClassSessionItem, CourseDto, DaysInWeek } from "@/app/types";
// import { getCoursesByGradeId } from "@/app/lib/services/course";

// const dayOrder = [
//   "MONDAY",
//   "TUESDAY",
//   "WEDNESDAY",
//   "THURSDAY",
//   "FRIDAY",
//   "SATURDAY",
//   "SUNDAY",
// ];

// export default function StudentCoursesSelector() {
//   const {
//     setValue,
//     clearErrors,
//     formState: { errors },
//     watch,
//     setError,
//     getValues,
//   } = useFormContext<StudentRegisterInputs>();
//   const selectedGrade = watch("grades");
//   const selectedCourses = watch("courses");
//   const selectedBranch = watch("branchId");

//   const [loadingCourse, setLoadingCourses] = useState<boolean>(false);
//   const [courses, setCourses] = useState<CourseDto[]>([]);
//   const [loadingClassSession, setLoadingClassSession] =
//     useState<boolean>(false);
//   const [classSessions, setClassSessions] = useState<ClassSessionItem[]>([]);

//   const DayMapping: Record<DaysInWeek, string> = {
//     MONDAY: "Thứ Hai",
//     TUESDAY: "Thứ Ba",
//     WEDNESDAY: "Thứ Tư",
//     THURSDAY: "Thứ Năm",
//     FRIDAY: "Thứ Sáu",
//     SATURDAY: "Thứ Bảy",
//     SUNDAY: "Chủ Nhật",
//   };

//   const handleSelectCourse = async (courseId: string) => {
//     const currentCourses = [...selectedCourses];
//     const updatedClassSessions = [...classSessions];
//     let isAdded = false;
//     if (!selectedCourses.includes(courseId)) {
//       setValue("courses", [...currentCourses, courseId]);
//       isAdded = true;
//     } else {
//       setValue(
//         "courses",
//         currentCourses.filter((item) => item !== courseId),
//       );
//     }
//     try {
//       setLoadingClassSession(true);
//       const response = await getClassSession(
//         selectedBranch,
//         selectedGrade,
//         courseId,
//       );
//       console.log(response);
//       if (isAdded) {
//         setClassSessions((currentSession) => [...currentSession, ...response]);
//       } else {
//         response.map((item) => {
//           const index = updatedClassSessions.indexOf(item);
//           updatedClassSessions.splice(index, 1);
//         });
//         setClassSessions(updatedClassSessions);
//       }
//       clearErrors("classTimes");
//       if (getValues("courses").length !== 0) {
//         clearErrors("courses");
//       } else {
//         setError("courses", { message: "Chọn tối thiểu một môn học" });
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoadingClassSession(false);
//     }
//   };

//   useEffect(() => {
//     setClassSessions([]);
//   }, [selectedBranch, selectedGrade]);

//   const handleSelectClassSession = (
//     day: DaysInWeek,
//     branchSessionId: string,
//   ) => {
//     const currentClassTimes = watch("classTimes");
//     const isSelected = currentClassTimes.some(
//       (item) => item.day === day && item.branchSessionId === branchSessionId,
//     );
//     const updatedData = isSelected
//       ? currentClassTimes.filter(
//           (item) =>
//             !(item.day === day && item.branchSessionId === branchSessionId),
//         )
//       : [...currentClassTimes, { day, branchSessionId }];
//     setValue("classTimes", updatedData);
//   };

//   useEffect(() => {
//     const fetchCourses = async () => {
//       if (selectedGrade === "") {
//         return;
//       }
//       try {
//         setLoadingCourses(true);
//         const response = await getCoursesByGradeId(selectedGrade);
//         // console.log(response.content);
//         setCourses(response.content);
//         setValue("courses", []);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoadingCourses(false);
//       }
//     };
//     fetchCourses();
//     return;
//   }, [selectedGrade]);

//   return (
//     <>
//       {selectedGrade !== "" && (
//         <div>
//           <div className="text-gray-700 font-bold">
//             Bạn mong muốn học môn nào ?
//           </div>
//           <div>
//             {loadingCourse ? (
//               <SelectorLoading size="sm" numberOfItems={5}></SelectorLoading>
//             ) : courses.length !== 0 ? (
//               <>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {courses.map((course) => (
//                     <label
//                       key={course.id}
//                       className="relative px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-16 w-16 lg:h-20 lg:w-20 border-2 border-control-border text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
//                     >
//                       <input
//                         type="checkbox"
//                         className="hidden peer"
//                         // value={course.id}
//                         // {...register("courses")}
//                         checked={selectedCourses.includes(course.id)}
//                         onChange={() => handleSelectCourse(course.id)}
//                       />
//                       <span className="peer-checked:text-primary-darkest text-gray-700 transition-colors text-center text-xs lg:text-sm">
//                         {course.name}
//                       </span>
//                       <FaCheck className="size-12 lg:size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
//                     </label>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <span className="text-[13px] text-error">
//                 Chưa có môn học cho khối này, vui lòng chọn khối khác
//               </span>
//             )}
//           </div>
//           <div className="text-[13px] text-error mt-1">
//             {errors.courses?.message}
//           </div>
//         </div>
//       )}
//       {selectedGrade !== "" &&
//         selectedBranch !== "" &&
//         selectedCourses.length !== 0 && (
//           <div>
//             <div className="text-gray-700 font-bold">
//               Chọn các khung giờ có thể học
//             </div>
//             <div>
//               {loadingClassSession ? (
//                 <SelectorLoading size="sm" numberOfItems={5}></SelectorLoading>
//               ) : classSessions.length !== 0 ? (
//                 <>
//                   <div className="flex flex-col overflow-auto divide-y">
//                     {[
//                       ...new Map(
//                         classSessions
//                           .sort((a, b) => {
//                             return (
//                               dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
//                             );
//                           })
//                           .map((cs) => [
//                             `${cs.day}-${cs.startTime}-${cs.endTime}`,
//                             cs,
//                           ]),
//                       ).values(),
//                     ].map((cs, index) => (
//                       <label
//                         key={index}
//                         className="relative px-3 py-2 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-start border-control-border text-md hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary has-[:checked]:bg-primary-lighter cursor-pointer transition-all"
//                       >
//                         <input
//                           type="checkbox"
//                           className="hidden peer"
//                           name="ClassSessionSelector"
//                           onChange={() =>
//                             handleSelectClassSession(cs.day, cs.branchSessionId)
//                           }
//                         />
//                         <span className="peer-checked:text-primary-darkest text-gray-700 transition-colors text-sm">
//                           {DayMapping[cs.day]} - {cs.startTime.slice(0, -3)} -{" "}
//                           {cs.endTime.slice(0, -3)}
//                         </span>
//                         <FaCheck className="size-6 absolute right-3 text-primary-darkest opacity-0 peer-checked:opacity-70 transition-all" />
//                       </label>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <span className="text-[13px] text-error">
//                   Chưa có ca học cho môn học và khối này, vui lòng chọn môn học
//                   hoặc khối khác
//                 </span>
//               )}
//             </div>
//             <div className="text-[13px] text-error mt-1">
//               {errors.classTimes?.message}
//             </div>
//           </div>
//         )}
//     </>
//   );
// }
