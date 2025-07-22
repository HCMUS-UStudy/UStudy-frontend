"use client";

import { useState } from "react";
import AcademicResults from "@/app/ui/components/admin/academic-results/AcademicResults";
import DetailScoreModal from "@/app/ui/components/admin/academic-results/DetailScoreModal";
import { useQuery } from "@tanstack/react-query";
import { getDetailAcademicResult } from "@/app/lib/services";
import { useParams } from "next/navigation";

export default function AcademicResultsPage() {
  const { classId } = useParams<{ classId: string }>();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const detailQuery = useQuery({
    queryKey: ["detailAcademicResult", classId],
    queryFn: () => getDetailAcademicResult(classId, 0, 100),
    enabled: !!classId,
  });

  const academicResultsData = Array.isArray(detailQuery?.data?.content)
    ? detailQuery.data.content
    : [];

  return (
    <div className="mx-auto p-6 bg-white">
      <div className="flex w-full mb-6 items-center">
        <h2 className="text-2xl font-bold text-primary-dark">
          Kết quả học tập lớp
        </h2>
      </div>

      <AcademicResults
        data={academicResultsData}
        selectedIdx={selectedIdx}
        setSelectedIdx={setSelectedIdx}
      />

      {selectedIdx !== null && academicResultsData[selectedIdx] && (
        <DetailScoreModal
          setSelectedIdx={setSelectedIdx}
          data={academicResultsData[selectedIdx]}
          isLoading={detailQuery.isLoading}
        />
      )}
    </div>
  );
}
