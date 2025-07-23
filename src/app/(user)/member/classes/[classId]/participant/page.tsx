import ClassMembers from "@/app/ui/components/admin/classes/ClassMembers";
import React from "react";

export default async function Members(props: {
  params: Promise<{
    query?: string;
    currentPage?: number;
    classId: string;
  }>;
}) {
  const params = await props.params;

  const query = params.query || "";
  const currentPage = params.currentPage || 1;
  return (
    <div>
      <div className="mt-2">
        <ClassMembers
          classId={params.classId}
          query={query}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
