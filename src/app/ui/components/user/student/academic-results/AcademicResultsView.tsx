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
import {
  getAllClassScores,
  getClassScoreDetail,
} from "@/app/lib/services/class";
import { ClassScore, ClassScoreDetail } from "@/app/types/class";
import { Header } from "@/app/ui/components/user/student/academic-results/Header";
import { SubjectScoreChart } from "./SubjectScoreChart";
import { ProgressChart } from "./ProgressChart";
import { SkillChart } from "./SkillChart";
import DetailedScoresTable from "./DetailedScoresTable";
import { AcademicResultsSkeleton } from "./AcademicResultsSkeleton";
import { MessageCard } from "./MessageCard";
import FullWidthDropdown from "./FullWidthDropdown";

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

export default function AcademicResultsView() {
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("charts");

  // Lấy điểm tổng thể tất cả các lớp
  const {
    data: allScores,
    isLoading: isLoadingScores,
    error: scoresError,
  } = useQuery<ClassScore[], Error>({
    queryKey: ["allClassScores"],
    queryFn: getAllClassScores,
  });

  // Lấy danh sách lớp từ allScores
  const classList = allScores || [];

  // Lấy chi tiết điểm lớp khi chọn 1 lớp cụ thể
  const {
    data: classDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useQuery<ClassScoreDetail, Error>({
    queryKey: ["classScoreDetail", selectedClassId],
    queryFn: () => getClassScoreDetail(selectedClassId),
    enabled: selectedClassId !== "all",
  });

  // Lấy năm học từ classDetails
  const academicYear = classDetails?.startDate
    ? new Date(classDetails.startDate).getFullYear() +
      "-" +
      (new Date(classDetails.startDate).getFullYear() + 1)
    : "";

  const handleClassChange = (classId: string) => setSelectedClassId(classId);

  if (isLoadingScores) {
    return <AcademicResultsSkeleton />;
  }
  if (scoresError || detailsError) {
    return <MessageCard message="Lỗi khi tải dữ liệu." />;
  }
  if (!allScores || allScores.length === 0) {
    return <MessageCard message="Chưa có dữ liệu điểm tổng thể." />;
  }

  const renderCharts = () => {
    if (selectedClassId === "all") {
      return (
        <div className="space-y-6">
          <SubjectScoreChart data={allScores} />
          <ProgressChart data={allScores} />
          <SkillChart data={allScores} />
        </div>
      );
    }
    if (isLoadingDetails) return <AcademicResultsSkeleton />;
    if (!classDetails) {
      return (
        <MessageCard message="Không có dữ liệu cho lớp học này. Vui lòng chọn lớp khác." />
      );
    }
    return <SubjectScoreChart data={classDetails} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 items-center bg-white p-6 rounded-lg border border-primary-light shadow-md">
        <div
          className={
            selectedClassId === "all" ? "w-full" : "flex-1 min-w-[200px]"
          }
        >
          <label
            htmlFor="class"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Lớp học
          </label>
          <FullWidthDropdown
            label="Lớp học"
            items={[
              { key: "all", label: "Tất cả" },
              ...classList.map((cls) => ({
                key: cls.classId,
                label: `${cls.className} - ${cls.course.name} (${cls.grade.name})`,
              })),
            ]}
            selected={selectedClassId}
            position="bottom-left"
            onChange={handleClassChange}
          />
        </div>
        {selectedClassId !== "all" && (
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
              className="w-full border border-primary-light focus:outline-primary-dark rounded-md px-4 py-2 bg-gray-50"
            />
          </div>
        )}
      </div>

      {selectedClassId !== "all" && classDetails && (
        <Header details={classDetails} />
      )}

      <Tabs value={activeTab} onTabChange={setActiveTab} className="w-full">
        <TabList className="grid w-full max-w-md grid-cols-2 mx-auto mb-4">
          <Tab label="Biểu đồ" value="charts" />
          <Tab label="Chi tiết" value="details" />
        </TabList>
        <TabPanel value="charts" className="space-y-6">
          {renderCharts()}
        </TabPanel>
        <TabPanel value="details">
          {selectedClassId !== "all" ? (
            isLoadingDetails ? (
              <AcademicResultsSkeleton />
            ) : classDetails ? (
              <DetailedScoresTable details={classDetails} />
            ) : (
              <MessageCard message="Không có dữ liệu cho lớp học này." />
            )
          ) : (
            <MessageCard message="Vui lòng chọn một lớp học cụ thể để xem chi tiết." />
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
}
