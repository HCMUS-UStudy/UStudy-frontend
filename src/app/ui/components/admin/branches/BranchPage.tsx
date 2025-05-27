"use client";
import React, { Suspense, useEffect, useState } from "react";
// import { FaEdit, FaTrashAlt } from "react-icons/fa";
// import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import { getAllBranches } from "@/app/lib/services/branch";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { FiFilter } from "react-icons/fi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Pagination from "@/app/ui/components/_common/Pagination";
import { Branch } from "@/app/types";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setBranches } from "@/app/store/branch-slice";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { Eye } from "lucide-react";
import CreateBranchModal from "@/app/ui/components/admin/branches/AddBranchModal";

const BranchPage = () => {
  // const { branches } = useSelector((state: RootState) => state.branch);
  // const [branches_, setBranches_] = useState<Branch[]>(branches);

  // const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();

  const { data: fetchBranches, isLoading } = useQuery({
    queryKey: ["Branches", currentPage - 1, searchParams?.get("name") || ""],
    queryFn: () =>
      getAllBranches(currentPage - 1, 5, searchParams?.get("name") || ""),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    console.log(fetchBranches);
    if (fetchBranches?.content) {
      dispatch(setBranches(fetchBranches.content));
    }
  }, [fetchBranches, dispatch]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const onCreateBranch = () => {
    setShowModal(true);
  };

  const handleDetail = (branch: Branch) => {
    router.push(`/admin/branches/${branch.id}`);
  };

  return (
    <Suspense>
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold mb-4">
            Tổng số chi nhánh ({fetchBranches?.totalElements})
          </div>

          <Button onClick={onCreateBranch} className="px-6">
            Thêm chi nhánh
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 gap-14">
          <Suspense>
            <SearchField
              className="w-full"
              placeholder="Tìm kiếm chi nhánh..."
              queryKey="name"
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
          <Table>
            <TableHeader
              columns={[
                "Tên chi nhánh",
                "Địa chỉ",
                "Số điện thoại",
                "Số phòng học",
                "Hành động",
              ]}
            />
            <TableBody isLoading={isLoading}>
              {fetchBranches?.content
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.contactNumber}</TableCell>
                    <TableCell>{item.rooms}</TableCell>
                    <TableCell className="flex gap-2">
                      <Tooltip text="Chỉnh sửa chi nhánh">
                        <button className="text-blue-600 hover:text-blue-800 transition-all">
                          <FaEdit className="h-5 w-5" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Xóa chi nhánh">
                        <button className="text-red-600 hover:text-red-800 transition-all">
                          <FaTrashAlt className="h-5 w-5" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Xem chi tiết">
                        <button
                          onClick={() => handleDetail(item)}
                          className="text-primary-dark hover:text-primary-darkest transition-all"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={fetchBranches?.totalPages || 1}
          handlePageClick={(page) => setCurrentPage(page)}
          handlePreviousPage={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          handleNextPage={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, fetchBranches?.totalPages || 1),
            )
          }
        />

        {/* Modal for Adding Branch */}
        {/* {showModal && ( */}
        <CreateBranchModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
        {/* )} */}
      </div>
    </Suspense>
  );
};

export default BranchPage;
