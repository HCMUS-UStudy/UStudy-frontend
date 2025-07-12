"use client";

import { getListMembers } from "@/app/lib/services/class";
import { getPastSchedule } from "@/app/lib/services/classSchedule";
import {
  getAttendances,
  recordAttendances,
} from "@/app/lib/services/attendance";
import { useState, useEffect, useMemo } from "react";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/ui/components/_common/loading/Loading";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { ClassScheduleItem } from "@/app/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/ui/components/_common/Table";
import { useParams } from "next/navigation";
import Pagination from "@/app/ui/components/_common/Pagination";
import Checkbox from "@/app/ui/components/_common/Checkbox";
import { Button } from "@/app/ui/components/_common/Button";
import { MdEdit } from "react-icons/md";
import { AttendanceItem } from "@/app/types";
import { useCustomToast } from "@/app/lib/hooks/useToast";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

interface AttendanceMap {
  [sessionId: string]: AttendanceItem[];
}

const AttendancePage = () => {
  const searchParams = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [attendanceMap, setAttendanceMap] = useState<AttendanceMap>({});
  const [date, setDate] = useState<string>("");

  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;

  const [currentPage, setCurrentPage] = useState(0);
  // const [totalPages, setTotalPages] = useState<number>(0);

  const [memberQuery, classScheduleQuery, attendanceQuery] = useQueries({
    queries: [
      {
        queryKey: ["ListStudents", currentPage],
        refetchOnWindowFocus: false,
        queryFn: () =>
          getListMembers(
            classId,
            searchParams?.get("AccountName") ?? "",
            currentPage,
            100,
            "STUDENT",
          ),
      },
      {
        queryKey: ["ClassSchedule", classId],
        refetchOnWindowFocus: false,
        queryFn: () => getPastSchedule(classId as string, 0, 100),
        enabled: !!classId,
      },
      {
        queryKey: ["Attendance", date],
        refetchOnWindowFocus: false,
        queryFn: () => getAttendances(currentPage, 100, date),
        enabled: !!date && !date.startsWith("custom-"),
      },
    ],
  });

  const members = memberQuery.data;
  const totalPages = memberQuery.data?.totalPages ?? 0;

  const isLoading = memberQuery.isLoading;

  const classSchedule = useMemo(
    () =>
      (classScheduleQuery.data ?? [])
        .slice()
        .sort(
          (a: ClassScheduleItem, b: ClassScheduleItem) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    [classScheduleQuery.data],
  );

  useEffect(() => {
    if (classSchedule.length && date === "") {
      setDate(classSchedule[0].id);
    }
    if (!attendanceMap[date] && members?.content) {
      setAttendanceMap((prev) => ({
        ...prev,
        [date]: members.content?.map((member) => ({
          user: member,
          status: "PRESENT",
          note: "",
          recordedAt: "",
        })),
      }));
    }
  }, [classSchedule, date, members, attendanceMap]);

  const attendanceData = attendanceQuery.data;
  const lastModified = attendanceData?.attendances.content.length
    ? new Date(
        attendanceData.attendances.content.reduce(
          (latest, att) => {
            if (!att.recordedAt) return latest;
            return !latest || new Date(att.recordedAt) > new Date(latest)
              ? att.recordedAt
              : latest;
          },
          null as string | null,
        ) || "",
      )
    : null;

  useEffect(() => {
    if (date === "") return;
    if (attendanceData?.attendances?.content.length) {
      setAttendanceMap((prev) => ({
        ...prev,
        [date]: attendanceData.attendances.content,
      }));
    } else if (members?.content) {
      setAttendanceMap((prev) => ({
        ...prev,
        [date]: members.content.map((member) => ({
          user: member,
          status: "PRESENT",
          note: "",
          recordedAt: "",
        })),
      }));
    }
  }, [date, attendanceData, members]);

  const filteredStudents = members?.content?.filter(
    (member) =>
      member.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      member.genId.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleStatusChange = (userId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => {
      const updated =
        prev[date]?.map((attendance) =>
          attendance.user.id === userId
            ? { ...attendance, status }
            : attendance,
        ) ?? [];
      return {
        ...prev,
        [date]: updated,
      };
    });
  };

  const handleNoteChange = (userId: string, note: string) => {
    setAttendanceMap((prev) => {
      const updated =
        prev[date]?.map((attendance) =>
          attendance.user.id === userId ? { ...attendance, note } : attendance,
        ) ?? [];
      return {
        ...prev,
        [date]: updated,
      };
    });
  };

  const queryClient = useQueryClient();
  const { addToast } = useCustomToast();
  const mutation = useMutation({
    mutationFn: async ({
      studentStatusList,
      recordDate,
    }: {
      studentStatusList: {
        userId: string;
        status: AttendanceStatus;
        note: string;
      }[];
      recordDate: string;
    }) => {
      return recordAttendances(classId, recordDate, studentStatusList);
    },
    onSuccess: () => {
      addToast.success("Lưu điểm danh thành công");
      queryClient.invalidateQueries({
        queryKey: ["ClassSchedule", classId],
      });
      queryClient.invalidateQueries({
        queryKey: ["Attendance", date],
      });
      setIsEditing(false);
      if (date && date.startsWith("custom-")) {
        setDate(classSchedule[0]?.id || "custom-");
      }
    },
    onError: () => {
      addToast.error("Lưu điểm danh thất bại");
    },
  });

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

  const onSaveAttendances = () => {
    let recordDate = "";
    if (date.startsWith("custom-")) {
      recordDate = formatDate(new Date(date.replace("custom-", "")));
    } else {
      const session = classSchedule.find(
        (s: ClassScheduleItem) => s.id === date,
      );
      recordDate = session ? formatDate(new Date(session.date)) : "";
    }
    mutation.mutate({
      studentStatusList: attendanceMap[date].map((att) => ({
        userId: att.user.id,
        status: att.status,
        note: att.note,
      })),
      recordDate,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col mt-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 mt-4">
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 ml-1">
            <span className="font-semibold">Buổi học:</span>
            <select
              className="border rounded-lg border-primary-dark px-1 py-1 focus:outline-none focus:ring-1 focus:ring-primary-dark z-auto"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setIsEditing(false);
              }}
            >
              {/* Always show the custom date option on top */}
              <option value="custom-">Chọn ngày khác...</option>
              {classSchedule?.map((session: ClassScheduleItem) => (
                <option key={session.id} value={session.id}>
                  {new Date(session.date).toLocaleDateString("vi-VN")}
                </option>
              ))}
            </select>
            {date && date.startsWith("custom-") && (
              <input
                type="date"
                className="ml-2 border border-primary-darker rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-dark"
                value={(() => {
                  if (date === "custom-") {
                    return new Date().toISOString().split("T")[0];
                  }
                  const customDate = new Date(date.replace("custom-", ""));
                  return customDate.toISOString().split("T")[0];
                })()}
                onChange={(e) => {
                  const customDate = e.target.value;
                  setDate(`custom-${new Date(customDate).toISOString()}`);
                  setIsEditing(false);
                }}
              />
            )}
          </div>
          <span className="hidden sm:flex sm:text-sm lg:text-[15px] items-center mr-2">
            {lastModified ? (
              <span className="flex items-center gap-1">
                Cập nhật:{" "}
                <span className="text-primary-darkest">
                  {lastModified.toLocaleDateString("vi-VN")}{" "}
                  {lastModified.toLocaleTimeString("vi-VN")}
                </span>
              </span>
            ) : (
              ""
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex w-1/3">
            <SearchField
              queryKey="AccountName"
              placeholder="Tìm tên học sinh..."
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          {attendanceData?.attendances.content.length && !isEditing ? (
            <Button
              className="bg-white text-primary-darkest hover:bg-primary-lighter"
              onClick={() => setIsEditing(true)}
            >
              <MdEdit className="mr-2" />
              Sửa điểm danh
            </Button>
          ) : (
            <Button onClick={onSaveAttendances}>Lưu điểm danh</Button>
          )}
        </div>
      </>
      {attendanceQuery.isLoading ? (
        <Loading />
      ) : (
        attendanceMap[date] && (
          <Table>
            <TableHeader
              columns={[
                "GenId",
                "Tên",
                "Ngày sinh",
                "Giới tính",
                "Có mặt",
                "Vắng mặt",
                "Đi muộn",
                "Có phép",
                "Ghi chú",
              ]}
              className="bg-primary-light"
              classNameTH={[
                "",
                "",
                "",
                "text-center",
                "text-center",
                "text-center",
                "text-center",
                "text-center",
                "",
              ]}
            />
            <TableBody noDataMessage={false}>
              {filteredStudents?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.genId}</TableCell>
                  <TableCell>
                    {student.name.length > 18 ? (
                      <button>
                        <Tooltip text={student.name}>
                          {student.name.slice(0, 18)}...
                        </Tooltip>
                      </button>
                    ) : (
                      student.name
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(student.birthday).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.gender === "MALE" ? "Nam" : "Nữ"}
                  </TableCell>
                  {(
                    [
                      "PRESENT",
                      "ABSENT",
                      "LATE",
                      "EXCUSED",
                    ] as AttendanceStatus[]
                  ).map((status) => (
                    <TableCell key={status}>
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={attendanceMap[date]?.some(
                            (attendance) =>
                              attendance.user.id === student.id &&
                              attendance.status === status,
                          )}
                          className={
                            attendanceData &&
                            attendanceData?.attendances.totalElements > 0 &&
                            !isEditing
                              ? "cursor-not-allowed"
                              : ""
                          }
                          onChange={() => {
                            if (
                              (attendanceData &&
                                attendanceData?.attendances.totalElements ===
                                  0) ||
                              isEditing ||
                              date.startsWith("custom-")
                            ) {
                              handleStatusChange(student.id, status);
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="max-w-[180px]">
                    <div className="flex items-center w-full pr-5">
                      {attendanceData &&
                      attendanceData?.attendances.totalElements > 0 &&
                      !isEditing ? (
                        <span className="text-primary-darkest text-sm my-1">
                          {(() => {
                            const note = attendanceMap[date].find(
                              (att) => att.user.id === student.id,
                            )?.note;
                            return note && note.trim() !== ""
                              ? note
                              : "Không có ghi chú";
                          })()}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={
                            attendanceMap[date].find(
                              (att) => att.user.id === student.id,
                            )?.note ?? ""
                          }
                          onChange={(e) =>
                            handleNoteChange(student.id, e.target.value)
                          }
                          className="w-full h-8 px-2 text-gray-700 border bg-transparent border-primary-dark rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-primary-dark"
                          placeholder="Nhập ghi chú..."
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}

      <div className="flex justify-end mt-2">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            handlePageClick={(page) => setCurrentPage(page - 1)}
            handlePreviousPage={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 0))
            }
            handleNextPage={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
          />
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
