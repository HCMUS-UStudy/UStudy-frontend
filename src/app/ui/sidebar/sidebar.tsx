"use client";
import { SIDENAV_ITEMS_ADMIN, SIDENAV_ITEMS_STAFF } from "@/app/menu_constants";
import classNames from "classnames";
// import React, { useEffect, useState } from 'react';
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import SidebarMenuGroup from "./SidebarMenuGroup";
import "../style/Sidebar.css"; // Import file CSS
import { useEffect, useState } from "react";

export const Sidebar = () => {
  // const [mounted, setMounted] = useState(false);
  const { toggleCollapse } = useSideBarToggle();

  const asideStyle = classNames("sidebar", {
    wide: !toggleCollapse,
    narrow: toggleCollapse,
  });

  // useEffect(() => setMounted(true), []);

  return (
    <aside className={asideStyle}>
      <div className="sidebar-top">
        {/* {<SidebarLogo />} */}
        <h3 className={classNames("sidebar-title", { hidden: toggleCollapse })}>
          UStudy
        </h3>
      </div>
      <nav className="flex flex-col gap-2 px-4">
        {" "}
        {/* Adjusted gap for spacing */}
        {SIDENAV_ITEMS_ADMIN.map((item, idx) => (
          <SidebarMenuGroup key={idx} menuGroup={item} />
        ))}
      </nav>
    </aside>
  );
};

export const SideBarStaff = () => {
  const [mounted, setMounted] = useState(false);
  const { toggleCollapse } = useSideBarToggle();

  const asideStyle = classNames(
    "sidebar overflow-y-auto fixed bg-[#D5E9F6] h-full shadow-lg shadow-slate-700/50 transition-all duration-300 ease-in-out z-[99999] border-r border-gray-300 rounded-2xl",
    {
      ["w-[16rem]"]: !toggleCollapse,
      ["sm:w-[5.4rem] sm:left-0 left-[-100%]"]: toggleCollapse,
    }
  );

  useEffect(() => setMounted(true), []);

  return (
    <aside className={asideStyle}>
      <div className="sidebar-top flex items-center px-4 py-4">
        {" "}
        {/* Reduced padding */}
        <h3
          className={classNames(
            "pl-2 font-semibold text-2xl min-w-max text-gray-700 transition-opacity duration-300",
            { hidden: toggleCollapse }
          )}>
          UStudy
        </h3>
      </div>
      <nav className="flex flex-col gap-2 px-4">
        {" "}
        {/* Adjusted gap for spacing */}
        {SIDENAV_ITEMS_STAFF.map((item, idx) => (
          <SidebarMenuGroup key={idx} menuGroup={item} />
        ))}
      </nav>
    </aside>
  );
};
