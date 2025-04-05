import MaterialGrid from "@/app/ui/components/user/student/classes/folder/MaterialGrid";
import React from "react";

export default async function ClassContent({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  return <MaterialGrid classId={classId} />;
}
