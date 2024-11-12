"use client";
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import { useState } from "react";
import classNames from "classnames";
import { PiHandWavingThin } from "react-icons/pi";
import "../style/Header.css";
// import { IoSearch } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";

// import { UserNav } from "./usernav";

export default function Header() {
  const { toggleCollapse } = useSideBarToggle();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const headerStyle = classNames(
    // "bg-[#D5EEFF] fixed w-[calc(100%-1rem)] ml-4 z-[99997] px-6 py-1 shadow-md shadow-slate-500/30 rounded-2xl transition-all duration-300 ease-in-out",
    {
      ["header isWide"]: !toggleCollapse,
      ["header isNarrow"]: toggleCollapse,
    }
  );

  return (
    <div className={headerStyle}>
      <div className="hello">
        <div className="first-line">
          Hello Admin!! {<PiHandWavingThin className="icon" size={25} />}
        </div>
        <div className="second-line">Welcome back to Admin Page!</div>
      </div>

      {/* <div className="search-bar">
        <input type="text" placeholder="Search" />
        <IoSearch className="search-icon" size={24} />
      </div> */}

      <div className="branch-selector" onClick={toggleDropdown}>
        <select className="branch-dropdown">
          <option value="">Select a branch</option>
          <option value="branch1">Branch 1</option>
          <option value="branch2">Branch 2</option>
          <option value="branch3">Branch 3</option>
        </select>
      </div>

      <div className="notification">
        <IoNotificationsOutline size={24} />
      </div>
    </div>
  );
  //   return <></>;
}
