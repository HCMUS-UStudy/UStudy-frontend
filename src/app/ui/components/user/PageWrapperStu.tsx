import { ReactNode } from "react";
import CalendarWidget from "./CalendarWidget";

// Bọc nội dung trang
export default function PageWrapperStu({ children }: { children: ReactNode }) {
  return (
    <div className="ml-from-sidebar bg-background p-[26px] h-[calc(100vh-var(--header-height))] flex">
      {/* Cột nội dung chính */}
      <div className="flex-1 bg-foreground rounded-[22px] pt-9 pb-6 px-8 overflow-y-auto mr-4">
        {children}
      </div>

      {/* Cột lịch và bài tập */}
      <div className="w-[300px] overflow-y-auto bg-white bg-opacity-90 backdrop-blur-md border-gray-200 p-6 rounded-[22px] flex-shrink-0">
        {/* Calendar Section */}
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800 text-center md:text-left">
          Lịch cá nhân
        </h3>
        <CalendarWidget />

        {/* Danh sách bài tập gần đây */}
        <div>
          <h3 className="text-2xl font-extrabold mb-4 text-gray-800 text-center md:text-left">
            Bài tập gần đây
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài tập toán ngày mai</p>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài tập lý cuối tuần</p>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài kiểm tra hóa học</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
