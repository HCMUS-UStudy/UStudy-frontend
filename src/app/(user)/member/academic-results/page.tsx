import { Metadata } from "next";
import AcademicResultsView from "@/app/ui/components/user/member/academic-results/AcademicResultsView";

export const metadata: Metadata = {
  title: "Kết quả học tập | UStudy",
  description: "Xem kết quả học tập của bạn",
};

export default function AcademicResultsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kết quả học tập</h1>
      <AcademicResultsView />
    </div>
  );
} 