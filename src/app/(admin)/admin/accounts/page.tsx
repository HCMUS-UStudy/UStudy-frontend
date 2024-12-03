"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/card";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { Label } from "@/app/ui/components/label";
import { Input } from "@/app/ui/components/input";
import { Button } from "@/app/ui/components/button";
import Swal from "sweetalert2";
import axios from "axios";
import { FiLock } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";

const AccountPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    name: false,
    phone: false,
    address: false,
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    birthDate: "",
    role: "",
    phone: "",
    address: "",
    gender: "Nam",
  });

  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  const [users, setUsers] = useState<any[]>([]); // Sử dụng any[] nếu chưa xác định kiểu dữ liệu
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [students, setStudents] = useState<any[]>([]);
  const [currentPageStu, setCurrentPageStu] = useState(1);
  const [totalPagesStu, setTotalPagesStu] = useState(0);

  const [teachers, setTeachers] = useState<any[]>([]);
  const [currentPageTea, setCurrentPageTea] = useState(1);
  const [totalPagesTea, setTotalPagesTea] = useState(0);

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClerks, setTotalClerks] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const usersPerPage = 4;

  const stuPerPage = 4;
  const teaPerPage = 4;

  // Giả sử bạn có một mảng chứa tất cả ID của khóa học từ các trang
  const [allUserIds, setAllUserIds] = useState<Set<string>>(new Set());

  const [showModalRe, setShowModalRe] = useState(false);

  const [activeTab, setActiveTab] = useState("students"); // "students" or "teachers"

  const handleApprove = async (userId: string) => {
    setLoading(true); // Bắt đầu trạng thái loading
    const authToken = localStorage.getItem("authToken");

    try {
      console.log("Phê duyệt người dùng với ID:", userId);

      // Gửi yêu cầu API với query param là registerId
      const response = await axios.put(
        `http://localhost:8080/api/register/admin/confirm?registerId=${userId}`,
        {}, // Dữ liệu rỗng vì chỉ cần query param
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("Người dùng đã được phê duyệt thành công", response.data);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Phê duyệt thành công",
          text: "Người dùng đã được phê duyệt thành công!",
          timer: 8000,
          showConfirmButton: false,
        });

        window.location.reload();
      }

      // Gọi lại danh sách sau khi xác nhận
      await Promise.all([fetchStudents(), fetchTeachers()]);
    } catch (error: any) {
      console.error("Error approving user:", error);

      Swal.fire({
        icon: "error",
        title: "Phê duyệt thất bại",
        text:
          error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại!",
      });

      setError("Failed to approve user. Please try again."); // Hiển thị lỗi
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  const handleReject = async (userId: string) => {
    setLoading(true); // Bắt đầu trạng thái loading
    const authToken = localStorage.getItem("authToken");

    try {
      console.log("Từ chối người dùng với ID:", userId);

      // Gửi yêu cầu API với query param là registerId
      const response = await axios.put(
        `http://localhost:8080/api/register/admin/reject?registerId=${userId}`,
        {}, // Dữ liệu rỗng vì chỉ cần query param
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("Người dùng đã bị từ chối thành công", response.data);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Từ chối thành công",
          text: "Người dùng không được phê duyệt!",
          timer: 8000,
          showConfirmButton: false,
        });

        window.location.reload();
      }

      // Gọi lại danh sách sau khi xác nhận
      await Promise.all([fetchStudents(), fetchTeachers()]);
    } catch (error: any) {
      console.error("Error approving user:", error);

      Swal.fire({
        icon: "error",
        title: "Từ chối thất bại",
        text:
          error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại!",
      });

      setError("Failed to approve user. Please try again."); // Hiển thị lỗi
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  useEffect(() => {
    console.log("useEffect triggered. Current Page:", currentPage);

    const fetchUsers = async () => {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/clerk/get-list-user`,
          {
            params: {
              page: currentPage - 1, // Kiểm tra giá trị truyền vào API
              limit: usersPerPage,
              role: "STUDENT",
              filter: searchQuery,
            },
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        console.log("Fetched Users:", response.data); // Kiểm tra dữ liệu trả về

        setUsers(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
      } catch (err) {
        setError("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserCountsByRole = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/clerk/count-users-by-role`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        // Giả sử API trả về { students: X, clerks: Y, teachers: Z }
        setTotalStudents(response.data?.STUDENT || 0);
        setTotalClerks(response.data?.CLERK || 0);
        setTotalTeachers(response.data?.TEACHER || 0);
      } catch (err) {
        console.error("Error fetching user counts by role:", err);
      }
    };

    fetchUsers();
    fetchUserCountsByRole(); // Gọi hàm lấy số lượng người dùng
  }, [currentPage, searchQuery]);

  const fetchAllUsers = async () => {
    const authToken = localStorage.getItem("authToken");
    let allUsers: any[] = [];
    let currentPage = 0;

    try {
      // Lặp qua tất cả các trang để lấy dữ liệu
      while (true) {
        const response = await axios.get(
          `http://localhost:8080/api/user/clerk/get-list-user`,
          {
            params: {
              page: currentPage,
              limit: usersPerPage,
              role: "STUDENT",
              filter: "",
            },
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const users = response.data?.content || [];
        allUsers = [...allUsers, ...users];

        // Kiểm tra nếu đã tới trang cuối
        if (currentPage + 1 >= response.data?.totalPages) {
          break;
        }

        currentPage++;
      }

      // Cập nhật danh sách toàn bộ khóa học
      const allIds = new Set(allUsers.map((user) => user.id));
      setAllUserIds(allIds);

      console.log("Tất cả người dùng đã được fetch:", allUsers);
    } catch (error) {
      console.error("Error fetching all user:", error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/register/clerk/waiting-register`,
        {
          params: {
            page: currentPageStu - 1, // Kiểm tra giá trị truyền vào API
            limit: stuPerPage,
            role: "STUDENT",
          },
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log("Fetched Students:", response.data); // Kiểm tra dữ liệu trả về

      setStudents(response.data?.content || []);
      setTotalPagesStu(response.data?.totalPages || 0);
    } catch (err) {
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/register/clerk/waiting-register`,
        {
          params: {
            page: currentPageTea - 1, // Kiểm tra giá trị truyền vào API
            limit: teaPerPage,
            role: "TEACHER",
          },
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log("Fetched Teachers:", response.data); // Kiểm tra dữ liệu trả về

      setTeachers(response.data?.content || []);
      setTotalPagesTea(response.data?.totalPages || 0);
    } catch (err) {
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); // Gọi lại khi currentPageStu thay đổi
  }, [currentPageStu]);

  useEffect(() => {
    fetchTeachers(); // Gọi lại khi currentPageTea thay đổi
  }, [currentPageTea]);

  const handleApproveRegistration = async () => {
    setLoading(true); // Hiển thị trạng thái loading
    try {
      // Gọi cả hai hàm fetch
      await Promise.all([fetchStudents(), fetchTeachers()]);
      console.log("Successfully fetched students and teachers");
    } catch (error) {
      console.error("Error approving registration:", error);
      setError("Error fetching students and teachers."); // Hiển thị lỗi nếu xảy ra
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  // Gọi hàm này khi component được mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const Loading = () => (
    <div className="flex items-center justify-center h-full">
      <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
      <span className="ml-4 text-lg text-blue-500">Đang tải dữ liệu...</span>
    </div>
  );

  const onCreateUser = () => {
    setShowModal(true); // Show modal when "Tạo người dùng" is clicked
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Search query submitted:", searchQuery);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected filter:", event.target.value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Call handleInputChange for general field handling (to update the state for general fields)
    handleInputChange(e);

    // Specific logic for fields like 'address', 'email', 'name', and 'phone'
    if (name === "address") {
      setAddress(value); // Custom logic for address
    } else if (name === "email") {
      setEmail(value); // Custom logic for email
    } else if (name === "name") {
      setName(value); // Custom logic for name
    } else if (name === "phone") {
      setPhone(value); // Custom logic for phone
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve the token from local storage or global state
    const token = localStorage.getItem("authToken"); // Replace this with your actual token retrieval method

    // Map gender and role to the required values
    const payload = {
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      address: newUser.address,
      birthday: newUser.birthDate,
      gender: newUser.gender === "female" ? "FEMALE" : "MALE",
      role:
        newUser.role === "student"
          ? "STUDENT"
          : newUser.role === "teacher"
          ? "TEACHER"
          : "CLERK",
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/admin/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Authorization header here
          },
        }
      );

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

      // Close the modal after successful submission
      setShowModal(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data || "Lỗi hệ thống. Vui lòng thử lại.";
        Swal.fire({
          icon: "error",
          title: "Tạo tài khoản thất bại",
          text: message,
        });
      } else {
        const unexpectedError = "Lỗi hệ thống.";
        Swal.fire({
          icon: "error",
          title: "Tạo tài khoản thất bại",
          text: unexpectedError,
        });
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePreviousPage = () =>
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      console.log("Previous Page:", newPage); // Kiểm tra giá trị
      return newPage;
    });

  const handleNextPage = () =>
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, totalPages);
      console.log("Next Page:", newPage); // Kiểm tra giá trị
      return newPage;
    });

  const handlePreviousPageStu = () =>
    setCurrentPageStu((prev) => {
      const newPage = Math.max(prev - 1, 1);
      console.log("Previous Page:", newPage); // Kiểm tra giá trị
      return newPage;
    });

  const handleNextPageStu = () =>
    setCurrentPageStu((prev) => {
      const newPage = Math.min(prev + 1, totalPagesStu);
      console.log("Next Page:", newPage); // Kiểm tra giá trị
      return newPage;
    });

  const handlePreviousPageTea = () =>
    setCurrentPageTea((prev) => {
      const newPage = Math.max(prev - 1, 1);
      console.log("Previous Page:", newPage); // Kiểm tra giá trị
      return newPage;
    });

  const handleNextPageTea = () =>
    setCurrentPageTea((prev) => {
      const newPage = Math.min(prev + 1, totalPagesTea);
      console.log("Next Page:", newPage); // Kiểm tra giá trị
      return newPage;
    });

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSelectedUsers = new Set(prev);
      if (newSelectedUsers.has(userId)) {
        newSelectedUsers.delete(userId);
      } else {
        newSelectedUsers.add(userId);
      }
      return newSelectedUsers;
    });
  };

  const handleSelectAll = () => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.size === allUserIds.size) {
        // Nếu tất cả đã được chọn, thì bỏ chọn hết
        return new Set(); // Trả về trạng thái rỗng
      } else {
        // Chọn tất cả các úuer
        return new Set(allUserIds); // Trả về tất cả ID
      }
    });
  };

  const handleSelectButtonClick = () => {
    setIsSelectMode((prev) => {
      if (prev) {
        setSelectedUsers(new Set());
      }
      return !prev;
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = Math.min(3, totalPages);

    let start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    for (let i = start; i < start + maxPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  const getPageNumbersStu = () => {
    const pages = [];
    const maxPages = Math.min(3, totalPagesStu);

    let start = Math.max(1, Math.min(currentPageStu - 1, totalPagesStu - 2));
    for (let i = start; i < start + maxPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  const getPageNumbersTea = () => {
    const pages = [];
    const maxPages = Math.min(3, totalPagesTea);

    let start = Math.max(1, Math.min(currentPageTea - 1, totalPagesTea - 2));
    for (let i = start; i < start + maxPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  const totalUsers = totalStudents + totalTeachers + totalClerks;
  const isUserSelected = (userId: string) => selectedUsers.has(userId);

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Quản lý tài khoản người dùng
      </h2>
      <h2 className="text-xl tracking-tight mb-6">
        Tìm tất cả người dùng của nền tảng tại đây
      </h2>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mr-6">
        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số học viên
            </CardTitle>
            <FaUserGraduate className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              {totalStudents}
              <span className="ml-2 text-xs text-blue-600 border border-blue-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số giáo viên
            </CardTitle>
            <FaChalkboardTeacher className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              {totalTeachers}
              <span className="ml-2 text-xs text-green-600 border border-green-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số giáo vụ
            </CardTitle>
            <FaBuilding className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              {totalClerks}
              <span className="ml-2 text-xs text-red-600 border border-red-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mt-8 mr-6">
        <h2 className="text-2xl font-bold">
          Tổng số người dùng ({totalUsers})
        </h2>
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
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
            onChange={handleFilterChange}
            className="ml-4 border-2 border-gray-300 rounded-full px-4 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Lọc</option>
            <option value="student">Học viên</option>
            <option value="parents">Phụ huynh</option>
            <option value="teacher">Giáo viên</option>
            <option value="staff">Giáo vụ</option>
          </select>
        </form>
      </div>

      <div className="flex justify-between items-center space-x-4 mb-2 mt-6">
        {/* Select Mode Button */}
        <div className="flex">
          <Button onClick={handleSelectButtonClick} className="mr-4">
            {isSelectMode ? "Hủy bỏ" : "Chọn nhiều"}
          </Button>

          {/* Conditional buttons for Delete All and Move All */}
          {isSelectMode && (
            <div className="flex">
              <Button className="bg-red-500 text-white mr-2">Xóa tất cả</Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 pr-6">
          <Button
            onClick={() => {
              setShowModalRe(true); // Hiển thị modal
              handleApproveRegistration(); // Gọi hàm khi mở modal
            }}
            type="button"
            className="pl-6 pr-6">
            Duyệt đăng ký
          </Button>
          <Button onClick={onCreateUser} type="button" className="pl-6 pr-6">
            Tạo người dùng
          </Button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg">
            <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Tạo người dùng mới
            </h3>

            <form onSubmit={handleSubmitModal} className="space-y-6">
              {/* Floating Label for Email */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
            focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
            placeholder-transparent"
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, email: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, email: false }))
                  }
                  placeholder="Nhập địa chỉ email"
                  required
                />
                <Label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 ${
                    isFocused.email || email
                      ? "-top-3.5 text-xs text-indigo-600 bg-white px-1"
                      : "top-1/2 transform -translate-y-1/2 text-gray-400"
                  }`}>
                  Nhập địa chỉ email <span className="text-red-500">*</span>
                </Label>
              </div>

              {/* Floating Label for Name */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
            focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
            placeholder-transparent"
                  type="text"
                  id="name"
                  value={newUser.name}
                  name="name"
                  onChange={handleChange}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, name: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, name: false }))
                  }
                  placeholder="Nhập tên người dùng"
                  required
                />
                <Label
                  htmlFor="name"
                  className={`absolute left-4 transition-all duration-200 ${
                    isFocused.name || name
                      ? "-top-3.5 text-xs text-indigo-600 bg-white px-1"
                      : "top-1/2 transform -translate-y-1/2 text-gray-400"
                  }`}>
                  Nhập tên người dùng <span className="text-red-500">*</span>
                </Label>
              </div>

              {/* Floating Label for Phone*/}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
            focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
            placeholder-transparent"
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, phone: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, phone: false }))
                  }
                  placeholder="Nhập số điện thoại"
                  required
                />
                <Label
                  htmlFor="phone"
                  className={`absolute left-4 transition-all duration-200 ${
                    isFocused.phone || phone
                      ? "-top-3.5 text-xs text-indigo-600 bg-white px-1"
                      : "top-1/2 transform -translate-y-1/2 text-gray-400"
                  }`}>
                  Nhập số điện thoại <span className="text-red-500">*</span>
                </Label>
              </div>

              {/* Floating Label for Address */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
            focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
            placeholder-transparent"
                  type="text"
                  id="address"
                  name="address"
                  value={newUser.address}
                  onChange={handleChange}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, address: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, address: false }))
                  }
                  placeholder="Nhập địa chỉ"
                  required
                />
                <Label
                  htmlFor="address"
                  className={`absolute left-4 transition-all duration-200 ${
                    isFocused.address || address
                      ? "-top-3.5 text-xs text-indigo-600 bg-white px-1"
                      : "top-1/2 transform -translate-y-1/2 text-gray-400"
                  }`}>
                  Nhập địa chỉ <span className="text-red-500">*</span>
                </Label>
              </div>

              {/* Floating Label for Gender */}
              <div className="relative mb-6">
                <select
                  id="gender"
                  name="gender"
                  value={newUser.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
    focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
    placeholder-transparent">
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                <label
                  htmlFor="gender"
                  className="absolute left-4 transition-all duration-200 -top-3.5 text-xs text-indigo-600 bg-white px-1">
                  Giới tính
                </label>
              </div>

              {/* Floating Label for Role */}
              <div className="relative mb-6">
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
                  focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
                  placeholder-transparent"
                  required>
                  <option value="">Chọn chức vụ</option>
                  <option value="student">Học viên</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="staff">Giáo vụ</option>
                </select>
                <label
                  htmlFor="role"
                  className="absolute left-4 transition-all duration-200 -top-3.5 text-xs text-indigo-600 bg-white px-1">
                  Chức vụ
                </label>
              </div>

              {/* Floating Label for Birthdate */}
              <div className="relative mb-6">
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={newUser.birthDate}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
            focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
                  required
                />
                <label
                  htmlFor="birthDate"
                  className="absolute left-4 transition-all duration-200 -top-3.5 text-xs text-indigo-600 bg-white px-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 focus:outline-none 
            focus:ring-2 focus:ring-gray-600 transition duration-200">
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none 
            focus:ring-2 focus:ring-indigo-500 transition duration-200">
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 max-h-[400px] mr-6">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {isSelectMode && (
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === users.length} // Compare to total users, not paginatedUsers
                    onChange={handleSelectAll}
                    className="form-checkbox"
                  />
                </th>
              )}

              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Họ tên
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                Mã số
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                Chức vụ
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isSelectMode ? 7 : 6} className="text-center py-4">
                  <Loading />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b ${
                    isUserSelected(user.name) ? "bg-blue-100" : "bg-white"
                  }`}>
                  {isSelectMode && (
                    <td className="py-2 px-4">
                      <input
                        type="checkbox"
                        checked={isUserSelected(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="form-checkbox"
                      />
                    </td>
                  )}

                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {user.genId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span
                      className={
                        user.isActive
                          ? "text-green-600 font-semibold"
                          : "text-gray-500"
                      }>
                      {user.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 flex justify-center items-center space-x-3 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-800">
                      <FiLock className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end mt-6 mr-6 space-x-2">
        <button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={currentPage === 1}>
          Trước
        </button>

        {totalPages === 1 ? (
          <Button
            key={1}
            onClick={() => setCurrentPage(1)}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              currentPage === 1
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            1
          </Button>
        ) : (
          getPageNumbers().map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                currentPage === page
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              {page}
            </Button>
          ))
        )}

        <Button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={currentPage === totalPages}>
          Sau
        </Button>
      </div>

      {/* Modal Register */}
      {showModalRe && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModalRe(false)} // Close modal when clicking outside
        >
          <div
            className="bg-white p-12 rounded-xl w-4/5 max-w-6xl overflow-y-auto shadow-2xl transform transition-all ease-in-out duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">
                Thông tin người dùng cần xác nhận
              </h2>
              <button
                onClick={() => setShowModalRe(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl">
                <FaTimes />
              </button>
            </div>

            {/* Tab Buttons */}
            <div className="flex space-x-4 border-b mb-6">
              <button
                className={`py-2 px-4 text-lg font-semibold ${
                  activeTab === "students"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("students")}>
                Học viên
              </button>
              <button
                className={`py-2 px-4 text-lg font-semibold ${
                  activeTab === "teachers"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("teachers")}>
                Giáo viên
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "students" && (
              <>
                <table className="w-full table-auto mb-8">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-3 px-6 text-left text-gray-700">Tên</th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Email
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Địa chỉ
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Ngày sinh
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Số điện thoại
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Giới tính
                      </th>

                      <th className="py-3 px-6 text-center text-gray-700">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 border-b text-gray-600">
                          {student.name}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {student.email}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {student.address}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {new Date(student.birthday).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {student.phone}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {student.gender}
                        </td>
                        <td className="py-4 px-6 border-b text-center">
                          <div className="flex">
                            <button
                              onClick={() => handleApprove(student.id)}
                              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200">
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(student.id)}
                              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 ml-4">
                              <FaTimes />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Section */}
                <div className="flex justify-end mt-6 mr-6 space-x-2">
                  <button
                    onClick={handlePreviousPageStu}
                    className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
                      currentPageStu === 1
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={currentPageStu === 1}>
                    Trước
                  </button>

                  {totalPagesStu === 1 ? (
                    <button
                      key={1}
                      onClick={() => setCurrentPageStu(1)}
                      className={`px-4 py-2 rounded-md font-semibold transition-all ${
                        currentPageStu === 1
                          ? "bg-blue-700 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}>
                      1
                    </button>
                  ) : (
                    getPageNumbersStu().map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPageStu(page)}
                        className={`px-4 py-2 rounded-md font-semibold transition-all ${
                          currentPageStu === page
                            ? "bg-blue-700 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}>
                        {page}
                      </button>
                    ))
                  )}

                  <button
                    onClick={handleNextPageStu}
                    className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
                      currentPageStu === totalPagesStu
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={currentPageStu === totalPagesStu}>
                    Sau
                  </button>
                </div>
              </>
            )}

            {activeTab === "teachers" && (
              <>
                <table className="w-full table-auto mb-8">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-3 px-6 text-left text-gray-700">Tên</th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Email
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Địa chỉ
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Ngày sinh
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Số điện thoại
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Giới tính
                      </th>
                      <th className="py-3 px-6 text-center text-gray-700">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.name}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.email}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.address}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {new Date(teacher.birthday).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.phone}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.gender}
                        </td>
                        <td className="py-4 px-6 border-b text-center">
                          <div className="flex">
                            <button
                              onClick={() => handleApprove(teacher.id)}
                              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200">
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(teacher.id)}
                              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 ml-4">
                              <FaTimes />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Section */}
                <div className="flex justify-end mt-6 mr-6 space-x-2">
                  <button
                    onClick={handlePreviousPageTea}
                    className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
                      currentPageTea === 1
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={currentPageTea === 1}>
                    Trước
                  </button>

                  {totalPagesTea === 1 ? (
                    <button
                      key={1}
                      onClick={() => setCurrentPageTea(1)}
                      className={`px-4 py-2 rounded-md font-semibold transition-all ${
                        currentPageTea === 1
                          ? "bg-blue-700 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}>
                      1
                    </button>
                  ) : (
                    getPageNumbersTea().map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPageTea(page)}
                        className={`px-4 py-2 rounded-md font-semibold transition-all ${
                          currentPageTea === page
                            ? "bg-blue-700 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}>
                        {page}
                      </button>
                    ))
                  )}

                  <button
                    onClick={handleNextPageTea}
                    className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
                      currentPageTea === totalPagesTea
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={currentPageTea === totalPagesTea}>
                    Sau
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AccountPage;
