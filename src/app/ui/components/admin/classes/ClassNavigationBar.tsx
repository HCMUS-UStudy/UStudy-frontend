"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { memo } from "react";
import { Select, SelectItem } from "../../_common/Select";

const ClassNavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "participant", label: "Thành viên" },
    { id: "material", label: "Tài liệu" },
    { id: "assignment", label: "Bài tập & Kiểm tra" },
  ];

  const handleTabChange = (id: string) => {
    const classId = pathname?.split("/")[3];
    router.push(`/member/classes/${classId}/${id}`);
  };

  const currentTab = pathname?.split("/").at(-1) || "overview";
  const currentTabLabel =
    tabs.find((tab) => tab.id === currentTab)?.label || "Tổng quan";

  return (
    <>
      <div className="hidden md:flex gap-5 text-primary-dark text-base md:text-lg font-medium">
        {tabs.map((tab) => (
          <label
            key={tab.id}
            htmlFor={tab.id}
            className="relative group cursor-pointer hover:text-highlight-text has-[:checked]:hover:text-primary-dark transition-all duration-300 py-1.5 px-4 has-[:checked]:font-bold"
          >
            <input
              id={tab.id}
              type="radio"
              name="ClassTabs"
              className="hidden peer"
              onChange={() => handleTabChange(tab.id)}
              checked={pathname?.split("/").at(-1) === tab.id}
            />
            {tab.label}
            <span className="absolute inset-0 border-b-2 border-primary scale-x-0 group-hover:scale-x-100 transition-all duration-300 peer-checked:border-primary-darkest peer-checked:scale-x-100"></span>
          </label>
        ))}
      </div>

      <div className="md:hidden">
        <Select
          defaultLabel={currentTabLabel}
          className="bg-primary-lighter"
          onValueChange={(value) => handleTabChange(value as string)}
          showClearButton={false}
        >
          {tabs.map((tab) => (
            <SelectItem key={tab.id} value={tab.id}>
              {tab.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
};

export default memo(ClassNavigationBar);
