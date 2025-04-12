import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { FaBook } from "react-icons/fa6";
import { FaQuestionCircle, FaTasks } from "react-icons/fa";

export default function HeaderHome() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Tổng số lớp học */}
      <Card className="rounded-lg border hover:shadow-md transition-shadow p-4 bg-white">
        <CardHeader className="flex flex-row items-center justify-between p-2 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Tổng số lớp học
          </CardTitle>
          <FaBook className="h-6 w-6 text-gray-600" />
        </CardHeader>
        <CardContent className="p-2">
          <div className="text-3xl font-bold text-gray-900 flex items-center">
            {20}
            <span className="ml-3 text-sm text-blue-600 bg-blue-100 border border-blue-600 rounded-full px-2 py-0.5">
              +8.00%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tổng số bài tập */}
      <Card className="rounded-lg border hover:shadow-md transition-shadow p-4 bg-white">
        <CardHeader className="flex flex-row items-center justify-between p-2 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Tổng số bài tập
          </CardTitle>
          <FaTasks className="h-6 w-6 text-gray-600" />
        </CardHeader>
        <CardContent className="p-2">
          <div className="text-3xl font-bold text-gray-900 flex items-center">
            {50}
            <span className="ml-3 text-sm text-green-600 bg-green-100 border border-green-600 rounded-full px-2 py-0.5">
              +10.00%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tổng số trắc nghiệm */}
      <Card className="rounded-lg border hover:shadow-md transition-shadow p-4 bg-white">
        <CardHeader className="flex flex-row items-center justify-between p-2 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Trắc nghiệm
          </CardTitle>
          <FaQuestionCircle className="h-6 w-6 text-gray-600" />
        </CardHeader>
        <CardContent className="p-2">
          <div className="text-3xl font-bold text-gray-900 flex items-center">
            {30}
            <span className="ml-3 text-sm text-red-600 bg-red-100 border border-red-600 rounded-full px-2 py-0.5">
              +7.00%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
