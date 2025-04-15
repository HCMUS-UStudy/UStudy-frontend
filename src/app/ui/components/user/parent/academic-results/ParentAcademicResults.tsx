import { Metadata } from "next";
import ParentAcademicResultsView from "@/app/ui/components/user/parent/academic-results/ParentAcademicResultsView";

export const metadata: Metadata = {
  title: "Kết quả học tập của con | UStudy",
  description: "Xem kết quả học tập của con bạn",
};

export default function ParentAcademicResults() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Kết quả học tập của con
      </h1>
      <ParentAcademicResultsView />
    </div>
  );
}
