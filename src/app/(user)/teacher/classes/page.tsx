"use client";

import React, { useState, useEffect, Suspense } from "react";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import ClassList from "@/app/ui/components/user/teacher/ClassList";
import { ClassTeacher } from "@/app/types";
import { getClassesForTeacher } from "@/app/lib/services/class";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import Loading from "@/app/ui/components/_common/loading/Loading";

export default function Classes() {
  const [ongoingClasses, setOngoingClasses] = useState<ClassTeacher[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassTeacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

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
          <Tab value="ongoing" label="Lớp đang dạy" />
          <Tab value="completed" label="Lớp đã hoàn thành" />
        </TabList>

        <div className="flex items-center justify-between mb-4 gap-2">
          <Suspense>
            <SearchField
              className="w-full bg-primary-lighter py-[2px] rounded-xl"
              placeholder="Tìm kiếm lớp học..."
              // onSearch={handleSearch}
            />
          </Suspense>
          {/* <div className="flex items-center gap-6 px-4">
            <div className="flex items-center gap-3 cursor-pointer">
              Lọc
              <FiFilter className="w-5 h-5" />
            </div>
            <div className="flex items-center cursor-pointer">
              <HiAdjustmentsHorizontal className="w-6 h-6" />
            </div>
          </div> */}
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
