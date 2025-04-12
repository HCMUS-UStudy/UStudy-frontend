import { FaArrowRight } from "react-icons/fa6";

export default function Schedule() {
  const scheduleData = [
    {
      subject: "Toán học",
      grade: "Lớp 10",
      date: "2024-11-26",
      time: "08:00 - 10:00",
    },
    {
      subject: "Vật lý",
      grade: "Lớp 10",
      date: "2024-11-27",
      time: "10:30 - 12:00",
    },
    {
      subject: "Hóa học",
      grade: "Lớp 11",
      date: "2024-11-28",
      time: "14:00 - 16:00",
    },
    {
      subject: "Sinh học",
      grade: "Lớp 11",
      date: "2024-11-29",
      time: "16:30 - 18:00",
    },
    // Thêm các môn học khác vào đây
  ];
  return (
    <div className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Xem lịch học</h3>
        <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
          Xem thêm
        </button>
      </div>

      <div className="space-y-4">
        {scheduleData.map((schedule, index) => (
          <div
            key={index}
            className="flex justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300 shadow-md"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-lg font-semibold text-gray-800">
                {schedule.subject}
              </span>
              <span className="text-sm text-gray-600">{schedule.grade}</span>
            </div>

            <div className="text-right space-y-1">
              <span className="text-sm text-gray-500 mr-4">
                {schedule.date}
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {schedule.time}
              </span>
              <div className="flex justify-end">
                {" "}
                <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center transition-all duration-200">
                  Chi tiết <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
