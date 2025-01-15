import React from "react";
import ClassCard from "./ClassCard";

import { ClassTeacher } from "@/app/types/type";

export default function ClassList({
  classes,
  completed,
}: {
  classes: ClassTeacher[];
  completed: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((cls) => (
        <ClassCard key={cls.id} cls={cls} completed={completed} />
      ))}
    </div>
  );
}
