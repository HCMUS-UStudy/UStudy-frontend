import { FaArrowRight, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Schedule() {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

  const scheduleData = [
    {
      subject: "Toán học",
      grade: "Lớp 10",
      date: "2024-11-26",
      time: "08:00 - 10:00",
      teacher: "Nguyễn Văn A",
      location: "Phòng 101",
      status: "upcoming", // upcoming, ongoing, completed
      detail: "Ôn tập chương 3: Đạo hàm và ứng dụng"
    },
    {
      subject: "Vật lý",
      grade: "Lớp 10",
      date: "2024-11-27",
      time: "10:30 - 12:00",
      teacher: "Trần Thị B",
      location: "Phòng 203",
      status: "upcoming",
      detail: "Bài tập chương: Dao động cơ học"
    },
    {
      subject: "Hóa học",
      grade: "Lớp 11",
      date: "2024-11-28",
      time: "14:00 - 16:00",
      teacher: "Lê Văn C",
      location: "Phòng thí nghiệm",
      status: "upcoming",
      detail: "Thực hành: Phản ứng oxi hóa - khử"
    },
    {
      subject: "Sinh học",
      grade: "Lớp 11",
      date: "2024-11-29",
      time: "16:30 - 18:00",
      teacher: "Phạm Thị D",
      location: "Phòng 305",
      status: "upcoming",
      detail: "Hệ sinh thái và môi trường"
    },
  ];

  // Tóm tắt lịch học theo tuần
  const weeklySummary = [
    { day: "Thứ 2", count: 3 },
    { day: "Thứ 3", count: 2 },
    { day: "Thứ 4", count: 4 },
    { day: "Thứ 5", count: 2 },
    { day: "Thứ 6", count: 3 },
    { day: "Thứ 7", count: 1 },
    { day: "CN", count: 0 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow mt-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">Lịch học</h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div className="flex items-center mt-3 sm:mt-0">
          <div className="mr-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-1">
              15
            </span>
            <span className="text-sm text-gray-600">lớp trong tuần</span>
          </div>
          <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center">
            Xem tất cả
            <FaArrowRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Tóm tắt theo ngày trong tuần */}
      <div className="grid grid-cols-7 gap-2 mb-6 bg-gray-50 p-3 rounded-lg">
        {weeklySummary.map((day, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center justify-center p-2 rounded-md ${index === 2 ? 'bg-blue-100 border border-blue-200' : ''}`}
          >
            <span className={`text-sm font-medium ${index === 2 ? 'text-blue-800' : 'text-gray-500'}`}>{day.day}</span>
            <span className={`text-xl font-bold ${index === 2 ? 'text-blue-800' : 'text-gray-700'}`}>{day.count}</span>
            <span className="text-xs text-gray-400">lớp</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {scheduleData.map((schedule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.01 }}
            className="flex flex-col sm:flex-row p-4 border rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex items-start flex-1 mb-3 sm:mb-0">
              {/* Màu sắc theo môn học */}
              <div className={`w-2 h-full self-stretch rounded-l-lg mr-3 ${
                schedule.subject.includes("Toán") ? "bg-blue-500" :
                schedule.subject.includes("Lý") ? "bg-purple-500" :
                schedule.subject.includes("Hóa") ? "bg-green-500" : 
                "bg-red-500"
              }`}></div>
              
              <div className="flex flex-col w-full space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-800 mr-2">
                      {schedule.subject}
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                      {schedule.grade}
                    </span>
                  </div>
                  
                  <div className="sm:hidden flex items-center gap-1 ml-auto">
                    <FaClock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-800">
                      {schedule.time}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 sm:pr-2">{schedule.detail}</p>
                
                <div className="flex flex-wrap justify-between items-center mt-1">
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                    <div className="flex items-center">
                      <FaUser className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-600">{schedule.teacher}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-600">{schedule.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:mt-0 flex items-center sm:hidden">
                    <FaCalendarAlt className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-600">
                      {schedule.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col justify-between text-right sm:min-w-[130px] sm:border-l sm:border-gray-200 sm:pl-4 sm:ml-2">
              <div>
                <div className="flex items-center justify-end">
                  <FaCalendarAlt className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {schedule.date}
                  </span>
                </div>
                <div className="flex items-center justify-end mt-1">
                  <FaClock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-sm font-semibold text-gray-800">
                    {schedule.time}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center transition-all duration-200 px-2 py-1 hover:bg-blue-100 rounded">
                  Chi tiết <FaArrowRight className="ml-1 h-2 w-2" />
                </button>
              </div>
            </div>

            <div className="sm:hidden flex justify-end mt-2 pt-2 border-t border-gray-200 w-full">
              <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center transition-all duration-200 px-2 py-1 hover:bg-blue-100 rounded">
                Chi tiết <FaArrowRight className="ml-1 h-2 w-2" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Thêm nút để xem lịch học trên lịch  */}
      <div className="mt-6 flex justify-center">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
          <FaCalendarAlt className="mr-2" />
          Xem trên lịch tháng
        </button>
      </div>
    </motion.div>
  );
}
