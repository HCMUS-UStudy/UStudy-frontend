"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function ClassNavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "participant", label: "Thành viên" },
    { id: "material", label: "Tài liệu" },
    // { id: "quiz", label: "Trắc nghiệm" },
    { id: "assignment", label: "Bài tập & Kiểm tra" },
  ];
  const handleTabChange = (id: string) => {
    const classId = pathname?.split("/")[3];
    router.push(`/member/classes/${classId}/${id}`);
  };
  return (
    <div className="flex gap-5 text-primary-dark text-lg font-medium">
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
  );
}
