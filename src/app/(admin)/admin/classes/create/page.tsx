"use server";
import { GradeData } from "@/app/types";
import CreateClass from "@/app/ui/components/admin/classes/create/CreateClass";
import React from "react";

export default async function CreateClassPage() {
  const fetchGrades = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/grade`,
    {
      cache: "no-cache",
    },
  );
  const gradeData: GradeData = await fetchGrades.json();
  return <CreateClass grades={gradeData.content} />;
}
