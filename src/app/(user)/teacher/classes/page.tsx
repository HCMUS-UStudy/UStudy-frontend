"use client";

import React, { useState, useEffect } from "react";
// import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import ClassList from "@/app/ui/components/user/teacher/ClassList";
import { ClassTeacher } from "@/app/types";
import { getClassesForTeacher } from "@/app/lib/services/class";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import Loading from "@/app/ui/components/_common/loading/Loading";

export default function Classes() {
  const [openClasses, setOpenClasses] = useState<ClassTeacher[]>([]);
  const [ongoingClasses, setOngoingClasses] = useState<ClassTeacher[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassTeacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getClassesForTeacher();

        const now = new Date();

        const completedMapped = classes.filter(
          (cls: ClassTeacher) =>
            cls.status === "COMPLETED" || new Date(cls.endDate) < now,
        );

        const ongoingMapped = classes.filter(
          (cls: ClassTeacher) =>
            !completedMapped.includes(cls) &&
            (cls.status === "PROGRESS" ||
              (new Date(cls.startDate) <= now && new Date(cls.endDate) >= now)),
        );

        const openMapped = classes.filter(
          (cls: ClassTeacher) =>
            !completedMapped.includes(cls) &&
            !ongoingMapped.includes(cls) &&
            (cls.status === "OPEN" || new Date(cls.startDate) > now),
        );

        setOpenClasses(openMapped);
        setOngoingClasses(ongoingMapped);
        setCompletedClasses(completedMapped);
        setIsLoading(false);
      } catch {
        console.error("Error fetching classes");
      }
    };

    fetchClasses();
  }, []);

  const filterByName = (classes: ClassTeacher[]) =>
    classes.filter((cls) =>
      cls.name.toLowerCase().includes(search.trim().toLowerCase()),
    );

  if (isLoading) {
    return (
      <div className="mt-4">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Tabs value="ongoing">
        <TabList>
          <Tab value="ongoing" label="Đang diễn ra" />
          <Tab value="open" label="Chưa bắt đầu" />
          <Tab value="completed" label="Đã hoàn thành" />
        </TabList>

        <div className="flex items-center justify-between mb-4 gap-2">
          <input
            type="text"
            className="w-full px-3 py-2 border-2 border-primary-light rounded-lg
             focus:outline-none focus:ring-1 focus:ring-primary-light text-sm"
            placeholder="Tìm kiếm lớp học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <TabPanel value={"ongoing"}>
          <ClassList classes={filterByName(ongoingClasses)} status="PROGRESS" />
        </TabPanel>
        <TabPanel value={"open"}>
          <ClassList classes={filterByName(openClasses)} status="OPEN" />
        </TabPanel>
        <TabPanel value={"completed"}>
          <ClassList
            classes={filterByName(completedClasses)}
            status="COMPLETED"
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}
