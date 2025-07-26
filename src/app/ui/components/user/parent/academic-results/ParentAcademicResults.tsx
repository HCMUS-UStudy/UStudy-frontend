"use client";

import ParentAcademicResultsView from "@/app/ui/components/user/parent/academic-results/ParentAcademicResultsView";

export const metadata = {
  title: "Kết quả học tập của con | UStudy",
  description: "Xem kết quả học tập của con bạn",
};

export default function ParentAcademicResults() {
  return (
    <div className="px-2">
      <ParentAcademicResultsView />
    </div>
  );
}
