/* eslint-disable prettier/prettier */
"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
// import axios from "axios";
import { addBranch, getAllBranches } from "@/app/lib/services/branch";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";

interface Branch {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  rooms: number;
  // shifts: string;
}

interface BranchResponse {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
}

// interface Shift {
//   id: string;
//   name: string;
//   day: string;
//   time: string;
// }

// interface ShiftResponse {
//   day: string;
//   time: string;
// }

// const api = axios.create({
//   baseURL: "http://localhost:8080/api", // Đặt base URL cho API
//   timeout: 10000, // Timeout 10 giây
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": "Bearer " + localStorage.getItem("authToken"),
//   },
//   params: {
//     "page": 0,
//     "limit": 10
//   }
// });

const BranchPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  // const [shifts, setShifts] = useState<Shift[]>([]);
  // const [editShift, setEditShift] = useState<Shift | null>({ id: "", name: "", day: "", time: "" });

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // const response = await api.get("/branch/clerk/get-all");
        const response = await getAllBranches(0, 20);
        const modifiedData = response.data.content
          .map((item: BranchResponse) => ({
            ...item, // Giữ nguyên các cột ban đầu
            rooms: 10, // Số phòng học cố định
          }))
          .sort((a: Branch, b: Branch) => a.name.localeCompare(b.name));
        setBranches(modifiedData);
        setFilteredBranches(modifiedData);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // useEffect(() => {
  //   const fetchShifts = async () => {
  //     try {
  //       const response = await api.get("/time/admin/get");
  //       const modifiedData = response.data.map((item: ShiftResponse) => ({
  //         name: formatShiftName(item.day, item.time), // Cột mới kết hợp `id` và `name`
  //         ...item, // Giữ nguyên các cột ban đầu
  //       }));
  //       setShifts(modifiedData);
  //     } catch (error) {
  //       console.error("Failed to fetch time:", error);
  //     }
  //   };
  //   fetchShifts();
  // }, []);

  // const handleEditShift = (shiftId: string, name: string, day: string, time: string) => {
  //   setEditShift({ id: shiftId, name, day, time });
  // };

  // const handleShiftChange = (event: React.ChangeEvent<HTMLInputElement>, field: "day" | "time") => {
  //   setEditShift((prev) =>
  //     prev ? { ...prev, [field]: event.target.value } : null
  //   );
  // };

  // const saveShiftChanges = () => {
  //   if (editShift) {
  //     setShifts((prev) =>
  //       prev.map((shift) =>
  //         shift.id === editShift.id ? { ...shift, day: editShift.day, time: editShift.time } : shift
  //       )
  //     );
  //     setEditShift(null);
  //   }
  // };

  // const [showShiftModal, setShowShiftModal] = useState(false);
  // const [newShift, setNewShift] = useState({
  //   name: "",
  //   day: "",
  //   time: "",
  // });

  // const createShift = async (shift: { name: string; day: string; time: string }) => {
  //   try {
  //     const response = await api.post("/time/admin/add", shift);
  //     setShifts((prev) => [...prev, response.data]); // Thêm shift mới vào danh sách
  //     setShowShiftModal(false); // Đóng modal
  //     setIsError(false);
  //     setMessage("Thêm ca học thành công!");
  //     setTimeout(() => setMessage(null), 3000);
  //   } catch (error) {
  //     console.error("Failed to create shift:", error);
  //     setIsError(true);
  //     setMessage("Thêm ca học thất bại. Vui lòng thử lại!");
  //     setTimeout(() => setMessage(null), 3000);
  //   }
  // };

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    contactNumber: "",
    rooms: "",
    // shifts: "",
  });

  useEffect(() => {
    const filtered = branches.filter(
      (branch) =>
        branch.name &&
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredBranches(filtered);
    setCurrentPage(1); // Reset to page 1 after filtering
  }, [searchQuery, branches]);

  // const sortShiftsByDayTime = (shifts: Shift[]) => {
  //   return [...shifts].sort((a, b) => {
  //     // So sánh theo `day` trước
  //     const dayComparison = a.day.localeCompare(b.day);
  //     if (dayComparison !== 0) {
  //       return dayComparison; // Nếu khác ngày, trả về kết quả sắp xếp theo `day`
  //     }
  //     // Nếu cùng ngày, so sánh tiếp theo `time`
  //     return a.time.localeCompare(b.time);
  //   });
  // };

  // const formatShiftName = (day: string, time: string): string => {
  //   let timePrefix = '';

  //   // Xác định prefix dựa trên thời gian
  //   if (time === "17:00 - 19:00") {
  //     timePrefix = 'C';
  //   } else if (time === "19:00 - 21:00") {
  //     timePrefix = 'T';
  //   } else if (time === "8:00 - 11:00") {
  //     timePrefix = 'S';
  //   } else if (time === "14:00 - 17:00") {
  //     timePrefix = 'C';
  //   } else if (time === "17:00 - 20:00") {
  //     timePrefix = 'T';
  //   } else {
  //     timePrefix = 'S';
  //   }

  //   // Loại bỏ ký tự '-' trong ngày và ghép với prefix
  //   const formattedDay = day.replace(/-/g, '').toUpperCase();
  //   return `${timePrefix}-${formattedDay}`;
  // };

  const [currentPage, setCurrentPage] = useState(1);
  const branchesPerPage = 5;

  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    setTotalPages(Math.ceil(filteredBranches.length / branchesPerPage));
  }, [filteredBranches]);
  const [paginatedBranches, setPaginatedBranches] = useState<Branch[]>([]);
  useEffect(() => {
    const startIndex = (currentPage - 1) * branchesPerPage;
    setPaginatedBranches(
      filteredBranches.slice(startIndex, startIndex + branchesPerPage),
    );
  }, [filteredBranches, currentPage]);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = Math.min(3, totalPages);

    const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    for (let i = start; i < start + maxPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("Search query:", event.target.value);
  //   setSearchQuery(event.target.value);
  // };

  const handleSearch = (term: string) => {
    console.log("Search query:", term);
    setSearchQuery(term);
  };

  const onCreateBranch = () => {
    setShowModal(true);
  };

  const handleModalInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setNewBranch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call API to create new branch
    try {
      // const response = await api.post("/branch/admin/add", newBranch);
      const response = await addBranch(newBranch);
      setBranches((prevBranches) => [
        ...prevBranches,
        { ...response.data, rooms: parseInt(newBranch.rooms, 10) },
      ]);

      setFilteredBranches((prevBranches) => [
        ...prevBranches,
        { ...response.data, rooms: parseInt(newBranch.rooms, 10) },
      ]);

      setIsError(false);
      setMessage("Thêm chi nhánh thành công!");

      setTimeout(() => {
        window.location.href = "/admin/branches";
      }, 3000);
    } catch (error) {
      console.error("Failed to create branch:", error);
      setIsError(true);
      setMessage("Thêm chi nhánh thất bại. Vui lòng thử lại!");
      setTimeout(() => setMessage(null), 3000);
    }

    setNewBranch({
      name: "",
      address: "",
      contactNumber: "",
      rooms: "",
      // shifts: "",
    });
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setNewBranch({
      name: "",
      address: "",
      contactNumber: "",
      rooms: "",
      // shifts: "",
    });
    setShowModal(false);
  };

  return (
    <>
      {message && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: isError ? "#f44336" : "#4caf50", // Màu thay đổi tùy trạng thái
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}

      {/* <h2 className="text-3xl font-bold tracking-tight mt-4 mb-1">
        Quản lý chi nhánh
      </h2> */}

      <div className="flex items-center justify-between mt-8">
        {/*<form className="flex items-center w-full lg:w-[20rem]">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm chi nhánh..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-l-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-full bg-white text-black hover:bg-slate-100 focus:ring-2 focus:ring-blue-300"
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
        </form>*/}
        <SearchField
          className="w-[200px]"
          placeholder="Tìm kiếm chi nhánh..."
          onSearch={handleSearch}
        />
        <Button onClick={onCreateBranch} className="px-6 py-2">
          Thêm chi nhánh
        </Button>
      </div>

      {/* Branch List */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Tên chi nhánh
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Số phòng học
              </th>
              {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Các ca học
              </th> */}
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBranches.map((branch: Branch) => (
              <tr key={branch.id || branch.name} className="border-b bg-white">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {branch.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {branch.address}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {branch.contactNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">10</td>
                {/* <td className="px-6 py-4 text-sm text-gray-700">
                  {branch.shifts}
                </td> */}
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrashAlt className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6 space-x-2">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Trước
        </Button>
        {totalPages === 1 ? (
          <Button
            key={1}
            onClick={() => setCurrentPage(1)}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              currentPage === 1
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
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
              }`}
            >
              {page}
            </Button>
          ))
        )}
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Sau
        </Button>
      </div>

      {/* Modal for Adding Branch */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg">
            <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Thêm chi nhánh mới
            </h3>
            <form onSubmit={handleSubmitModal} className="space-y-6">
              <Input
                name="name"
                placeholder="Tên chi nhánh"
                value={newBranch.name}
                onChange={handleModalInputChange}
                required
              />
              <Input
                name="address"
                placeholder="Địa chỉ"
                value={newBranch.address}
                onChange={handleModalInputChange}
                required
              />
              <Input
                name="contactNumber"
                placeholder="Số điện thoại"
                value={newBranch.contactNumber}
                onChange={handleModalInputChange}
                required
              />
              <Input
                name="rooms"
                placeholder="Số phòng học"
                value={newBranch.rooms}
                onChange={handleModalInputChange}
                required
              />
              {/* <Input
                name="shifts"
                placeholder="Các ca học (vd: Ca 1, Ca 2)"
                value={newBranch.shifts}
                onChange={handleModalInputChange}
                required
              /> */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300"
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-indigo-600">
                  Thêm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* {showShiftModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg">
            <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Thêm ca học mới
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // setShifts((prev) => [...prev, { id: `shift-${Date.now()}`, ...newShift }]);
                createShift(newShift);  
                setNewShift({ name: "", day: "", time: "" });
                setShowShiftModal(false);
              }}
              className="space-y-6"
            >
              <Input
                name="name"
                placeholder="Tên ca học"
                value={newShift.name}
                onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                required
              />
              <Input
                name="day"
                placeholder="Ngày học (vd: 2-4-6)"
                value={newShift.day}
                onChange={(e) => setNewShift({ ...newShift, day: e.target.value })}
                required
              />
              <Input
                name="time"
                placeholder="Giờ học (vd: 08:00 - 10:00)"
                value={newShift.time}
                onChange={(e) => setNewShift({ ...newShift, time: e.target.value })}
                required
              />
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  onClick={() => setShowShiftModal(false)}
                  className="bg-gray-300"
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-indigo-600">
                  Thêm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      {/* <div className="flex items-center justify-between mt-20 mb-6">
        <h3 className="text-2xl font-semibold">Định nghĩa ca học</h3>
        <Button onClick={() => setShowShiftModal(true)} className="px-6 py-2">
          Thêm ca học
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Tên ca học
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Ngày học
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Giờ học
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {sortShiftsByDayTime(shifts).map((shift: Shift) => (
              <tr key={shift.id} className="border-b bg-white">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {shift.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editShift?.id === shift.id ? (
                    <input
                      type="text"
                      value={editShift?.day || ""}
                      onChange={(e) => handleShiftChange(e, "day")}
                      className="border border-gray-300 rounded p-1.5"
                    />
                  ) : (
                    shift.day.toUpperCase()
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editShift?.id === shift.id ? (
                    <input
                      type="text"
                      value={editShift.time || ""}
                      onChange={(e) => handleShiftChange(e, "time")}
                      className="border border-gray-300 rounded p-1.5"
                    />
                  ) : (
                    shift.time
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editShift?.id === shift.id ? (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={saveShiftChanges}
                        className="text-blue-600 hover:text-blue-800 font-semibold">
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditShift(null)}
                        className="text-red-600 hover:text-red-800 font-semibold">
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-3 ml-2">
                      <button
                        onClick={() => handleEditShift(shift.id, shift.name, shift.day, shift.time)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </>
  );
};

export default BranchPage;
