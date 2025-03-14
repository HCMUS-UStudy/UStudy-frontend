"use client";

import React, { useState, useEffect } from "react";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { FiFilter } from "react-icons/fi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import ClassList from "@/app/ui/components/user/classes/ClassList";
import { ClassTeacher } from "@/app/types/type";
import { getClassesForTeacher } from "@/app/lib/services/class";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";

export default function Classes() {
  const [ongoingClasses, setOngoingClasses] = useState<ClassTeacher[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassTeacher[]>([]);

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
  }, []);

  return (
    <div>
      <Tabs value="ongoing">
        <TabList>
          <Tab value="ongoing" label="Lớp đang dạy" />
          <Tab value="completed" label="Lớp đã hoàn thành" />
        </TabList>

        <div className="flex items-center justify-between mb-4 gap-2">
          <SearchField
            className="w-full bg-primary-lighter py-[2px] rounded-2xl"
            placeholder="Tìm kiếm lớp học..."
            // onSearch={handleSearch}
          />
          <div className="flex items-center gap-6 px-4">
            <div className="flex items-center gap-3 cursor-pointer">
              Lọc
              <FiFilter className="w-5 h-5" />
            </div>
            <div className="flex items-center cursor-pointer">
              <HiAdjustmentsHorizontal className="w-6 h-6" />
            </div>
          </div>
        </div>
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
