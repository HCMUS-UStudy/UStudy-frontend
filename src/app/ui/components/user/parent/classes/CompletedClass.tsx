import Link from "next/link";
import { SiGoogleclassroom } from "react-icons/si";
import { BsPerson, BsCalendar, BsPersonWorkspace } from "react-icons/bs";
import { MdMeetingRoom } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa";
import { Card } from "../../../_common/Card";

const completedClasses = [
  {
    id: 4,
    subject: "Toán học nâng cao",
    grade: "Lớp 9",
    teacher: "Lê Văn E",
    completedDate: "20/12/2024",
    room: "P201",
    finalScore: "9.0/10",
  },
  {
    id: 5,
    subject: "Tiếng Anh cơ bản",
    grade: "Lớp 9",
    teacher: "Hoàng Thị F",
    completedDate: "10/12/2024",
    room: "P201",
    finalScore: "8.5/10",
  },
];

export default function CompletedClass() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {completedClasses.map((classItem) => (
        <Card
          key={classItem.id}
          className="overflow-hidden rounded-2xl hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-100 p-6 flex items-center justify-center md:w-1/4">
              <div className="text-center">
                <SiGoogleclassroom
                  size={60}
                  className="mx-auto mb-3 text-gray-600"
                />
                <h3 className="text-xl font-bold text-gray-800">
                  {classItem.subject}
                </h3>
                <p className="text-sm text-gray-500">{classItem.grade}</p>
              </div>
            </div>

            <div className="p-6 flex-1">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Thông tin lớp học
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <BsPerson className="mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Giáo viên:</p>
                      <p className="font-medium text-gray-800">
                        {classItem.teacher}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BsCalendar className="mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày hoàn thành:</p>
                      <p className="font-medium text-gray-800">
                        {classItem.completedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MdMeetingRoom className="mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phòng học:</p>
                      <p className="font-medium text-gray-800">
                        {classItem.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BsPersonWorkspace className="mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Điểm tổng kết:</p>
                      <p className="font-bold text-lg text-green-600">
                        {classItem.finalScore}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                <Link
                  href={`/parent/results?class=${classItem.id}`}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <BsPersonWorkspace className="mr-2" /> Xem kết quả chi tiết
                </Link>
                <Link
                  href={`/parent/contact?teacher=${classItem.teacher}`}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors"
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
