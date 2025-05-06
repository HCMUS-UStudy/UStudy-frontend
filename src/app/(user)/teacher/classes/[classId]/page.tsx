"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getClassById } from "@/app/lib/services/class";
import { Button } from "@/app/ui/components/_common/Button";
import AddingModal from "@/app/ui/components/user/teacher/AddingModal";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { ClassTeacher } from "@/app/types";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function ClassDetailPage() {
  const { classId } = useParams() as { classId: string };
  const [classDetail, setClassDetail] = useState<ClassTeacher | null>(null);
  const [loading, setLoading] = useState(true);

  const [addingModal, setAddingModal] = useState(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await getClassById(classId);
        setClassDetail(response);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClass();
  }, [classId]);

  useEffect(() => {
    if (classDetail) {
      setLoading(false);
    }
  }, [classDetail]);

  // const fetchListMembers = async () => {
  //   const response = await getListMembers(classId, "", 0, 100, "STUDENT");
  //   setMemberData(response);
  // };

  if (loading) {
    return <Loading />;
  }

  if (!classDetail) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">Không tìm thấy lớp</h1>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Button onClick={() => setAddingModal(true)}>+ Nội dung mới</Button>
        </div>
        <div className="shadow-md rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary-darker mb-2">
            {classDetail.name}
          </h2>
          <p className="text-gray-600 italic mb-4">{classDetail.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
            <div>
              <span className="font-semibold">Thời gian:</span>
              <div>
                {formatDate(classDetail.startDate)} -{" "}
                {formatDate(classDetail.endDate)}
              </div>
            </div>
            <div>
              <span className="font-semibold">Khóa học:</span>
              <div>{classDetail.course.name}</div>
            </div>
            <div>
              <span className="font-semibold">Khối lớp:</span>
              <div>{classDetail.grade.name}</div>
            </div>
            <div>
              <span className="font-semibold">Trạng thái:</span>
              <div className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                {classDetail.status ?? "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách buổi học */}
        <div className="shadow-md rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📆 Danh sách buổi học
          </h3>
          {classDetail.classSessions?.length > 0 ? (
            <ul className="space-y-3">
              {classDetail.classSessions.map((session, index) => (
                <li
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">
                        Buổi {index + 1}: {session.day}
                      </div>
                      <div className="text-sm text-gray-500">
                        Ngày: {formatDate(session.session.name)}
                      </div>
                    </div>
                    {session.session.endTime > new Date().toISOString() ? (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded 
                         bg-green-100 text-green-700
                      `}
                      >
                        Đã hoàn thành
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded
                          bg-yellow-100 text-yellow-700
                      `}
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
      {addingModal && (
        <AddingModal
          classDetail={classDetail}
          setAddingModal={setAddingModal}
        />
      )}
    </>
  );
}

// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getClassById } from "@/app/lib/services/class";
// import { Button } from "@/app/ui/components/_common/Button";
// import AddingModal from "@/app/ui/components/user/teacher/AddingModal";
// import Loading from "@/app/ui/components/_common/loading/Loading";
// import { ClassTeacher } from "@/app/types";

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
//     <div className="container px-4 flex flex-col gap-6">
//       {/* <TeacherNavigation activeTab={""} classId={classId} /> */}

//       <div className="flex justify-between">
//         <div className="bg-white p-6">
//           <h2 className="text-3xl font-bold mb-4">{classDetail.name}</h2>
//           <div className="text-[18px]">
//             <strong>Môn: </strong> {classDetail.course.name} -{" "}
//             {classDetail.grade.name}
//           </div>
//           <div className="text-[18px]">
//             <strong>Thời gian: </strong>
//             {classDetail.startDate} - {classDetail.endDate}
//           </div>
//           <div className="text-[18px]">
//             <strong>Phòng: </strong> 101
//           </div>
//           <div className="text-[18px]">
//             <strong>Giáo viên: </strong>Nguyễn Minh Quân
//           </div>
//         </div>

//         <div className="mr-6 mt-6 flex flex-col gap-2">
//           <Button onClick={() => setAddingModal(true)}> + Nội dung mới</Button>
//         </div>
//       </div>

//       {addingModal && (
//         <AddingModal
//           classDetail={classDetail}
//           setAddingModal={setAddingModal}
//         />
//       )}
//     </div>
//   );
// }
