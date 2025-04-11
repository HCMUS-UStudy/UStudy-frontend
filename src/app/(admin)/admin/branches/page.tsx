"use client";
import React, { Suspense, useEffect, useState } from "react";
// import { FaEdit, FaTrashAlt } from "react-icons/fa";
// import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import { addBranch, getAllBranches } from "@/app/lib/services/branch";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { FiFilter } from "react-icons/fi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Pagination from "@/app/ui/components/_common/Pagination";
import { Branch, Session } from "@/app/types";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { setSelectedBranch, setBranches } from "@/app/store/branch-slice";
import Modal from "@/app/ui/components/admin/branches/AddBranchModal";

const BranchPage: React.FC = () => {
  const { branches } = useSelector((state: RootState) => state.branch);
  const [branches_, setBranches_] = useState<Branch[]>(branches);

  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBranches = async () => {
      if (branches.length > 0) return;
      try {
        const response = await getAllBranches(0, 100);
        const modifiedData = [...response.content].sort(
          (a: Branch, b: Branch) => a.name.localeCompare(b.name),
        );
        setBranches_(modifiedData);
        dispatch(setBranches(modifiedData));
        setFilteredBranches(modifiedData);

        if (modifiedData.length > 0) {
          dispatch(setSelectedBranch(modifiedData[0].id));
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };
    fetchBranches();
  }, [branches.length, dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newSession] = useState<Session>({
    id: "",
    name: "",
    startTime: "",
    endTime: "",
  });
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    contactNumber: "",
    rooms: "",
    sessions: [newSession],
  });

  useEffect(() => {
    const filtered = branches_.filter(
      (branch) =>
        branch.name &&
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredBranches(filtered);
    setCurrentPage(1); // Reset to page 1 after filtering
  }, [searchQuery, branches_]);

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
      // setBranches_((prevBranches) => [...prevBranches, response.data.branch]);
      setFilteredBranches((prevBranches) => [...prevBranches, response.data]);
      toast.success("Thêm chi nhánh thành công", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
      setTimeout(() => {
        router.push(`/admin/branches`);
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
      name: "",
      address: "",
      contactNumber: "",
      rooms: "",
      sessions: [newSession],
    });
    setShowModal(false);
  };

  const handleDetail = (branch: Branch) => {
    router.push(`/admin/branches/${branch.id}`);
  };

  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold mb-4">
            Tổng số chi nhánh ({filteredBranches.length})
          </div>

          <Button
            onClick={onCreateBranch}
            className="px-6 py-3 rounded-2xl text-[15px] z-10"
          >
            Thêm chi nhánh
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 gap-14">
          <Suspense>
            <SearchField
              className="w-full bg-primary-lighter py-[2px] rounded-2xl"
              placeholder="Tìm kiếm chi nhánh..."
              onSearch={handleSearch}
            />
          </Suspense>
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
                {/* <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  Hành động
                </th> */}
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  <div></div>
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

                  {/* <td className="px-3 py-4">
                    <div className="flex justify-center items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </td> */}
                  <td className="pl-3 py-4 text-sm underline text-center cursor-pointer text-primary-darker">
                    <div onClick={() => handleDetail(branch)}>Xem chi tiết</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
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
          <Modal
            handleCloseModal={handleCloseModal}
            handleSubmitModal={handleSubmitModal}
            handleModalInputChange={handleModalInputChange}
            newBranch={newBranch}
            setNewBranch={setNewBranch}
          />
        )}
      </div>
    </>
  );
};

export default BranchPage;
