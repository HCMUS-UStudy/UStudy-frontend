"use client";

import React from "react";
import ProgressLearning from "@/app/ui/components/user/parent/home/ProgressLearning";
import RegisteredClass from "@/app/ui/components/user/parent/home/RegisteredClass";
import Notifications from "@/app/ui/components/user/parent/home/Notifications";
import Events from "@/app/ui/components/user/parent/home/Events";

export default function ParentHome() {
  return (
    <div className="px-2">
      <div className="h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-stretch">
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <ProgressLearning />
            <RegisteredClass />
          </div>

          <div className="flex flex-col gap-6 h-full">
            <Notifications />
            <Events />
          </div>
        </div>
      </div>
    </div>
  );
}
