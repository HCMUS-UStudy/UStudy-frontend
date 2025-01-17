"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import ClassList from "@/app/ui/components/user/classes/ClassList";
import { ClassTeacher } from "@/app/types/type";
import { getClassesForTeacher } from "@/app/lib/services/class";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";

export default function Classes() {
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
      <Tabs value="ongoing">
        <TabList>
          <Tab value="ongoing" label="Lớp đang dạy" />
          <Tab value="completed" label="Lớp đã hoàn thành" />
        </TabList>

        <TabPanel value={"ongoing"}>
          <ClassList classes={ongoingClasses} completed={false} />
        </TabPanel>
        <TabPanel value={"completed"}>
          <ClassList classes={completedClasses} completed={true} />
        </TabPanel>
      </Tabs>
    </div>
  );
}
