"use client"

import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";

interface NewUser {
  email: string;
  name: string;
  phone: string;
  address: string;
  birthDate: string;
  gender: string;
  role: string;
}

interface ModalAccountWrapperProps {
  buttonLabel: string;
}

const ModalAccount: React.FC<ModalAccountWrapperProps> = ({ buttonLabel }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    name: "",
    phone: "",
    address: "",
    birthDate: "",
    gender: "male",
    role: "student",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const payload = {
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      address: newUser.address,
      birthday: newUser.birthDate,
      gender: newUser.gender === "female" ? "FEMALE" : "MALE",
      role: newUser.role === "student" ? "STUDENT" : newUser.role === "teacher" ? "TEACHER" : "CLERK",
    };

    try {
      const response = await axios.post("http://localhost:8080/api/user/admin/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setNewUser({
          email: "",
          name: "",
          phone: "",
          address: "",
          birthDate: "",
          gender: "male",
          role: "student",
        });
        Swal.fire({
          icon: "success",
          title: "Tạo tài khoản thành công",
          text: "Vui lòng kiểm tra thông tin tài khoản tại bảng bên dưới",
          timer: 8000,
          showConfirmButton: true,
        });
        window.location.href = "/admin/accounts";
      }
      setShowModal(false);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Tạo tài khoản thất bại",
        text: err.response?.data || "Lỗi hệ thống. Vui lòng thử lại.",
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="pl-6 pr-6"
      >
        {buttonLabel}
      </Button>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
            <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">Tạo người dùng mới</h3>
            <form onSubmit={handleSubmitModal} className="space-y-6">
              {/* Email */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  required
                />
                <Label htmlFor="email" className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5">
                  Nhập địa chỉ email *
                </Label>
              </div>

              {/* Name */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên người dùng"
                  required
                />
                <Label htmlFor="name" className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5">
                  Nhập tên người dùng *
                </Label>
              </div>

              {/* Phone */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
                <Label htmlFor="phone" className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5">
                  Nhập số điện thoại *
                </Label>
              </div>

              {/* Address */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  type="text"
                  id="address"
                  name="address"
                  value={newUser.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                  required
                />
                <Label htmlFor="address" className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5">
                  Nhập địa chỉ *
                </Label>
              </div>

              {/* Gender */}
              <div className="relative mb-6">
                <select
                  id="gender"
                  name="gender"
                  value={newUser.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                <label htmlFor="gender" className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5">
                  Giới tính
                </label>
              </div>

              {/* Role */}
              <div className="relative mb-6">
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  required
                >
                  <option value="">Chọn chức vụ</option>
                  <option value="student">Học viên</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="staff">Giáo vụ</option>
                </select>
                <label htmlFor="role" className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5">
                  Chức vụ
                </label>
              </div>

              {/* Birthdate */}
              <div className="relative mb-6">
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={newUser.birthDate}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  required
                />
                <label htmlFor="birthDate" className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5">
                  Ngày sinh *
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-8 space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

export default ModalAccount;
