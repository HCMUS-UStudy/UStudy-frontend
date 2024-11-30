"use client";

import React, { useState } from "react";

import { Button } from "@/app/ui/components/button";
import axios from "axios";
import Swal from "sweetalert2";
import CourseTable from "@/app/ui/components/courseTable";
import ModalCourse from "@/app/ui/components/modalCourse-Ad";

const CoursePage: React.FC = () => {

  const searchQuery = ""; 
  const coursesPerPage = 4;

  //const [selectedName, setSelectedName] = useState("");

  const [isFocused, setIsFocused] = useState({ creator: false, name: false, description: false });

  //Modals
  const [showModal, setShowModal] = useState(false);

  const [setCourses] = useState<any[]>([]);

  const [totalCourses] = useState(0);
  const [setLoading] = useState(false);
  const [setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
  });

  // const fetchAllCourses = async () => {
  //   const authToken = localStorage.getItem("authToken");
  //   let allCourses: any[] = [];
  //   let currentPage = 0;

  //   try {
  //     // Lặp qua tất cả các trang để lấy dữ liệu
  //     while (true) {
  //       const response = await axios.get(
  //         `http://localhost:8080/api/course/admin/get-list-course`,
  //         {
  //           params: {
  //             page: currentPage,
  //             limit: coursesPerPage,
  //           },
  //           headers: { Authorization: `Bearer ${authToken}` },
  //         }
  //       );

  //       const courses = response.data?.content || [];
  //       allCourses = [...allCourses, ...courses];

  //       // Kiểm tra nếu đã tới trang cuối
  //       if (currentPage + 1 >= response.data?.totalPages) {
  //         break;
  //       }

  //       currentPage++;
  //     }

  //     // Cập nhật danh sách toàn bộ khóa học
  //     const allIds = new Set(allCourses.map((course) => course.id));
  //     setAllCourseIds(allIds);

  //     console.log("Tất cả khóa học đã được fetch:", allCourses);
  //   } catch (error) {
  //     console.error("Error fetching all courses:", error);
  //   }
  // };

  // // Gọi hàm này khi component được mount
  // useEffect(() => {
  //   fetchAllCourses();
  // }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveCourse = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/course/admin/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Course created successfully:", response.data);

      if (response.status === 200) {

        await Swal.fire({
          icon: "success",
          title: "Tạo môn học thành công!",
          text: "Vui lòng kiểm tra dữ liệu bên dưới!",
          timer: 9000,
          showConfirmButton: true,
        });
        // Cập nhật danh sách courses sau khi thêm thành công
        setCourses((prevCourses) => [...prevCourses, response.data]);

        // Đóng modal và reset form
        setShowModal(false);
        setFormData({
          name: "",
          description: "",
          content: "",
        });
        //window.location.href = "/admin/courses";
      }

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data || "Không thể tạo môn học. Vui lòng thử lại.";
        await Swal.fire({
          icon: 'error',
          title: 'Tạo môn học thất bại',
          text: message,
        });
      } else {
        const unexpectedError = "Lỗi hệ thống.";
        Swal.fire({
          icon: 'error',
          title: 'Tạo môn học thất bại',
          text: unexpectedError,
        });
      }
      setError("Không thể tạo môn học. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // const handleAttachmentClick = (id: string, subject: string) => {
  //   return `/admin/course-documents/${encodeURIComponent(id)}/${encodeURIComponent(subject)}`;
  // };

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Quản lý tài liệu môn học
      </h2>
      <h2 className="text-xl tracking-tight mb-6">
        Tìm tất cả tài liệu của nền tảng tại đây
      </h2>

      <div className="flex items-center justify-between mt-8 mr-6">
        <h2 className="text-2xl font-bold">
          Tổng số môn học ({totalCourses})
        </h2>
        {/* <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm môn học..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-l-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-full bg-white text-black hover:bg-slate-100 focus:ring-2 focus:ring-blue-300">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
          <select
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            className="border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả môn học</option>
            <option value="math">Toán</option>
            <option value="literature">Ngữ văn</option>
            <option value="english">Tiếng Anh</option>
            <option value="physics">Vật lý</option>
            <option value="chemistry">Hóa</option>
            <option value="biology">Sinh học</option>
            <option value="history">Lịch sử</option>
            <option value="geography">Địa lý</option>
            <option value="civics">Giáo dục công dân</option>
            <option value="informatics">Tin học</option>
            <option value="technology">Công nghệ</option>
          </select>
        </form> */}
      </div>

      <div className="flex justify-end items-center space-x-4 mb-2 mt-6">
        <div className="flex items-center space-x-4">
          <ModalCourse buttonLabel="Tạo môn học" />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 max-h-[400px]">
        <CourseTable searchQuery={searchQuery} coursesPerPage={coursesPerPage} />
      </div>

      {/* Show modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Tạo môn học mới
            </h2>

            <form className="space-y-6">
              {/* Người tạo */}
              <div className="relative mb-6">
                <input
                  type="text"
                  name="creator"
                  value={localStorage.getItem('creator') || ''}
                  readOnly
                  className="w-full p-3 pl-4 bg-transparent text-gray-800 border border-gray-300 rounded-xl cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Người tạo"
                />
                <label
                  htmlFor="creator"
                  className="absolute left-4 transition-all duration-200 -top-3.5 text-xs text-indigo-600 bg-white px-1">
                  Người tạo
                </label>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused((prev) => ({ ...prev, name: true }))}
                  onBlur={() => setIsFocused((prev) => ({ ...prev, name: false }))}
                  className="w-full p-3 pl-4 bg-transparent text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <label
                  htmlFor="name"
                  className={`absolute left-4 transition-all duration-200 ${formData.name || isFocused.name ? "-top-3.5 text-xs text-indigo-600 bg-white px-1" : "top-1/2 transform -translate-y-1/2 text-gray-400"}`}
                >
                  Tên môn
                </label>
              </div>


              {/* Mô tả */}
              <div className="relative mb-6">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused((prev) => ({ ...prev, description: true }))}
                  onBlur={() => setIsFocused((prev) => ({ ...prev, description: false }))}
                  className="w-full p-3 pl-4 bg-transparent text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <label
                  htmlFor="description"
                  className={`absolute left-4 transition-all duration-200 ${formData.description || isFocused.description ? "-top-3.5 text-xs text-indigo-600 bg-white px-1" : "top-1/2 transform -translate-y-1/2 text-gray-400 pb-2"}`}
                >
                  Mô tả môn học
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-200">
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveCourse}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200">
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

export default CoursePage;