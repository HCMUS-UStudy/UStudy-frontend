"use client";
import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import { Input } from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";

const initialShifts = [
  { id: "shift-1", name: "Ca 1", days: "2-4-6", time: "08:00 - 10:00" },
  { id: "shift-2", name: "Ca 2", days: "2-4-6", time: "10:30 - 12:30" },
  { id: "shift-3", name: "Ca 3", days: "2-4-6", time: "14:00 - 16:00" },
];

const branches = Array.from({ length: 5 }, (_, index) => ({
  id: `branch-${index}`,
  name: `Chi nhánh ${index + 1}`,
  address: `Địa chỉ ${index + 1}`,
  phone: `012345678${index}`,
  classrooms: 20,
  shifts: `Ca 1, Ca 2, Ca 3`,
}));

const BranchPage: React.FC = () => {
  const [shifts, setShifts] = useState(initialShifts);
  const [editShift, setEditShift] = useState<null | { id: string; days: string, time: string }>(
    null
  );

  const handleEditShift = (shiftId: string, days: string, time: string) => {
    setEditShift({ id: shiftId, days, time });
  };

  const handleShiftChange = (event: React.ChangeEvent<HTMLInputElement>, field: "days" | "time") => {
    setEditShift((prev) =>
      prev ? { ...prev, [field]: event.target.value } : null
    );
  };

  const saveShiftChanges = () => {
    if (editShift) {
      setShifts((prev) =>
        prev.map((shift) =>
          shift.id === editShift.id ? { ...shift, days: editShift.days, time: editShift.time } : shift
        )
      );
      setEditShift(null);
    }
  };


  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    phone: "",
    classrooms: "",
    shifts: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const branchesPerPage = 5;

  const totalPages = Math.ceil(branches.length / branchesPerPage);
  const startIndex = (currentPage - 1) * branchesPerPage;
  const paginatedBranches = branches.slice(startIndex, startIndex + branchesPerPage);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onCreateBranch = () => {
    setShowModal(true);
  };

  const handleModalInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setNewBranch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New branch details:", newBranch);
    setNewBranch({
      name: "",
      address: "",
      phone: "",
      classrooms: "",
      shifts: "",
    });
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setNewBranch({
      name: "",
      address: "",
      phone: "",
      classrooms: "",
      shifts: "",
    });
    setShowModal(false);
  };

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight mt-4 mb-1">Quản lý chi nhánh</h2>
      {/* <h2 className="text-xl tracking-tight mb-6">
        Tìm tất cả chi nhánh tại đây
      </h2> */}

      <div className="flex items-center justify-between mt-8">
        <form className="flex items-center w-full lg:w-[20rem]">
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
        </form>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Các ca học
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBranches.map((branch) => (
              <tr key={branch.id} className="border-b bg-white">
                <td className="px-6 py-4 text-sm text-gray-700">{branch.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{branch.address}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{branch.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {branch.classrooms}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{branch.shifts}</td>
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
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Next
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
                name="phone"
                placeholder="Số điện thoại"
                value={newBranch.phone}
                onChange={handleModalInputChange}
                required
              />
              <Input
                name="classrooms"
                placeholder="Số phòng học"
                value={newBranch.classrooms}
                onChange={handleModalInputChange}
                required
              />
              <Input
                name="shifts"
                placeholder="Các ca học (vd: Ca 1, Ca 2)"
                value={newBranch.shifts}
                onChange={handleModalInputChange}
                required
              />
              <div className="flex justify-between mt-8">
                <Button type="button" onClick={handleCloseModal} className="bg-gray-300">
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

      <h3 className="text-2xl font-semibold mt-12 mb-6">Định nghĩa giờ học</h3>
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
            {shifts.map((shift) => (
              <tr key={shift.id} className="border-b bg-white">
                <td className="px-6 py-4 text-sm text-gray-700">{shift.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editShift?.id === shift.id ? (
                    <input
                      type="text"
                      value={editShift.days}
                      onChange={(e) => handleShiftChange(e, "days")}
                      className="border border-gray-300 rounded p-1.5"
                    />
                  ) : (
                    shift.days
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editShift?.id === shift.id ? (
                    <input
                      type="text"
                      value={editShift.time}
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
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditShift(null)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditShift(shift.id, shift.days, shift.time)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit className="h-5 w-5 ml-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BranchPage;
