import Link from "next/link";
import { SiGoogleclassroom } from "react-icons/si";
import {
  BsPerson,
  BsCalendar,
  BsBook,
  BsPersonWorkspace,
} from "react-icons/bs";
import { MdMeetingRoom, MdOutlineAssignment } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa";
import { Card } from "../../../_common/Card";

interface ClassItem {
  id: number;
  subject: string;
  grade: string;
  teacher: string;
  schedule: string;
  progress: number;
  room: string;
}

const currentClasses: ClassItem[] = [
  {
    id: 1,
    subject: "Toán học",
    grade: "Lớp 10",
    teacher: "Nguyễn Văn A",
    schedule: "Thứ 2, 4, 6 (17:30 - 19:00)",
    progress: 70,
    room: "P201",
  },
  {
    id: 2,
    subject: "Vật lý",
    grade: "Lớp 10",
    teacher: "Trần Văn C",
    schedule: "Thứ 3, 5, 7 (19:30 - 21:00)",
    progress: 60,
    room: "P201",
  },
  {
    id: 3,
    subject: "Hóa học",
    grade: "Lớp 10",
    teacher: "Phạm Thị D",
    schedule: "Thứ 2, 4, 6 (19:30 - 21:00)",
    progress: 80,
    room: "P201",
  },
];

export default function CurrentClass() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {currentClasses.map((classItem) => (
        <Card
          key={classItem.id}
          className="overflow-hidden rounded-2xl hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row">
            <div className="bg-primary/10 p-6 flex items-center justify-center md:w-1/4">
              <div className="text-center">
                <SiGoogleclassroom
                  size={64}
                  className="mx-auto mb-3 text-primary"
                />
                <h3 className="text-xl font-semibold">{classItem.subject}</h3>
                <p className="text-sm text-gray-600 mt-1">{classItem.grade}</p>
              </div>
            </div>

            <div className="p-6 flex-1">
              {/* Class Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Thông tin lớp học
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <BsPerson className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Giáo viên:</p>
                      <p className="font-medium text-gray-900">
                        {classItem.teacher}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BsCalendar className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Lịch học:</p>
                      <p className="font-medium text-gray-900">
                        {classItem.schedule}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdMeetingRoom className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Phòng học:</p>
                      <p className="font-medium text-gray-900">
                        {classItem.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BsBook className="text-gray-500" size={20} />
                    <div className="max-w-[200px] w-full">
                      <p className="text-sm text-gray-600">Tiến độ:</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${classItem.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                <Link
                  href={`/parent/assignments?class=${classItem.id}`}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <MdOutlineAssignment className="mr-2" /> Bài tập
                </Link>
                <Link
                  href={`/parent/results?class=${classItem.id}`}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <BsPersonWorkspace className="mr-2" /> Kết quả học tập
                </Link>
                <Link
                  href={`/parent/contact?teacher=${classItem.teacher}`}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <FaRegCommentDots className="mr-2" /> Liên hệ giáo viên
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
