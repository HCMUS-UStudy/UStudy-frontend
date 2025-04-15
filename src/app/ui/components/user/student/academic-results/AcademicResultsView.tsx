"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
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
import { Header } from "./Header";
import { SubjectScoreChart } from "./SubjectScoreChart";
import { ProgressChart } from "./ProgressChart";
import DetailedScoresTable from "./DetailedScoresTable";

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
      <Header
        overallAverage={overallAverage}
        ranking={ranking}
        selectedSemester={selectedSemester}
        selectedYear={selectedYear}
        totalSubjects={detailedScores.length}
      />

      {/* Bộ lọc học kỳ và năm học */}
      <div className="flex flex-wrap gap-6 items-center bg-white p-6 rounded-lg border border-primary-light shadow-md">
        {/* Học kỳ */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Học kỳ
          </label>
          <select
            id="semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            <option value="HK1">Học kỳ 1</option>
            <option value="HK2">Học kỳ 2</option>
          </select>
        </div>

        {/* Năm học */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Năm học
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
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
          <Tab label="Chi tiết" value="details" />
        </TabList>

        <TabPanel value="charts" className="space-y-6">
          {/* Biểu đồ điểm theo môn học */}
          <SubjectScoreChart />

          {/* Biểu đồ tiến độ học tập */}
          <ProgressChart />
        </TabPanel>

        <TabPanel value="details">
          <DetailedScoresTable
            detailedScores={detailedScores}
            overallAverage={overallAverage}
            ranking={ranking}
          />
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
