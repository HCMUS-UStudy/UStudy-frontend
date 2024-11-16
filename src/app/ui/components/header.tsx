"use client";
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import React from "react";
import classNames from "classnames";
import { PiHandWavingThin } from "react-icons/pi";
import "../styles/Header.css";
import { IoNotificationsOutline } from "react-icons/io5";
import BranchSelector from "./BranchSelector";
import { usePathname } from "next/navigation"; // Import hook usePathname

const Header: React.FC = () => {
    const { toggleCollapse } = useSideBarToggle();
    const pathname = usePathname(); // Lấy đường dẫn hiện tại
    const handleBranchChange = (id: string) => {
        console.log("Selected Branch ID:", id);
    };

    const headerStyle = classNames({
        ["header isWide"]: !toggleCollapse,
        ["header isNarrow"]: toggleCollapse,
    });

    return (
        <div className={headerStyle}>
            <div className="hello">
                <div className="first-line">
                    Hello Admin!! {<PiHandWavingThin className="icon" size={25} />}
                </div>
                <div className="second-line">Welcome back to Admin Page!</div>
            </div>

            <div className="right-items">
                {/* Hiển thị BranchSelector nếu không phải ở trang /admin/branches */}
                {pathname !== "/admin/branches" && (
                    <BranchSelector onBranchChange={handleBranchChange} />
                )}

                <div className="notification">
                    <IoNotificationsOutline size={20} />
                </div>
            </div>
        </div>
    );
};

export default React.memo(Header);
