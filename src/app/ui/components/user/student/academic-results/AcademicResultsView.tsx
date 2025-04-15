"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { BsCalendar3, BsFileText } from "react-icons/bs";
import { BsGraphUp } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa";

// Đăng ký các components cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function AcademicResultsView() {
  const [selectedSemester, setSelectedSemester] = useState("HK1");
  const [selectedYear, setSelectedYear] = useState("2023-2024");
  const [activeTab, setActiveTab] = useState("charts");

  // Dữ liệu điểm số theo môn học
  const subjectScores = {
    labels: [
      "Toán học",
      "Ngữ văn",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "GDCD",
    ],
    datasets: [
      {
        label: "Điểm của bạn",
        data: [8.5, 7.8, 8.2, 7.5, 8.0, 9.2, 7.6, 8.4, 8.8],
        backgroundColor: "rgba(190, 229, 209, 0.7)",
        borderColor: "rgba(120, 174, 145, 1)",
        borderWidth: 1,
      },
      {
        label: "Điểm trung bình lớp",
        data: [7.8, 7.2, 7.5, 7.0, 7.3, 8.1, 7.0, 7.8, 8.0],
        backgroundColor: "rgba(217, 217, 217, 0.5)",
        borderColor: "rgba(150, 150, 150, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu điểm trung bình theo học kỳ
  const progressData = {
    labels: [
      "HK1 2022-2023",
      "HK2 2022-2023",
      "HK1 2023-2024",
      "HK2 2023-2024",
    ],
    datasets: [
      {
        label: "Điểm trung bình",
        data: [8.1, 8.3, 8.5, 8.7],
        borderColor: "rgba(58, 169, 122, 1)",
        backgroundColor: "rgba(190, 229, 209, 0.2)",
        pointBackgroundColor: "rgba(58, 169, 122, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(58, 169, 122, 1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chi tiết điểm số
  const detailedScores = [
    {
      subject: "Toán học",
      midterm: 8.0,
      final: 9.0,
      average: 8.5,
      grade: "A",
      teacher: "Nguyễn Văn A",
    },
    {
      subject: "Ngữ văn",
      midterm: 7.5,
      final: 8.0,
      average: 7.8,
      grade: "B+",
      teacher: "Trần Thị B",
    },
    {
      subject: "Tiếng Anh",
      midterm: 8.0,
      final: 8.5,
      average: 8.2,
      grade: "A-",
      teacher: "Lê Văn C",
    },
    {
      subject: "Vật lý",
      midterm: 7.0,
      final: 8.0,
      average: 7.5,
      grade: "B",
      teacher: "Phạm Thị D",
    },
    {
      subject: "Hóa học",
      midterm: 7.5,
      final: 8.5,
      average: 8.0,
      grade: "B+",
      teacher: "Võ Văn E",
    },
    {
      subject: "Sinh học",
      midterm: 9.0,
      final: 9.5,
      average: 9.2,
      grade: "A+",
      teacher: "Nguyễn Thị F",
    },
    {
      subject: "Lịch sử",
      midterm: 7.0,
      final: 8.0,
      average: 7.6,
      grade: "B",
      teacher: "Trần Văn G",
    },
    {
      subject: "Địa lý",
      midterm: 8.0,
      final: 8.5,
      average: 8.4,
      grade: "A-",
      teacher: "Lê Thị H",
    },
    {
      subject: "GDCD",
      midterm: 8.5,
      final: 9.0,
      average: 8.8,
      grade: "A",
      teacher: "Phạm Văn I",
    },
  ];

  // Tính điểm trung bình tổng
  const overallAverage =
    detailedScores.reduce((sum, item) => sum + item.average, 0) /
    detailedScores.length;

  // Xếp loại học lực
  const getAcademicRanking = (score: number) => {
    if (score >= 9.0) return { label: "Xuất sắc", color: "text-red-600" };
    if (score >= 8.0) return { label: "Giỏi", color: "text-green-600" };
    if (score >= 7.0) return { label: "Khá", color: "text-blue-600" };
    if (score >= 5.0) return { label: "Trung bình", color: "text-yellow-600" };
    return { label: "Yếu", color: "text-gray-600" };
  };

  const ranking = getAcademicRanking(overallAverage);

  return (
    <div className="space-y-6">
      {/* Thông tin chung */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary-light hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">
              Điểm TB
            </CardTitle>
            <BsGraphUp className="h-5 w-5 text-primary-darker" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-darkest">
              {overallAverage.toFixed(1)}
            </div>
            <p className={`text-sm font-medium ${ranking.color}`}>
              {ranking.label}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary-light hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">
              Xếp hạng
            </CardTitle>
            <FaGraduationCap className="h-5 w-5 text-primary-darker" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-darkest">5/30</div>
            <p className="text-sm font-medium text-gray-600">Trong lớp</p>
          </CardContent>
        </Card>

        <Card className="border-primary-light hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">
              Học kỳ
            </CardTitle>
            <BsCalendar3 className="h-5 w-5 text-primary-darker" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-darkest">
              {selectedSemester}
            </div>
            <p className="text-sm font-medium text-gray-600">{selectedYear}</p>
          </CardContent>
        </Card>

        <Card className="border-primary-light hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">
              Môn học
            </CardTitle>
            <BsFileText className="h-5 w-5 text-primary-darker" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-darkest">
              {detailedScores.length}
            </div>
            <p className="text-sm font-medium text-gray-600">Tổng số môn</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc học kỳ và năm học */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-primary-light shadow-sm">
        <div>
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Học kỳ
          </label>
          <select
            id="semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="HK1">Học kỳ 1</option>
            <option value="HK2">Học kỳ 2</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Năm học
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="2022-2023">2022-2023</option>
            <option value="2023-2024">2023-2024</option>
          </select>
        </div>
      </div>

      {/* Tabs cho biểu đồ và bảng điểm */}
      <Tabs value={activeTab} onTabChange={setActiveTab} className="w-full">
        <TabList className="grid w-full max-w-md grid-cols-2 mx-auto mb-4">
          <Tab label="Biểu đồ" value="charts" />
          <Tab label="Chi tiết điểm số" value="details" />
        </TabList>

        <TabPanel value="charts" className="space-y-6">
          {/* Biểu đồ điểm theo môn học */}
          <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Điểm số theo môn học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar
                  data={subjectScores}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 10,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Biểu đồ tiến độ học tập */}
          <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Tiến độ học tập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line
                  data={progressData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 10,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="details">
          <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
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
        </TabPanel>
      </Tabs>

      {/* Nhận xét của giáo viên */}
      <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Nhận xét của giáo viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-primary-lighter rounded-lg border border-primary-light">
            <p className="text-gray-700 italic">
              &quot;Học sinh có khả năng học tập tốt, đặc biệt trong các môn
              khoa học tự nhiên. Cần cố gắng hơn trong môn Ngữ văn và tích cực
              tham gia các hoạt động nhóm. Tinh thần học tập nghiêm túc, có tiềm
              năng phát triển tốt trong tương lai.&quot;
            </p>
            <div className="mt-3 text-right text-sm text-gray-600">
              <p className="font-medium">Cô Nguyễn Thị Hương</p>
              <p>Giáo viên chủ nhiệm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
