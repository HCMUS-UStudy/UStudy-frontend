import { FaClipboardList } from "react-icons/fa6";

export default function Homework() {
  const homeworkList = [
    {
      id: 1,
      subject: "Toán học",
      icon: <FaClipboardList className="h-5 w-5 text-blue-500" />,
      progress: 80,
    },
    {
      id: 2,
      subject: "Lý học",
      icon: <FaClipboardList className="h-5 w-5 text-green-500" />,
      progress: 60,
    },
    {
      id: 3,
      subject: "Hóa học",
      icon: <FaClipboardList className="h-5 w-5 text-red-500" />,
      progress: 40,
    },
  ];
  return (
    <div className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Bài tập về nhà</h3>
        <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
          Xem thêm
        </button>
      </div>

      <ul className="space-y-4">
        {homeworkList.slice(0, 3).map(
          (
            homework, // Display only the first 3 items
          ) => (
            <li
              key={homework.id}
              className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="text-2xl text-blue-500">{homework.icon}</div>
                <p className="text-lg font-medium text-gray-700 ml-3">
                  {homework.subject}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all duration-300`}
                    style={{
                      width: `${homework.progress}%`,
                      backgroundColor:
                        homework.progress > 50 ? "#4CAF50" : "#FF6F61",
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {homework.progress}%
                </span>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
