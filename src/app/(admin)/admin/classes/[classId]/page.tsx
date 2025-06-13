"use client";
import { ClassScheduleItem } from "@/app/types";
import { useQueries } from "@tanstack/react-query";
import { getClassById } from "@/app/lib/services/class";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { getClassSchedule } from "@/app/lib/services/classSchedule";
import { daysInWeekMap } from "@/app/lib/utils";
import { useEncodedRoute } from "@/app/lib/hooks";
import { useParams } from "next/navigation";

const ClassAdmin = () => {
  // const [currentPage, setCurrentPage] = useState(0);
  // const [totalPages, setTotalPages] = useState<number>(0);

  const params = useParams<{ classId: string }>();
  const { decodeId } = useEncodedRoute();
  const classId = decodeId(params?.classId as string);

  // const { data: classQuery, isLoading } = useQuery<ClassDetail>({
  //   queryKey: ["ClassDetail", classId],
  //   queryFn: () => getClassById(classId as string),
  //   placeholderData: (prevData) => prevData,
  // });

  // const { data: classSchedule } = useQuery({
  //   queryKey: ["ClassSchedule", classId],
  //   queryFn: () => getClassSchedule(classId as string, 0, 100),
  //   enabled: !!classQuery,
  // });

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

  console.log(classSchedule);

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
        <Loading />
      </div>
    );
  }

  return (
    <>
      {/* <button
        className="mt-2 ml-4 text-primary-dark hover:text-primary-darkest"
        onClick={() => router.back()}
      >
        ← Trở về
      </button> */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="shadow-md rounded-2xl p-4 md:p-6 my-4 border border-gray-100">
          <h2 className="text-lg md:text-2xl font-bold text-primary-darker mb-2">
            {classDetail?.name}
          </h2>
          <p className="text-sm md:text-base text-gray-600 italic mb-4">
            {classDetail?.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm text-gray-800">
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

        <div className="shadow-md rounded-2xl p-4 md:p-6 border border-gray-100">
          <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-4">
            📆 Danh sách buổi học
          </h3>
          {classSchedule && classSchedule.length > 0 ? (
            <ul className="space-y-3">
              {classSchedule.map(
                (schedule: ClassScheduleItem, index: number) => (
                  <li
                    key={schedule.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm md:text-base font-medium text-gray-800">
                          Buổi {index + 1}:{" "}
                          {daysInWeekMap[schedule.classSession.day]}
                        </div>
                        <div className="text-xs md:text-sm text-gray-500">
                          Ngày: {formatDate(schedule.date)}
                        </div>
                        <div className="text-xs md:text-sm text-gray-500">
                          Phòng:{" "}
                          {schedule.classSession.room?.name ??
                            "Chưa có phòng học"}
                        </div>
                      </div>
                      {schedule.isPassed ? (
                        <span
                          className={`text-xs px-2 py-1 rounded bg-green-100 text-green-700`}
                        >
                          Đã hoàn thành
                        </span>
                      ) : (
                        <span
                          className={`text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700`}
                        >
                          Chưa hoàn thành
                        </span>
                      )}
                    </div>
                  </li>
                ),
              )}
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
