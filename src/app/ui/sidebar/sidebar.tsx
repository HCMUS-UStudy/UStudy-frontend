"use client";
import classNames from "classnames";
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import React, { useEffect } from "react";
import SidebarMenu from "./SidebarMenu";
import { SideNavItemGroup } from "@/app/types/type";
import "../styles/Sidebar.css"; // Import file CSS
// import { BsList } from 'react-icons/bs';
import { RiArrowLeftSLine } from "react-icons/ri";
import Image from "next/image";

const Sidebar = ({ menuItems }: { menuItems: SideNavItemGroup[] }) => {
  const { toggleCollapse, setToggleCollapse, invokeToggleCollapse } =
    useSideBarToggle();

  // Auto-collapse sidebar on screens smaller than 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setToggleCollapse(true);
      } else {
        setToggleCollapse(false);
      }
    };

    handleResize(); // Set initial state based on screen width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setToggleCollapse]);

  const sidebarToggle = () => {
    invokeToggleCollapse();
  };

  const asideStyle = classNames("sidebar", {
    wide: !toggleCollapse,
    narrow: toggleCollapse,
  });

  const sidebarToggleStyle = classNames("sidebar-toggle", {
    isLeft: !toggleCollapse,
    isRight: toggleCollapse,
  });

  return (
    <>
      <aside className={asideStyle}>
        <div className="sidebar-top justify-center space-x-2">
          <Image src="/UStudyIcon.png" alt="Logo" className="sidebar-logo" width={45} height={45}/>
          <h3
            className={classNames("sidebar-title", { hidden: toggleCollapse })}>
            <div className="US">US</div>
            <div>tudy</div>
          </h3>
        </div>
        <nav className="sidebar-nav">
          {" "}
          {menuItems.map((item, idx) => (
            <SidebarMenu key={idx} menuGroup={item} />
          ))}
        </nav>
      </aside>
      <button className={sidebarToggleStyle} onClick={sidebarToggle}>
        <RiArrowLeftSLine size={14} />
      </button>
    </>
  );
};

export default Sidebar;
