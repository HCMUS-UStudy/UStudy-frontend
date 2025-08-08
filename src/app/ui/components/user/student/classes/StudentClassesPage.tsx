"use client";

import React, { useState, useEffect, useMemo } from "react";
import StudentClasses from "@/app/ui/components/user/student/classes/StudentClasses";
import { useSearchParams } from "next/navigation";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import { getAllStudentClasses } from "@/app/lib/services/class";
import { useQuery } from "@tanstack/react-query";
import { ClassUserItem } from "@/app/types/class";

const filterClassesByStatus = (
  classes: ClassUserItem[] | undefined,
  status: string,
) => {
  if (!classes) return [];

  return classes.filter((cls) => {
    switch (status) {
      case "ongoing":
        return cls.status === "PROGRESS";
      case "open":
        return cls.status === "OPEN";
      case "completed":
        return cls.status === "COMPLETED";
      default:
        return true;
    }
  });
};

export default function StudentClassesPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ongoing");

  // Fetch all classes
  const { data: allClasses, isLoading } = useQuery({
    queryKey: ["StudentClasses"],
    queryFn: () => getAllStudentClasses(0, 100), // Fetch first 100 classes, adjust as needed
  });

  // Filter classes based on search query and active tab
  const filteredClasses = useMemo(() => {
    if (!allClasses?.content) return [];

    let result = [...allClasses.content];

    // Filter by search query
    if (query) {
      const searchLower = query.toLowerCase();
      result = result.filter(
        (cls) =>
          cls.name.toLowerCase().includes(searchLower) ||
          cls.course?.name?.toLowerCase().includes(searchLower) ||
          cls.grade?.name?.toLowerCase().includes(searchLower),
      );
    }

    // Filter by status
    return filterClassesByStatus(result, activeTab);
  }, [allClasses, query, activeTab]);

  useEffect(() => {
    const searchQuery = searchParams?.get("query") || "";
    setQuery(searchQuery);
  }, [searchParams]);

  return (
    <div className="bg-foreground">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold mb-4">
          Danh sách lớp học
        </h2>
      </div>

      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <TabList>
          <Tab value="ongoing" label="Đang diễn ra" />
          <Tab value="open" label="Chưa bắt đầu" />
          <Tab value="completed" label="Đã hoàn thành" />
        </TabList>

        <div className="flex items-center justify-between">
          <input
            type="text"
            className="w-full px-3 py-2 border-2 border-primary-light rounded-lg
             focus:outline-none focus:ring-1 focus:ring-primary-light text-sm"
            placeholder="Tìm kiếm lớp học..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="relative mt-6 max-h-[400px] overflow-y-auto">
          <TabPanel value="ongoing">
            <StudentClasses classes={filteredClasses} isLoading={isLoading} />
          </TabPanel>
          <TabPanel value="open">
            <StudentClasses classes={filteredClasses} isLoading={isLoading} />
          </TabPanel>
          <TabPanel value="completed">
            <StudentClasses classes={filteredClasses} isLoading={isLoading} />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
}
