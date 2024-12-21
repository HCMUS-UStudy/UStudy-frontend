"use client";
import React, { useState } from "react";
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { PiHandWavingThin } from "react-icons/pi";
import { IoMailOutline, IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "../styles/Header.css";
import Swal from "sweetalert2";

const HeaderStuTeach: React.FC = () => {
  const { toggleCollapse } = useSideBarToggle();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasNewNotification] = useState(false);
  const [hasNewMessage] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfileClick = () => {
    window.location.href = "/student/profile"; // Chuyển hướng tới trang profile
  };

  const handleLogout = () => {
    // Xóa token và các thông tin khác trong localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("creator");
    localStorage.removeItem("userData");

    // Hiển thị thông báo thành công
    Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out successfully.",
      timer: 8000,
      showConfirmButton: false,
    });

    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = "/login";
  };

  const headerStyle = classNames({
    ["header isWide"]: !toggleCollapse,
    ["header isNarrow"]: toggleCollapse,
  });

  return (
    <div className={headerStyle}>
      <div className="hello">
        <div className="first-line">
          Hi!! {<PiHandWavingThin className="icon" size={25} />}
        </div>
        <div className="second-line">Chào mừng bạn quay trở lại!</div>
      </div>

      <div className="right-items">
        <div className={`notification ${hasNewNotification ? "new" : ""}`}>
          <IoNotificationsOutline size={20} />
          {<span className="badge">1</span>} {/* Số lượng thông báo mới */}
        </div>

        <div className={`message ${hasNewMessage ? "new" : ""}`}>
          <IoMailOutline size={20} />
          {hasNewMessage && <span className="badge">3</span>}{" "}
          {/* Số lượng tin nhắn mới */}
        </div>

        <div className="user-setting">
          <FaUserCircle
            size={35}
            className="user-icon"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleProfileClick}>
                <FaUserCircle className="dropdown-icon" /> Profile
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeaderStuTeach);
