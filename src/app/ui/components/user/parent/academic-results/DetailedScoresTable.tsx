"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";

interface Score {
  subject: string;
  midterm: number;
  final: number;
  average: number;
  grade: string;
  teacher: string;
}

interface Ranking {
  label: string;
  color: string;
}

interface AttendanceData {
  present: number;
  late: number;
  absent: number;
  behaviorGrade: string;
}

interface DetailedScoresTableProps {
  detailedScores: Score[];
  overallAverage: number;
  ranking: Ranking;
  attendanceData: AttendanceData;
}

export default function DetailedScoresTable({
  detailedScores,
  overallAverage,
  ranking,
  attendanceData,
}: DetailedScoresTableProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col">
        <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow flex-grow">
          <CardHeader>
            <CardTitle>Chi tiết điểm số</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary-lighter border-b border-primary-light">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Môn học
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Điểm giữa kỳ
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Điểm cuối kỳ
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Điểm TB
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Điểm chữ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Giáo viên
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailedScores.map((score, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 hover:bg-primary-lighter transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {score.subject}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {score.midterm.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {score.final.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-primary-darkest">
                        {score.average.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-primary-darkest">
                        {score.grade}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {score.teacher}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-primary-lighter border-t border-primary-light">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                      Điểm trung bình tổng
                    </td>
                    <td colSpan={2} className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-primary-darkest">
                      {overallAverage.toFixed(1)}
                    </td>
                    <td
                      colSpan={2}
                      className="px-4 py-3 text-center text-sm font-bold text-primary-darkest"
                    >
                      <span className={`font-bold ${ranking.color}`}>
                        {ranking.label}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-6">
        <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow flex-grow">
          <CardHeader>
            <CardTitle>Chuyên cần</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Đi học đầy đủ</span>
                  <span className="text-sm font-medium text-gray-800">
                    {attendanceData.present}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${attendanceData.present}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Đi học muộn</span>
                  <span className="text-sm font-medium text-gray-800">
                    {attendanceData.late}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${attendanceData.late}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Vắng mặt</span>
                  <span className="text-sm font-medium text-gray-800">
                    {attendanceData.absent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${attendanceData.absent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow flex-grow">
          <CardHeader>
            <CardTitle>Kết quả học tập</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-cente">
            <div className="flex items-center justify-center flex-col p-6">
              <div className="text-4xl font-bold text-primary-darkest mb-2">
                {attendanceData.behaviorGrade}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
