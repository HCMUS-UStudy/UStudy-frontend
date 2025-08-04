import React from "react";
import ClassCard from "./ClassCard";

import { ClassTeacher } from "@/app/types";

export default function ClassList({
  classes,
  status,
}: {
  classes: ClassTeacher[];
  status?: "OPEN" | "PROGRESS" | "COMPLETED";
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
      {classes.map((cls) => (
        <ClassCard key={cls.id} cls={cls} status={status} />
      ))}
    </div>
  );
}
