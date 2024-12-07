"use client"

import React, { useState } from "react";
import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import { AccountSchema } from "@/app/types/type";
import { createNewAccount } from "@/app/lib/api";

interface CreateAccountError {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
  gender?: string | null;
  role?: string | null;
}

interface ModalAccountWrapperProps {
  buttonLabel: string;
}

const ModalAccount: React.FC<ModalAccountWrapperProps> = ({ buttonLabel }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [newUser, setNewUser] = useState<AccountSchema>({
    email: "",
    name: "",
    phone: "",
    address: "",
    birthday: "",
    gender: "MALE",
    role: "STUDENT",
  });

  const [errors, setErrors] = useState<CreateAccountError>({
    email: null,
    name: null,
    phone: null,
    address: null,
    birthday: null,
    gender: null,
    role: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Convert date to standard format if necessary
    const formattedValue =
      name === "birthday" && value ? new Date(value).toISOString().split("T")[0] : value;
  
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: formattedValue,
    }));
  };
  

  const isValidForm = (data: AccountSchema): boolean => {
    let isValid = true;
    const msg = "Trường bắt buộc";
    const newErrors: CreateAccountError = {};
  
    if (!data.email) {
      newErrors.email = msg;
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }
  
    if (!data.name) {
      newErrors.name = msg;
      isValid = false;
    }
  
    if (!data.phone) {
      newErrors.phone = msg;
      isValid = false;
    } else if (!/^\d+$/.test(data.phone)) {
      newErrors.phone = "Số điện thoại chỉ được chứa số";
      isValid = false;
    }
  
    if (!data.address) {
      newErrors.address = msg;
      isValid = false;
    }
  
    if (!data.birthday) {
      newErrors.birthday = msg;
      isValid = false;
    } else {
      // Optionally validate the date is not in the future
      const today = new Date().toISOString().split("T")[0];
      if (data.birthday > today) {
        newErrors.birthday = "Ngày sinh không được là ngày trong tương lai";
        isValid = false;
      }
    }    
  
    const validGenders = ["MALE", "FEMALE"];
    if (!validGenders.includes(data.gender)) {
      newErrors.gender = "Giới tính không hợp lệ";
      isValid = false;
    }
  
    const validRoles = ["STUDENT", "TEACHER", "STAFF"];
    if (!validRoles.includes(data.role)) {
      newErrors.role = "Chức vụ không hợp lệ";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload: AccountSchema = { ...newUser };
  
    if (!isValidForm(payload)) {
      toast.error("Vui lòng kiểm tra lại các thông tin đã nhập!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      console.log(errors)
      return; // Stop further processing if validation fails
    }
  
    try {
      const response = await createNewAccount(payload);
  
      if (response.status === 200) {
        setNewUser({
          email: "",
          name: "",
          phone: "",
          address: "",
          birthday: "",
          gender: "MALE",
          role: "STUDENT",
        });
  
        toast.success("Tạo tài khoản thành công! Đang chuyển hướng...", {
          position: "bottom-right",
          autoClose: 3000,
        });
  
        setTimeout(() => {
          window.location.href = "/admin/accounts";
        }, 3000);
      } else {
        toast.error("Đã xảy ra lỗi khi tạo tài khoản.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <>
      <ToastContainer />
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
                  value={newUser.gender === "MALE" ? "male" : "female"} // Chuyển giá trị lưu trữ thành chữ thường
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      gender: e.target.value === "male" ? "MALE" : "FEMALE", // Chuyển giá trị nhập thành chữ hoa
                    }))
                  }
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
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
                  value={
                    newUser.role === "STUDENT"
                      ? "student"
                      : newUser.role === "TEACHER"
                        ? "teacher"
                        : "staff" // Chuyển giá trị lưu trữ thành chữ thường
                  }
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      role:
                        e.target.value === "student"
                          ? "STUDENT"
                          : e.target.value === "teacher"
                            ? "TEACHER"
                            : "STAFF", // Chuyển giá trị nhập thành chữ hoa
                    }))
                  }
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

              {/* birthday */}
              <div className="relative mb-6">
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={newUser.birthday}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  required
                />
                <label htmlFor="birthday" className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5">
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
