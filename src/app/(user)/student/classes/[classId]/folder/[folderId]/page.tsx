import MaterialGrid from "@/app/ui/components/user/student/classes/folder/MaterialGrid";
import React from "react";

export default async function FolderDetail(props: {
  params?: Promise<{
    classId?: string;
    folderId?: string;
  }>;
}) {
  const params = await props.params;
  const classId = params?.classId || "";
  const folderId = params?.folderId || "";

  return <MaterialGrid classId={classId} folderId={folderId} />;
}
