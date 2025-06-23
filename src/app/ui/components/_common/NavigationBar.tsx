"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Select, SelectItem } from "./Select";

interface NavigationBarProps {
  tabs: { path: string; label: string }[];
  basePath: string;
}

export default function NavigationBar({ tabs, basePath }: NavigationBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (path: string) => {
    router.push(`${basePath}/${path}`);
  };

  const currentTab = pathname?.split("/").at(-1) || "overview";
  const currentTabLabel =
    tabs.find((tab) => tab.path === currentTab)?.label || "Tổng quan";

  return (
    <>
      {/* Show tabs on md and larger screens */}
      <div className="hidden md:flex gap-5 text-primary-dark text-base md:text-lg font-medium">
        {tabs.map((tab) => (
          <label
            key={tab.path}
            htmlFor={tab.path}
            className="relative group cursor-pointer hover:text-highlight-text has-[:checked]:hover:text-primary-dark transition-all duration-300 py-1.5 px-4 has-[:checked]:font-bold"
          >
            <input
              id={tab.path}
              type="radio"
              name="ClassTabs"
              className="hidden peer"
              onChange={() => handleTabChange(tab.path)}
              checked={pathname?.split("/").at(-1) === tab.path}
            />
            {tab.label}
            <span className="absolute inset-0 border-b-2 border-primary scale-x-0 group-hover:scale-x-100 transition-all duration-300 peer-checked:border-primary-darkest peer-checked:scale-x-100"></span>
          </label>
        ))}
      </div>

      {/* Show Select on small screens */}
      <div className="md:hidden">
        <Select
          defaultLabel={currentTabLabel}
          className="bg-primary-lighter"
          onValueChange={(value) => handleTabChange(value as string)}
          showClearButton={false}
        >
          {tabs.map((tab) => (
            <SelectItem key={tab.path} value={tab.path}>
              {tab.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
}
