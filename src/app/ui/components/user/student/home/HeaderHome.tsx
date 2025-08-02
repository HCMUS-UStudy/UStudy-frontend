import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { FaBook } from "react-icons/fa6";
import { FaQuestionCircle, FaTasks } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getStudentClassCount } from "@/app/lib/services/class";
import { getAssignmentCount } from "@/app/lib/services/assignment";
import { StudentClassCount } from "@/app/types/class";
import { AssignmentCount } from "@/app/types/assignment";

export default function HeaderHome() {
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<StudentClassCount | null>(null);
  const [practiceData, setPracticeData] = useState<AssignmentCount | null>(
    null,
  );
  const [testData, setTestData] = useState<AssignmentCount | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classResponse, practiceResponse, testResponse] =
          await Promise.all([
            getStudentClassCount(),
            getAssignmentCount("PRACTICE"),
            getAssignmentCount("TEST"),
          ]);

        setClassData(classResponse);
        setPracticeData(practiceResponse);
        setTestData(testResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
      {/* Tổng số lớp học */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-xl border hover:shadow-lg transition-all duration-300 p-2 bg-white hover:bg-blue-50 hover:border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <FaBook className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Tổng số lớp học
                </CardTitle>
                <p className="text-xs text-gray-500">
                  Theo dõi tiến độ học tập
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900 flex items-center">
                {classData?.totalClasses || 0}
              </div>

              <div className="flex items-center text-xs">
                <div className="flex flex-col items-end">
                  <span className="text-gray-500">Đang tham gia</span>
                  <span className="font-semibold text-gray-700">
                    {classData?.inProgressClasses || 0} lớp
                  </span>
                </div>
              </div>
            </div>

            {/* Tiến độ */}
            <div className="mt-1.5 mb-1.5">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-medium text-gray-700">
                  Tiến độ học tập
                </span>
                <span className="text-xs font-medium text-blue-700">
                  {classData
                    ? Math.round(
                        (classData.inProgressClasses / classData.totalClasses) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{
                    width: `${classData ? (classData.inProgressClasses / classData.totalClasses) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Thêm nút xem chi tiết */}
            {/* <div className="mt-1.5 flex justify-end items-end text-xs border-t border-gray-100 pt-1.5">
              <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center bg-blue-50 px-1.5 py-0.5 rounded hover:bg-blue-100">
                Chi tiết
                <FaChevronRight className="ml-1 h-2 w-2" />
              </button>
            </div> */}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tổng số bài tập thực hành */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="rounded-xl border hover:shadow-lg transition-all duration-300 p-2 bg-white hover:bg-green-50 hover:border-green-200">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <div className="p-1 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                <FaTasks className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Bài luyện tập
                </CardTitle>
                <p className="text-xs text-gray-500">Theo dõi bài luyện tập</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900 flex items-center">
                {practiceData?.total || 0}
              </div>

              <div className="flex gap-1 text-xs">
                <div className="px-1 py-0.5 bg-red-50 rounded-md">
                  <span className="font-semibold text-red-600">
                    {practiceData?.overdue || 0} quá hạn
                  </span>
                </div>
                <div className="px-1 py-0.5 bg-green-50 rounded-md">
                  <span className="font-semibold text-green-600">
                    {practiceData?.submitted || 0} đã nộp
                  </span>
                </div>
              </div>
            </div>

            {/* Trạng thái hoàn thành */}
            <div className="mt-1.5 mb-1.5">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-medium text-gray-700">
                  Đã hoàn thành
                </span>
                <span className="text-xs font-medium text-green-700">
                  {practiceData
                    ? `${practiceData.submitted}/${practiceData.total}`
                    : "0/0"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-green-600 h-1 rounded-full"
                  style={{
                    width: `${practiceData ? (practiceData.submitted / practiceData.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="mt-1.5 flex justify-end items-end text-xs border-t border-gray-100 pt-1.5">
              <button className="text-green-600 hover:text-green-800 transition-colors flex items-center bg-green-50 px-1.5 py-0.5 rounded hover:bg-green-100">
                Xem tất cả
                <FaChevronRight className="ml-1 h-2 w-2" />
              </button>
            </div> */}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tổng số bài kiểm tra */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="rounded-xl border hover:shadow-lg transition-all duration-300 p-2 bg-white hover:bg-red-50 hover:border-red-200">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <div className="p-1 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <FaQuestionCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Bài kiểm tra
                </CardTitle>
                <p className="text-xs text-gray-500">Theo dõi bài kiểm tra</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900 flex items-center">
                {testData?.total || 0}
              </div>

              <div className="flex items-center gap-1 text-xs">
                <div className="px-1 py-0.5 bg-red-50 rounded-md">
                  <span className="font-semibold text-red-600">
                    {testData?.overdue || 0} quá hạn
                  </span>
                </div>
                <div className="px-1 py-0.5 bg-green-50 rounded-md">
                  <span className="font-semibold text-green-600">
                    {testData?.submitted || 0} đã làm
                  </span>
                </div>
              </div>
            </div>

            {/* Tiến độ */}
            <div className="mt-1.5 mb-1.5">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-medium text-gray-700">
                  Đã hoàn thành
                </span>
                <span className="text-xs font-medium text-red-700">
                  {testData ? `${testData.submitted}/${testData.total}` : "0/0"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-red-600 h-1 rounded-full"
                  style={{
                    width: `${testData ? (testData.submitted / testData.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="mt-1.5 flex justify-end items-end text-xs border-t border-gray-100 pt-1.5">
              <button className="text-red-600 hover:text-red-800 transition-colors flex items-center bg-red-50 px-1.5 py-0.5 rounded hover:bg-red-100">
                Làm ngay
                <FaChevronRight className="ml-1 h-2 w-2" />
              </button>
            </div> */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
