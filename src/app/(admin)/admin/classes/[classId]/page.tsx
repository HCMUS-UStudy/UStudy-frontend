"use client";
import { useParams } from "next/navigation";
import { ClassDetail } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { getClassById } from "@/app/lib/services/class";

const ClassAdmin = () => {
  const { classId } = useParams();
  const { data: classDetail } = useQuery<ClassDetail>({
    queryKey: ["ClassDetail", classId],
    queryFn: () => getClassById(classId as string),
    placeholderData: (prevData) => prevData,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      {/* <button
        className="mt-2 ml-4 text-primary-dark hover:text-primary-darkest"
        onClick={() => router.back()}
      >
        ← Trở về
      </button> */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="shadow-md rounded-2xl p-6 my-4 border border-gray-100">
          <h2 className="text-2xl font-bold text-primary-darker mb-2">
            {classDetail?.name}
          </h2>
          <p className="text-gray-600 italic mb-4">
            {classDetail?.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
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
              <div className="w-fit px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                {classDetail?.status ?? "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>

        <div className="shadow-md rounded-2xl p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📆 Danh sách buổi học
          </h3>
          {classDetail?.classSessions.length ? (
            <ul className="space-y-3">
              {classDetail?.classSessions.map((session, index) => (
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
                        className={`text-xs px-2 py-1 rounded bg-green-100 text-green-700
                      `}
                      >
                        Đã hoàn thành
                      </span>
                    ) : (
                      <span
                        className={`text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700
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
    </>
  );
};

export default ClassAdmin;
