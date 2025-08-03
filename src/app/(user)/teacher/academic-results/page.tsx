"use client";

import { useState, useMemo } from "react";
import AcademicResults from "@/app/ui/components/admin/academic-results/AcademicResults";
import DetailScoreModal from "@/app/ui/components/admin/academic-results/DetailScoreModal";
import { useQuery } from "@tanstack/react-query";
import { getDetailAcademicResult } from "@/app/lib/services";
import { getClassesForTeacher } from "@/app/lib/services";
import { AcademicResultManage } from "@/app/types";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";

type TeacherClass = { id: string; name: string };

export default function AcademicResultsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: getClassesForTeacher,
  });
  const classes = useMemo(() => {
    if (!classData) return [];
    return classData.map((c: TeacherClass) => ({ id: c.id, name: c.name }));
  }, [classData]);

  // Auto-select first class when classes loaded and selectedClassId is empty
  if (!selectedClassId && classes.length > 0) {
    setSelectedClassId(classes[0].id);
  }

  // Call getDetailAcademicResult for selected class
  const detailQuery = useQuery({
    queryKey: ["detailAcademicResult", selectedClassId],
    queryFn: () => getDetailAcademicResult(selectedClassId, 0, 100),
    enabled: !!selectedClassId,
  });

  const academicResultsData = Array.isArray(detailQuery?.data?.content)
    ? detailQuery.data.content
    : [];

  return (
    <div className="mx-auto p-6 bg-white">
      <div className="flex w-full mb-6 justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">
          Kết quả học tập lớp
        </h2>

        <Select
          value={selectedClassId}
          defaultValue={selectedClassId}
          onValueChange={(value) => setSelectedClassId(value as string)}
          disabled={classLoading}
          name="select"
          showClearButton={false}
          className="w-[150px]"
        >
          {classes.map((item: TeacherClass) => (
            <SelectItem key={item.id} value={item.id} className="text-gray-800">
              {item.name}
            </SelectItem>
          ))}
        </Select>
        {/* 
        <select
          className="rounded-lg border border-primary-dark px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-dark z-auto text-[15px]"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          disabled={classLoading}
        >
          {classes.map((item: TeacherClass) => (
            <option className="text-gray-800" key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select> */}
      </div>

      <AcademicResults
        data={academicResultsData}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />

      {selectedId !== null && (
        <DetailScoreModal
          setSelectedId={setSelectedId}
          data={academicResultsData.find(
            (item: AcademicResultManage) => item.student?.id === selectedId,
          )}
          isLoading={detailQuery.isLoading}
        />
      )}
    </div>
  );
}
