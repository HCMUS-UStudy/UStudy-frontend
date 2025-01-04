"use client";
import { getClassById } from "@/app/lib/api";
import React, { useEffect } from "react";

export default function UserManagement({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = React.use(params);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchStudents = await getClassById(classId);
        console.log(fetchStudents);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [classId]);
  return <div>UserManagement</div>;
}
