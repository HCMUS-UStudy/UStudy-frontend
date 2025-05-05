"use client";

import ReviewAssignment from "@/app/ui/components/user/student/classes/assignment/ReviewAssignment";
import { useParams } from "next/navigation";

export default function ReviewAssignmentPage() {
  const params = useParams();
  const submissionId = params.submissionId as string;

  if (!submissionId) return <div>Không tìm thấy submission</div>;

  return <ReviewAssignment submissionId={submissionId} />;
}
