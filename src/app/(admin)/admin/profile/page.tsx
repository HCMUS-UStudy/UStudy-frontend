"use client";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  FiMail,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiLock,
} from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";
import "../../../ui/styles/ProfilePage.css";
import { Button } from "@/app/ui/components/common/Button";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  address: string;
  password: string;
  birthday: string;
  genId: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-info">
            <FaUserCircle size={130} className="profile-avatar" />
            <div className="profile-details">
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-role">{user.role}</p>
            </div>
          </div>
          <Button className="edit-btn">
            <AiOutlineEdit className="edit-icon" size={20} /> Chỉnh sửa
          </Button>
        </div>

        <div className="profile-contact-info">
          <div className="contact-item">
            <FiMail size={20} className="contact-icon" />
            <span className="contact-text">Email: {user.email}</span>
          </div>
          <div className="contact-item">
            <FiPhone size={20} className="contact-icon" />
            <span className="contact-text">Liên hệ: {user.phone}</span>
          </div>
          <div className="contact-item">
            <FiCalendar size={20} className="contact-icon" />
            <span className="contact-text">
              Ngày sinh: {new Date(user.birthday).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div className="contact-item">
            <FiMapPin size={20} className="contact-icon" />
            <span className="contact-text">Địa chỉ: {user.address}</span>
          </div>
          <div className="contact-item">
            <FiCreditCard size={20} className="contact-icon" />
            <span className="contact-text">Mã số: {user.genId}</span>
          </div>
          <div className="contact-item">
            {user.isActive ? (
              <FiCheckCircle size={20} className="contact-icon" />
            ) : (
              <FiXCircle size={20} className="contact-icon" />
            )}
            <div className="flex">
              <span className="contact-text">Tình trạng:</span>
              <span
                className={`contact-text ${
                  user.isActive ? "active-status" : "inactive-status"
                }`}
                style={{ marginLeft: "8px" }}
              >
                {user.isActive ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
          </div>
        </div>

        {/* Password is hidden */}
        <div className="contact-item">
          <FiLock size={20} className="contact-icon" />
          <span className="contact-text">Mật khẩu: **************</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
