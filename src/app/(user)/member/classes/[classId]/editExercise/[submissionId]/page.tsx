"use client";

import EditExercise from "@/app/ui/components/user/student/classes/assignment/EditExercise";
import { useParams } from "next/navigation";

export default function EditExercisePage() {
  const params = useParams();
  const submissionId = params.submissionId as string;

  if (!submissionId) return <div>Không tìm thấy submission</div>;

  return <EditExercise submissionId={submissionId} />;
}
