"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import SessionManagement from "@/app/ui/components/admin/branches/Session";
import { addBranch, getAllBranches } from "@/app/lib/services/branch";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { FiFilter } from "react-icons/fi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Pagination from "@/app/ui/components/_common/Pagination";
import { Branch, Session } from "@/app/types/type";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { BsTags } from "react-icons/bs";

const BranchPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranches(0, 100);
        const modifiedData = response.data.content
          .map((item: Branch) => ({
            ...item,
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

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  const [newSession] = useState<Session>({
    id: "",
    name: "",
    startTime: "",
    endTime: "",
  });
  const [newBranch, setNewBranch] = useState({
    id: "",
    name: "",
    address: "",
    contactNumber: "",
    rooms: "",
    sessions: [newSession],
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

  const handleSearch = (term: string) => {
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
    try {
      const response = await addBranch(newBranch);
      setBranches((prevBranches) => [...prevBranches, response.data]);
      setFilteredBranches((prevBranches) => [...prevBranches, response.data]);
      toast.success("Thêm chi nhánh thành công", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
      setTimeout(() => {
        window.location.href = "/admin/branches";
      }, 3000);
    } catch (error) {
      console.error("Failed to create branch:", error);
      toast.error("Thêm chi nhánh thất bại", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    }

    setNewBranch({
      id: "",
      name: "",
      address: "",
      contactNumber: "",
      rooms: "",
      sessions: [newSession],
    });
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setNewBranch({
      id: "",
      name: "",
      address: "",
      contactNumber: "",
      rooms: "",
      sessions: [newSession],
    });
    setShowModal(false);
  };

  const toggleSessionsPopup = (branchId: string) => {
    setActiveBranchId((prev) => (prev === branchId ? null : branchId));
  };

  return (
    <>
      <ToastContainer />
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold mb-4">
            Tổng số chi nhánh ({filteredBranches.length})
          </div>

          <Button
            onClick={onCreateBranch}
            className="px-6 py-3 rounded-2xl text-[15px]"
          >
            Thêm chi nhánh
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 gap-14">
          <SearchField
            className="w-full bg-primary-lighter py-[2px] rounded-2xl"
            placeholder="Tìm kiếm chi nhánh..."
            onSearch={handleSearch}
          />
          <div className="flex items-center gap-6 px-4">
            <div className="flex items-center gap-3 cursor-pointer">
              Lọc
              <FiFilter className="w-5 h-5" />
            </div>
            <div className="flex items-center cursor-pointer">
              <HiAdjustmentsHorizontal className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Branch List */}
        <div className="overflow-x-auto mt-4 rounded-lg">
          <table className="min-w-full table-auto border-collapse rounded-lg">
            <thead className="bg-slate-100">
              <tr>
                <th className="pl-8 pr-3 py-3 text-left text-sm font-semibold text-gray-600">
                  Tên chi nhánh
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-600">
                  Địa chỉ
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-600">
                  Số điện thoại
                </th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  Số phòng học
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                  Các ca học
                </th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  Giáo vụ
                </th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBranches.map((branch: Branch) => (
                <tr
                  key={branch.id || branch.name}
                  className="border-b bg-white"
                >
                  <td className="pl-8 pr-3 py-4 text-sm text-gray-700">
                    {branch.name}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-700">
                    {branch.address}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-700">
                    {branch.contactNumber}
                  </td>
                  <td className="px-3 py-4 text-sm text-center text-gray-700">
                    {branch.rooms}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {/* {branch.sessions.map((session) => session.name).join(", ")} */}
                    <div className="relative flex justify-center">
                      <div
                        className="px-2 py-1 cursor-pointer rounded-lg"
                        onMouseEnter={() => toggleSessionsPopup(branch.id)}
                        onMouseLeave={() => toggleSessionsPopup(branch.id)}
                      >
                        <BsTags className="w-5 h-5 text-primary-darker font-bold hover:text-primary-darkest" />
                      </div>
                    </div>
                    {activeBranchId === branch.id && (
                      <div
                        className="bg-white border border-gray-100 rounded-lg 
                              shadow-lg absolute max-h-[150px] overflow-y-auto w-[180px] z-10"
                      >
                        <ul>
                          {branch.sessions.length > 0 ? (
                            branch.sessions.map((session) => (
                              <li
                                key={session.id}
                                className="px-4 py-2 hover:bg-slate-50"
                              >
                                {session.name}: {session.startTime.slice(0, 5)}{" "}
                                - {session.endTime.slice(0, 5)}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2">Không có ca học nào</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageClick={(page) => setCurrentPage(page)}
            handlePreviousPage={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            handleNextPage={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </div>

        {/* Modal for Adding Branch */}
        {showModal && (
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg"
            >
              <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
                Thêm chi nhánh mới
              </h3>
              <form
                onSubmit={handleSubmitModal}
                className="flex flex-col gap-4"
              >
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
                <Input
                  name="sessions"
                  placeholder="Các ca học (vd: Ca 1, Ca 2)"
                  value={newBranch.sessions[0].name}
                  onChange={handleModalInputChange}
                />
                <div className="flex justify-end mt-2 gap-4">
                  <Button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-sm"
                    onClick={handleCloseModal}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="text-sm">
                    Thêm
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <SessionManagement />
    </>
  );
};

export default BranchPage;
