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
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  getChildScores,
  getListChildClasses,
  getChildClassDetails,
} from "@/app/lib/services/childClasses";
import { ChildClass, ChildClassScore, ChildClassDetails } from "@/app/types";
import { Header } from "./Header";
import { SubjectScoreChart } from "./SubjectScoreChart";
import { ProgressChart } from "./ProgressChart";
import { SkillChart } from "./SkillChart";
import DetailedScoresTable from "./DetailedScoresTable";
import { AcademicResultsSkeleton } from "./AcademicResultsSkeleton";
import { MessageCard } from "./MessageCard";
import FullWidthDropdown from "./FullWidthDropdown";

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
  const searchParams = useSearchParams();
  //const router = useRouter();
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("charts");

  // Read class ID from URL query params on component mount
  useEffect(() => {
    const classId = searchParams?.get("class");
    if (classId && classId !== "all") {
      setSelectedClassId(classId);
      // Update URL without triggering a page refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("class", classId);
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  // Get selected child from Redux store
  const selectedChild = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.children.selectedChild,
  );

  // Fetch child scores for charts
  const {
    data: childScores,
    isLoading: isLoadingScores,
    error: scoresError,
  } = useQuery<ChildClassScore[], Error>({
    queryKey: ["childScores", selectedChild?.id],
    queryFn: () => getChildScores(selectedChild!.id),
    enabled: !!selectedChild?.id,
  });

  // Fetch child classes for dropdown
  const {
    data: childClassesData,
    isLoading: isLoadingClasses,
    error: classesError,
  } = useQuery({
    queryKey: ["childClasses", selectedChild?.id],
    queryFn: () => getListChildClasses(selectedChild!.id, 0, 100, ""),
    enabled: !!selectedChild?.id,
  });

  const { data: classDetails, isLoading: isLoadingDetails } = useQuery<
    ChildClassDetails,
    Error
  >({
    queryKey: ["childClassDetails", selectedChild?.id, selectedClassId],
    queryFn: () => getChildClassDetails(selectedChild!.id, selectedClassId),
    enabled: !!selectedChild?.id && selectedClassId !== "all",
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
    if (startYear === endYear) {
      return `${startYear}-${endYear + 1}`;
    }
    return `${startYear}-${endYear}`;
  };

  const academicYear = selectedClass
    ? formatAcademicYear(selectedClass.startDate, selectedClass.endDate)
    : "";

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    // Update URL with the new class ID
    const newUrl = new URL(window.location.href);
    if (classId === "all") {
      newUrl.searchParams.delete("class");
    } else {
      newUrl.searchParams.set("class", classId);
    }
    window.history.pushState({}, "", newUrl.toString());
  };

  if (isLoadingClasses) {
    return <AcademicResultsSkeleton />;
  }

  if (classesError || scoresError) {
    return <div>Error loading data.</div>;
  }

  if (!selectedChild) {
    return <MessageCard message="Vui lòng chọn con để xem kết quả học tập." />;
  }

  const renderCharts = () => {
    if (selectedClassId === "all") {
      if (isLoadingScores) return <AcademicResultsSkeleton />;
      if (!childScores || childScores.length === 0) {
        return <MessageCard message="Chưa có dữ liệu điểm tổng thể." />;
      }
      return (
        <div className="space-y-6">
          <SubjectScoreChart data={childScores} />
          <ProgressChart data={childScores} />
          <SkillChart data={childScores} />
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
              ...childClasses.map((cls: ChildClass) => ({
                key: cls.id,
                label: `${cls.name} - ${cls.course.name} (${cls.grade.name})`,
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
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
