"use client";

import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/store/store";
import { getListChildClasses } from "@/app/lib/services/childClasses";
import { ChildClass } from "@/app/types";
import { Header } from "./Header";
import { SubjectScoreChart } from "./SubjectScoreChart";
import { ProgressChart } from "./ProgressChart";
import { SkillChart } from "./SkillChart";
import DetailedScoresTable from "./DetailedScoresTable";
import { TeacherComments } from "./TeacherComments";

// Đăng ký các components cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function ParentAcademicResultsView() {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("charts");

  // Get selected child from Redux store
  const selectedChild = useAppSelector((state) => state.children.selectedChild);

  // Fetch child classes using useQuery
  const {
    data: childClassesData,
    isLoading: isLoadingClasses,
    error: classesError,
  } = useQuery({
    queryKey: ["childClasses", selectedChild?.id],
    queryFn: async () => {
      if (!selectedChild?.id) return { content: [] };
      return await getListChildClasses(selectedChild.id, 0, 100, "");
    },
    enabled: !!selectedChild?.id,
  });

  const childClasses = childClassesData?.content || [];

  // Get selected class data
  const selectedClass = childClasses.find(
    (cls: ChildClass) => cls.id === selectedClassId,
  );

  // Format academic year from start and end dates
  const formatAcademicYear = (startDate: string, endDate: string) => {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    return `${startYear}-${endYear}`;
  };

  // Get academic year from selected class
  const academicYear = selectedClass
    ? formatAcademicYear(selectedClass.startDate, selectedClass.endDate)
    : "";

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

  // Thông tin về hạnh kiểm và chuyên cần
  const attendanceData = {
    present: 90,
    late: 5,
    absent: 5,
    behaviorGrade: "Tốt",
  };

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

  // Handle class selection
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
  };

  // Show loading state
  if (isLoadingClasses) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-6 items-center bg-white p-6 rounded-lg border border-primary-light shadow-md">
          <div className="flex-1 min-w-[200px]">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (classesError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            Có lỗi xảy ra khi tải danh sách lớp học. Vui lòng thử lại.
          </p>
        </div>
      </div>
    );
  }

  // Show no child selected state
  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600">
            Vui lòng chọn con để xem kết quả học tập.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bộ lọc lớp học và năm học */}
      <div className="flex flex-wrap gap-6 items-center bg-white p-6 rounded-lg border border-primary-light shadow-md">
        {/* Lớp học */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="class"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Lớp học
          </label>
          <select
            id="class"
            value={selectedClassId}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">Chọn lớp học</option>
            {childClasses.map((cls: ChildClass) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - {cls.course.name} ({cls.grade.name})
              </option>
            ))}
          </select>
        </div>

        {/* Năm học (readonly) */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="academicYear"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Năm học
          </label>
          <input
            id="academicYear"
            type="text"
            value={academicYear}
            readOnly
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            placeholder="Chọn lớp để hiển thị năm học"
          />
        </div>
      </div>

      {/* Show content only if a class is selected */}
      {selectedClass ? (
        <>
          {/* Thông tin chung */}
          <Header
            overallAverage={overallAverage}
            ranking={ranking}
            selectedSemester="HK1"
            selectedYear={academicYear}
            totalSubjects={detailedScores.length}
          />

          {/* Tabs cho biểu đồ và bảng điểm */}
          <Tabs value={activeTab} onTabChange={setActiveTab} className="w-full">
            <TabList className="grid w-full max-w-md grid-cols-3 mx-auto mb-4">
              <Tab label="Biểu đồ" value="charts" />
              <Tab label="Chi tiết" value="details" />
              <Tab label="Nhận xét" value="comments" />
            </TabList>

            <TabPanel value="charts" className="space-y-6">
              {/* Biểu đồ điểm theo môn học */}
              <SubjectScoreChart />

              {/* Biểu đồ tiến độ học tập */}
              <ProgressChart />

              {/* Biểu đồ radar kỹ năng */}
              <SkillChart />
            </TabPanel>

            <TabPanel value="details">
              <DetailedScoresTable
                detailedScores={detailedScores}
                overallAverage={overallAverage}
                ranking={ranking}
                attendanceData={attendanceData}
              />
            </TabPanel>

            <TabPanel value="comments">
              <TeacherComments />
            </TabPanel>
          </Tabs>
        </>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600">
            Vui lòng chọn lớp học để xem kết quả học tập.
          </p>
        </div>
      )}
    </div>
  );
}
