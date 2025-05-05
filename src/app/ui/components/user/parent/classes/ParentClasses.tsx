"use client";

import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import CurrentClass from "@/app/ui/components/user/parent/classes/CurrentClass";
import CompletedClass from "@/app/ui/components/user/parent/classes/CompletedClass";

export default function ParentClasses() {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="px-2">
      <Tabs value={activeTab} onTabChange={setActiveTab} className="mb-6">
        <TabList className="mb-4">
          <Tab label="Lớp học hiện tại" value="current" />
          <Tab label="Lớp học đã hoàn thành" value="completed" />
        </TabList>

        <TabPanel value="current">
          <CurrentClass />
        </TabPanel>

        <TabPanel value="completed">
          <CompletedClass />
        </TabPanel>
      </Tabs>
    </div>
  );
}
