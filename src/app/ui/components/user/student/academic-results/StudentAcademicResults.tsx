import { Metadata } from "next";
import AcademicResultsView from "@/app/ui/components/user/student/academic-results/AcademicResultsView";

export const metadata: Metadata = {
  title: "Kết quả học tập | UStudy",
  description: "Xem kết quả học tập của bạn",
};

export default function StudentAcademicResults() {
  return (
    <div className="px-2">
      <AcademicResultsView />
    </div>
  );
}
