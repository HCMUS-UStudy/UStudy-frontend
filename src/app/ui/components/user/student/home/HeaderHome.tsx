"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { FaBook } from "react-icons/fa6";
import { FaQuestionCircle, FaTasks, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HeaderHome() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {/* Tổng số lớp học */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-lg border hover:shadow-lg transition-all duration-300 p-3 bg-white hover:bg-blue-50 hover:border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between p-1 pb-2 rounded-t-lg">
            <CardTitle className="text-base font-semibold text-gray-800">
              Tổng số lớp học
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-100">
              <FaBook className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                {20}
                <span className="ml-2 text-xs text-blue-600 bg-blue-100 border border-blue-600 rounded-full px-2 py-0.5">
                  +8.00%
                </span>
              </div>

              <div className="flex items-center text-xs">
                <div className="flex flex-col items-end">
                  <span className="text-gray-500">Đang tham gia</span>
                  <span className="font-semibold text-gray-700">12 lớp</span>
                </div>
              </div>
            </div>

            {/* Tiến độ */}
            <div className="mt-2 mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Tiến độ học tập
                </span>
                <span className="text-xs font-medium text-blue-700">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>

            {/* Thêm nút xem chi tiết */}
            <div className="mt-2 flex justify-between items-center text-xs border-t border-gray-100 pt-2">
              <span className="text-gray-500">
                Sắp diễn ra: <span className="font-semibold">8 lớp</span>
              </span>
              <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                Chi tiết
                <FaChevronRight className="ml-1 h-2 w-2" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tổng số bài tập */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="rounded-lg border hover:shadow-lg transition-all duration-300 p-3 bg-white hover:bg-green-50 hover:border-green-200">
          <CardHeader className="flex flex-row items-center justify-between p-1 pb-2 rounded-t-lg">
            <CardTitle className="text-base font-semibold text-gray-800">
              Tổng số bài tập
            </CardTitle>
            <div className="p-2 rounded-full bg-green-100">
              <FaTasks className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                {50}
                <span className="ml-2 text-xs text-green-600 bg-green-100 border border-green-600 rounded-full px-2 py-0.5">
                  +10.00%
                </span>
              </div>

              <div className="flex gap-2 text-xs">
                <div className="px-1.5 py-0.5 bg-red-50 rounded-md">
                  <span className="font-semibold text-red-600">8 cần nộp</span>
                </div>
                <div className="px-1.5 py-0.5 bg-green-50 rounded-md">
                  <span className="font-semibold text-green-600">
                    32 đã nộp
                  </span>
                </div>
              </div>
            </div>

            {/* Trạng thái hoàn thành */}
            <div className="mt-2 mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Đã hoàn thành
                </span>
                <span className="text-xs font-medium text-green-700">
                  32/50
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-600 h-1.5 rounded-full"
                  style={{ width: "64%" }}
                ></div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-2 flex justify-between items-center text-xs border-t border-gray-100 pt-2">
              <span className="text-gray-500">10 bài mới trong tuần</span>
              <button className="text-green-600 hover:text-green-800 transition-colors flex items-center">
                Xem tất cả
                <FaChevronRight className="ml-1 h-2 w-2" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tổng số trắc nghiệm */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="rounded-lg border hover:shadow-lg transition-all duration-300 p-3 bg-white hover:bg-red-50 hover:border-red-200">
          <CardHeader className="flex flex-row items-center justify-between p-1 pb-2 rounded-t-lg">
            <CardTitle className="text-base font-semibold text-gray-800">
              Trắc nghiệm
            </CardTitle>
            <div className="p-2 rounded-full bg-red-100">
              <FaQuestionCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                {30}
                <span className="ml-2 text-xs text-red-600 bg-red-100 border border-red-600 rounded-full px-2 py-0.5">
                  +7.00%
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-gray-50 rounded-md px-1.5 py-0.5">
                  <span className="font-semibold text-red-600">7.8</span>
                  <span className="text-gray-500">TB</span>
                </div>
                <div className="flex items-center gap-1 bg-red-50 rounded-md px-1.5 py-0.5">
                  <span className="font-semibold text-red-600">9.5</span>
                  <span className="text-gray-500">Max</span>
                </div>
              </div>
            </div>

            {/* Tiến độ */}
            <div className="mt-2 mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Hoàn thành
                </span>
                <span className="text-xs font-medium text-red-700">18/30</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-red-600 h-1.5 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-2 flex justify-between items-center text-xs border-t border-gray-100 pt-2">
              <span className="text-gray-500">5 trắc nghiệm sắp đến hạn</span>
              <button className="text-red-600 hover:text-red-800 transition-colors flex items-center">
                Làm ngay
                <FaChevronRight className="ml-1 h-2 w-2" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
