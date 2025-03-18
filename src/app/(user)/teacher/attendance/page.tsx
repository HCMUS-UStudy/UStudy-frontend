"use client";

import { getAllAttendances } from "@/app/lib/services/attendance";
import { getClassesForTeacher } from "@/app/lib/services/class";
import { getAllClassSchedule } from "@/app/lib/services/classSchedule";
import { AttendanceItem, ClassTeacher } from "@/app/types/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

const AttendancePage = () => {
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("3");
  const [session, setSession] = useState("");
  const [sessions, setSessions] = useState<
    { id: string; date: string; dayOfWeek: string }[]
  >([]);

  const [attendances, setAttendances] = useState<AttendanceItem[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<ClassTeacher[]>([]);
  const [countStatus, setCountStatus] = useState<Record<string, number>>({});
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null,
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [totalElements, setTotalElements] = useState<number | 0>(0);
  const [selectedLabel, setSelectedLabel] =
    useState<keyof typeof labelToEnglish>("Tất cả");

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const translateDayOfWeek = (day: string): string => {
    const days: Record<string, string> = {
      MONDAY: "Thứ Hai",
      TUESDAY: "Thứ Ba",
      WEDNESDAY: "Thứ Tư",
      THURSDAY: "Thứ Năm",
      FRIDAY: "Thứ Sáu",
      SATURDAY: "Thứ Bảy",
      SUNDAY: "Chủ Nhật",
    };
    return days[day] || day; // Nếu không khớp, trả về nguyên gốc
  };

  const labelToEnglish = {
    "Tất cả": "",
    "Có mặt": "PRESENT",
    "Vắng mặt": "ABSENT",
    "Đi muộn": "LATE",
    "Vắng có phép": "EXCUSED",
  } as const;

  const handleClick = (label: keyof typeof labelToEnglish) => {
    setSelectedLabel(label);
  };

  const handleScheduleChange = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
  };

  const handleAttendanceChange = (
    userId: string | number,
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
  ) => {
    setAttendances((prev) =>
      prev.map((att) => (att.user.id === userId ? { ...att, status } : att)),
    );
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getClassesForTeacher();

        setTeacherClasses(classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(false);
      console.log(totalPages);
      try {
        const response = await getAllClassSchedule(
          "0a6cf6fc-caf1-4d37-b20b-eff2daec2cf2",
          Number(month),
          Number(year),
        );

        if (Array.isArray(response)) {
          const sessionDays = response.map((item) => ({
            id: item.id,
            date: item.date.split("-")[2], // Lấy ngày từ format YYYY-MM-DD
            dayOfWeek: translateDayOfWeek(item.classSession.day), // Lấy thứ trong tuần từ API
          }));

          setSessions(sessionDays);
          if (sessionDays.length > 0) {
            setSession(sessionDays[0].date); // Chọn ngày đầu tiên
            setSelectedScheduleId(sessionDays[0].id);
          }
        } else {
          console.error("API không trả về mảng:", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch học:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [month, year]);

  useEffect(() => {
    const fetchAttendances = async () => {
      if (!selectedScheduleId || !selectedClass) return;
      setLoading(true);
      try {
        const response = await getAllAttendances(
          selectedClass,
          0,
          100,
          selectedScheduleId,
          labelToEnglish[selectedLabel],
        );
        setAttendances(response.attendances.content); // Cập nhật danh sách điểm danh
        setTotalPages(response.attendances.totalPages); // Cập nhật tổng số trang
        setTotalElements(response.attendances.totalElements);
        setCountStatus(response.countStatus || {});
      } catch (error) {
        console.error("Lỗi khi fetch attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, [selectedScheduleId, selectedLabel, selectedClass]); // Gọi lại khi trang thay đổi

  // const handleAttendanceChange = (userId, newStatus) => {
  //   setAttendances((prevAttendances) =>
  //     prevAttendances.map((att) =>
  //       att.user.id === userId ? { ...att, status: newStatus } : att,
  //     ),
  //   );
  // };

  const attendanceStats = [
    {
      label: "Tất cả",
      value: totalElements,
    },
    { label: "Có mặt", value: countStatus["PRESENT"] || 0 },
    { label: "Vắng mặt", value: countStatus["ABSENT"] || 0 },
    { label: "Đi muộn", value: countStatus["LATE"] || 0 },
    { label: "Vắng có phép", value: countStatus["EXCUSED"] || 0 },
  ];

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6 bg-primary-lighter p-4 rounded-lg">
        <span className="font-semibold text-primary-dark text-lg flex items-center">
          <FaChalkboardTeacher className="mr-2 text-xl" /> Chọn lớp:
        </span>
        <div className="relative w-64">
          <select
            className="w-full border border-primary-dark rounded-lg px-4 py-2 text-gray-700 focus:ring focus:ring-primary-dark appearance-none cursor-pointer"
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="" disabled>
              -- Chọn lớp --
            </option>
            {teacherClasses.map((teacherClass) => (
              <option key={teacherClass.id} value={teacherClass.id}>
                {teacherClass.name} - {teacherClass.description}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-1 top-3 text-primary-dark pointer-events-none" />
        </div>
      </div>

      {/* Chọn ngày điểm danh */}
      <div className="flex flex-wrap items-center justify-between bg-primary-light p-4 rounded-lg shadow-md mb-6">
        {/* Phần chọn ngày, tháng, buổi */}
        <div className="flex items-center space-x-4">
          <select
            className="border rounded-lg px-3 py-2 focus:ring focus:ring-primary-dark"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 focus:ring focus:ring-primary-dark"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-3 py-2 focus:ring focus:ring-primary-dark"
            value={session}
            onChange={(e) => {
              const selected = sessions.find((s) => s.date === e.target.value);
              if (selected) {
                setSession(selected.date);
                handleScheduleChange(selected.id);
              }
            }}
          >
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <option key={session.date} value={session.date}>
                  Buổi {index + 1} - {translateDayOfWeek(session.dayOfWeek)} (
                  {session.date}/{month}/{year})
                </option>
              ))
            ) : (
              <option value="" disabled>
                Không có buổi học nào
              </option>
            )}
          </select>

          <span className="font-semibold text-highlight-text">
            {sessions.find((s) => s.date === session)?.dayOfWeek}, ngày{" "}
            {session}/{month}/{year}
          </span>

          <FaCalendarAlt className="text-primary-darker" />
        </div>

        <button className="bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-hover-primary">
          Gửi thông báo PH
        </button>
      </div>

      {/* Các ô hiển thị số lượng học sinh (có thể click) */}
      <div className="flex space-x-2 mb-4">
        {attendanceStats.map((item, index) => (
          <button
            key={index}
            className={`px-4 py-2 border border-primary-dark rounded-lg text-primary-dark font-semibold 
      transition-all hover:bg-primary-light hover:shadow-md active:bg-primary-dark active:text-white
      ${selectedLabel === item.label ? "bg-primary-dark text-white" : ""}`}
            onClick={() =>
              handleClick(item.label as keyof typeof labelToEnglish)
            }
          >
            {item.label}: {item.value}
          </button>
        ))}
      </div>

      {/* Hiển thị thông báo nếu chưa chọn lớp hoặc lịch học */}
      {!selectedClass || !selectedScheduleId ? (
        <div className="text-center text-lg font-semibold text-highlight-text my-6">
          Vui lòng chọn lớp và lịch học để xem danh sách điểm danh.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader
              columns={[
                "Mã số",
                "Họ tên",
                "Có mặt",
                "Vắng mặt",
                "Đi muộn",
                "Vắng có phép",
                "Ghi chú",
              ]}
              className="bg-primary text-gray-700"
            />
            <TableBody isLoading={loading}>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-primary-darker"
                  >
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : attendances.length > 0 ? (
                attendances.map((attendance) => (
                  <TableRow
                    key={attendance.user.id}
                    className="hover:bg-primary-lighter"
                  >
                    <TableCell className="text-primary-darker">
                      {attendance.user.genId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {attendance.user.name}
                    </TableCell>

                    {/* Radio buttons */}
                    {["PRESENT", "ABSENT", "LATE", "EXCUSED"].map((status) => (
                      <TableCell key={status}>
                        <label
                          htmlFor={`attendance-${attendance.user.id}-${status}`}
                          className="mx-auto cursor-pointer h-5 w-5 bg-background border-2 rounded-full flex justify-center items-center relative"
                        >
                          <input
                            type="radio"
                            id={`attendance-${attendance.user.id}-${status}`}
                            name={`attendance-${attendance.user.id}`}
                            className="hidden peer"
                            value={status}
                            checked={attendance.status === status}
                            onChange={() =>
                              handleAttendanceChange(
                                attendance.user.id,
                                status as
                                  | "PRESENT"
                                  | "ABSENT"
                                  | "LATE"
                                  | "EXCUSED",
                              )
                            }
                          />
                          <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                          <div className="w-3 h-3 bg-primary-darkest scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                        </label>
                      </TableCell>
                    ))}

                    {/* Ô nhập ghi chú */}
                    <TableCell>
                      <input
                        type="text"
                        className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-primary-darker"
                        placeholder="Nhập ghi chú..."
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-primary-darker"
                  >
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
