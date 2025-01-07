"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import TabSelector from "@/app/ui/components/Teacher-Classes/TabSelector";
import ClassList from "@/app/ui/components/Teacher-Classes/ClassList";
import { ClassTeacher } from "@/app/types/type";
import { getAllClasses, getClassesForTeacher } from "@/app/lib/services/class";

export default function Classes() {
  const [activeTab, setActiveTab] = useState<string>("ongoing");
  const [ongoingClasses, setOngoingClasses] = useState<ClassTeacher[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassTeacher[]>([]);

  const dispatch = useDispatch();
  // const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getClassesForTeacher();

        const ongoingMapped = classes.filter(
          (cls: ClassTeacher) => cls.status === "PROGRESS",
        );
        const completedMapped = classes.filter(
          (cls: ClassTeacher) => cls.status === "COMPLETED",
        );

        setOngoingClasses(ongoingMapped);
        setCompletedClasses(completedMapped);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách lớp học</h1>
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="transition-transform duration-500 ease-in-out">
        {activeTab === "ongoing" ? (
          <ClassList classes={ongoingClasses} completed={false} />
        ) : (
          <ClassList classes={completedClasses} completed={true} />
        )}
      </div>
    </div>
  );
}
