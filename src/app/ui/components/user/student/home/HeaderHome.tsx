import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { FaBook } from "react-icons/fa6";
import { FaQuestionCircle, FaTasks, FaChevronRight } from "react-icons/fa";
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
            <div className="mt-2 mb-2">
              <div className="flex justify-between items-center mb-1">
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
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{
                    width: `${classData ? (classData.inProgressClasses / classData.totalClasses) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Thêm nút xem chi tiết */}
            <div className="mt-2 flex justify-end items-end text-xs border-t border-gray-100 pt-2">
              <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                Chi tiết
                <FaChevronRight className="ml-1 h-2 w-2" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tổng số bài tập thực hành */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="rounded-lg border hover:shadow-lg transition-all duration-300 p-3 bg-white hover:bg-green-50 hover:border-green-200">
          <CardHeader className="flex flex-row items-center justify-between p-1 pb-2 rounded-t-lg">
            <CardTitle className="text-base font-semibold text-gray-800">
              Bài tập thực hành
            </CardTitle>
            <div className="p-2 rounded-full bg-green-100">
              <FaTasks className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                {practiceData?.total || 0}
              </div>

              <div className="flex gap-2 text-xs">
                <div className="px-1.5 py-0.5 bg-red-50 rounded-md">
                  <span className="font-semibold text-red-600">
                    {practiceData?.overdue || 0} cần nộp
                  </span>
                </div>
                <div className="px-1.5 py-0.5 bg-green-50 rounded-md">
                  <span className="font-semibold text-green-600">
                    {practiceData?.submitted || 0} đã nộp
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
                  {practiceData
                    ? `${practiceData.submitted}/${practiceData.total}`
                    : "0/0"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-600 h-1.5 rounded-full"
                  style={{
                    width: `${practiceData ? (practiceData.submitted / practiceData.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-2 flex justify-end items-end text-xs border-t border-gray-100 pt-2">
              <button className="text-green-600 hover:text-green-800 transition-colors flex items-center">
                Xem tất cả
                <FaChevronRight className="ml-1 h-2 w-2" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tổng số bài kiểm tra */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="rounded-lg border hover:shadow-lg transition-all duration-300 p-3 bg-white hover:bg-red-50 hover:border-red-200">
          <CardHeader className="flex flex-row items-center justify-between p-1 pb-2 rounded-t-lg">
            <CardTitle className="text-base font-semibold text-gray-800">
              Bài kiểm tra
            </CardTitle>
            <div className="p-2 rounded-full bg-red-100">
              <FaQuestionCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                {testData?.total || 0}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="px-1.5 py-0.5 bg-red-50 rounded-md">
                  <span className="font-semibold text-red-600">
                    {testData?.overdue || 0} cần làm
                  </span>
                </div>
                <div className="px-1.5 py-0.5 bg-green-50 rounded-md">
                  <span className="font-semibold text-green-600">
                    {testData?.submitted || 0} đã làm
                  </span>
                </div>
              </div>
            </div>

            {/* Tiến độ */}
            <div className="mt-2 mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Hoàn thành
                </span>
                <span className="text-xs font-medium text-red-700">
                  {testData ? `${testData.submitted}/${testData.total}` : "0/0"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-red-600 h-1.5 rounded-full"
                  style={{
                    width: `${testData ? (testData.submitted / testData.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-2 flex justify-end items-end text-xs border-t border-gray-100 pt-2">
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
