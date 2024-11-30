"use client";

import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";

interface ModalCourseWrapperProps {
  buttonLabel: string;
}

const ModalCourse: React.FC<ModalCourseWrapperProps> = ({ buttonLabel }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    creator: localStorage.getItem("creator") || "",
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/course/admin/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Tạo môn học thành công",
          text: "Vui lòng kiểm tra thông tin môn học.",
          timer: 8000,
          showConfirmButton: true,
        });

        setFormData({
          name: "",
          description: "",
          creator: localStorage.getItem("creator") || "",
        });
        setShowModal(false);
        window.location.href = "/admin/courses";
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Tạo môn học thất bại",
        text: err.response?.data || "Lỗi hệ thống. Vui lòng thử lại.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleOpenModal} className="pl-6 pr-6">
        {buttonLabel}
      </Button>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
            <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Tạo môn học mới
            </h3>
            <form onSubmit={handleSubmitModal} className="space-y-6">
              {/* Creator */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-gray-100 rounded-xl text-gray-800 border border-gray-300 cursor-not-allowed"
                  type="text"
                  id="creator"
                  name="creator"
                  value={formData.creator}
                  readOnly
                  placeholder="Người tạo"
                />
                <Label
                  htmlFor="creator"
                  className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5"
                >
                  Người tạo
                </Label>
              </div>

              {/* Name */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tên môn"
                  required
                />
                <Label
                  htmlFor="name"
                  className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5"
                >
                  Tên môn *
                </Label>
              </div>

              {/* Description */}
              <div className="relative mb-6">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  placeholder="Nhập mô tả môn học"
                  required
                ></textarea>
                <Label
                  htmlFor="description"
                  className="absolute left-4 text-xs text-indigo-600 bg-white px-1 transition-all duration-200 -top-3.5"
                >
                  Mô tả môn học *
                </Label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <Button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-200"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                  Lưu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCourse;