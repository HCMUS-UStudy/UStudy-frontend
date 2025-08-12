"use client";
import { useParams } from "next/navigation";
import { ClassScheduleItem } from "@/app/types";
import { useQueries } from "@tanstack/react-query";
import { getClassById } from "@/app/lib/services/class";
import { getClassSchedule } from "@/app/lib/services/classSchedule";

const ClassDetailPage = () => {
  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;

  const [classQuery, classScheduleQuery] = useQueries({
    queries: [
      {
        queryKey: ["ClassDetail", classId],
        queryFn: () => getClassById(classId as string),
      },
      {
        queryKey: ["ClassSchedule", classId],
        queryFn: () => getClassSchedule(classId as string, 0, 100),
        enabled: !!classId,
      },
    ],
  });

  const { data: classDetail, isLoading } = classQuery;
  const { data: classSchedule } = classScheduleQuery;

  // const completed = Array.isArray(classSchedule)
  //   ? classSchedule.filter((s: ClassScheduleItem) => s.isPassed)
  //   : [];
  // const upcoming = Array.isArray(classSchedule)
  //   ? classSchedule.filter((s: ClassScheduleItem) => !s.isPassed)
  //   : [];

  // 2 buổi đã hoàn thành gần nhất (theo ngày giảm dần)
  // const lastCompletedList = completed
  //   .slice()
  //   .sort(
  //     (a: ClassScheduleItem, b: ClassScheduleItem) =>
  //       new Date(b.date).getTime() - new Date(a.date).getTime(),
  //   )
  //   .slice(0, 2)
  //   .reverse();

  // // 3 buổi chưa hoàn thành tiếp theo (theo ngày tăng dần)
  // const nextUpcoming = upcoming
  //   .slice()
  //   .sort(
  //     (a: ClassScheduleItem, b: ClassScheduleItem) =>
  //       new Date(a.date).getTime() - new Date(b.date).getTime(),
  //   )
  //   .slice(0, 3);

  // Danh sách hiển thị mặc định
  const displayList = classSchedule;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="mt-5">
        <ul className="space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <li
              key={`skeleton-${idx}`}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-36 h-3 bg-gray-200 rounded"></div>
                  <div className="w-28 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 flex flex-col overflow-y-hidden h-[calc(100vh-180px)]">
        <div className="shadow-md rounded-2xl p-4 md:px-6 my-4 border border-gray-100">
          <h2 className="text-lg md:text-2xl font-bold text-primary-darker mb-2">
            {classDetail?.name}
          </h2>
          <p className="text-gray-600 italic mb-4">
            {classDetail?.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm text-gray-800">
            <div>
              <span className="font-semibold">Môn:</span>
              <div>{classDetail?.course.name}</div>
            </div>
            <div>
              <span className="font-semibold">Khối:</span>
              <div>{classDetail?.grade.name}</div>
            </div>
            <div>
              <span className="font-semibold">Thời gian:</span>
              <div>
                {formatDate(classDetail?.startDate || "")} -{" "}
                {formatDate(classDetail?.endDate || "")}
              </div>
            </div>
            <div>
              <span className="font-semibold">Trạng thái:</span>
              <div className="w-fit px-2 py-1 text-xs bg-primary-light text-primary-darkest rounded">
                {classDetail?.status === "PROGRESS"
                  ? "Đang diễn ra"
                  : classDetail?.status === "OPEN"
                    ? "Chưa bắt đầu"
                    : classDetail?.status === "COMPLETED"
                      ? "Đã hoàn thành"
                      : "Chưa cập nhật"}
              </div>
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-800 mt-2">
            <span className="font-semibold">Ca học:</span>
            <div>
              {classDetail?.classSessions?.length
                ? classDetail.classSessions
                    .map(
                      (s) =>
                        `${
                          {
                            monday: "Thứ hai",
                            tuesday: "Thứ ba",
                            wednesday: "Thứ tư",
                            thursday: "Thứ năm",
                            friday: "Thứ sáu",
                            saturday: "Thứ bảy",
                            sunday: "Chủ nhật",
                          }[s.day.toLowerCase()] || s.day
                        } (${s.session.startTime} - ${s.session.endTime})`,
                    )
                    .join(" - ")
                : "Chưa có ca học"}
            </div>
          </div>
        </div>

        <div className="shadow-md rounded-2xl p-4 md:px-6 mb-1 border border-gray-100 h-full overflow-y-hidden">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">
            Danh sách buổi học
          </h3>
          {classSchedule ? (
            <ul className="flex flex-col gap-2 h-[80%] overflow-y-auto">
              {displayList.map((schedule: ClassScheduleItem, idx: number) => (
                <li
                  key={schedule.id ?? `schedule-${idx}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 font-medium text-gray-800 items-center">
                      <div>
                        {(
                          {
                            monday: "Thứ hai",
                            tuesday: "Thứ ba",
                            wednesday: "Thứ tư",
                            thursday: "Thứ năm",
                            friday: "Thứ sáu",
                            saturday: "Thứ bảy",
                            sunday: "Chủ nhật",
                          } as Record<string, string>
                        )[schedule.classSession.day.toLowerCase()] ||
                          schedule.classSession.day}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        ({formatDate(schedule.date)})
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      Phòng:{" "}
                      {schedule.classSession.room?.name || "Chưa có phòng học"}
                    </div>
                    {schedule.isPassed ? (
                      <span
                        className={`text-xs md:text-xs px-2 py-1 rounded text-green-700`}
                      >
                        Đã hoàn thành
                      </span>
                    ) : (
                      <span
                        className={`text-xs md:text-xs px-2 py-1 rounded text-yellow-700`}
                      >
                        Chưa hoàn thành
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Chưa có buổi học nào.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassDetailPage;

// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getClassById } from "@/app/lib/services/class";
// import { Button } from "@/app/ui/components/_common/Button";
// import AddingModal from "@/app/ui/components/user/teacher/AddingModal";
// import Loading from "@/app/ui/components/_common/loading/Loading";
// import { ClassTeacher } from "@/app/types";

// const formatDate = (dateStr: string) => {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("vi-VN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };

// export default function ClassDetailPage() {
//   const { classId } = useParams() as { classId: string };
//   const [classDetail, setClassDetail] = useState<ClassTeacher | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [addingModal, setAddingModal] = useState(false);

//   useEffect(() => {
//     const fetchClass = async () => {
//       try {
//         const response = await getClassById(classId);
//         setClassDetail(response);
//       } catch (error) {
//         console.error("Error fetching classes:", error);
//       }
//     };

//     fetchClass();
//   }, [classId]);

//   useEffect(() => {
//     if (classDetail) {
//       setLoading(false);
//     }
//   }, [classDetail]);

//   // const fetchListMembers = async () => {
//   //   const response = await getListMembers(classId, "", 0, 100, "STUDENT");
//   //   setMemberData(response);
//   // };

//   if (loading) {
//     return <Loading />;
//   }

//   if (!classDetail) {
//     return (
//       <div className="text-center mt-20">
//         <h1 className="text-3xl font-bold">Không tìm thấy lớp</h1>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="flex justify-center">
//           <Button onClick={() => setAddingModal(true)}>+ Nội dung mới</Button>
//         </div>
//         <div className="shadow-md rounded-2xl p-6 mb-8">
//           <h2 className="text-2xl font-bold text-primary-darker mb-2">
//             {classDetail.name}
//           </h2>
//           <p className="text-gray-600 italic mb-4">{classDetail.description}</p>

//           <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
//             <div>
//               <span className="font-semibold">Thời gian:</span>
//               <div>
//                 {formatDate(classDetail.startDate)} -{" "}
//                 {formatDate(classDetail.endDate)}
//               </div>
//             </div>
//             <div>
//               <span className="font-semibold">Khóa học:</span>
//               <div>{classDetail.course.name}</div>
//             </div>
//             <div>
//               <span className="font-semibold">Khối lớp:</span>
//               <div>{classDetail.grade.name}</div>
//             </div>
//             <div>
//               <span className="font-semibold">Trạng thái:</span>
//               <div className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
//                 {classDetail.status ?? "Chưa cập nhật"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Danh sách buổi học */}
//         <div className="shadow-md rounded-2xl p-6">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">
//             📆 Danh sách buổi học
//           </h3>
//           {classDetail.classSessions?.length > 0 ? (
//             <ul className="space-y-3">
//               {classDetail.classSessions.map((session, index) => (
//                 <li
//                   key={session.id}
//                   className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
//                 >
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <div className="font-medium text-gray-800">
//                         Buổi {index + 1}: {session.day}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Ngày: {formatDate(session.session.name)}
//                       </div>
//                     </div>
//                     {session.session.endTime > new Date().toISOString() ? (
//                       <span
//                         className={`text-xs font-semibold px-2 py-1 rounded
//                          bg-green-100 text-green-700
//                       `}
//                       >
//                         Đã hoàn thành
//                       </span>
//                     ) : (
//                       <span
//                         className={`text-xs font-semibold px-2 py-1 rounded
//                           bg-yellow-100 text-yellow-700
//                       `}
//                       >
//                         Chưa hoàn thành
//                       </span>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500 italic">Chưa có buổi học nào.</p>
//           )}
//         </div>
//       </div>
//       {addingModal && (
//         <AddingModal
//           classDetail={classDetail}
//           setAddingModal={setAddingModal}
//         />
//       )}
//     </>
//   );
// }
