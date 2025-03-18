"use client";

import { FaList, FaPlus } from "react-icons/fa6";
import { Button } from "../../_common/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../_common/Table";
import Pagination from "../../_common/Pagination";
import SearchField from "../../_common/text-field/SearchField";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClassItem, ClassUserItem } from "@/app/types/type";
import DropdownCourse from "../courses/DropdownCourse";
import DropdownGrade from "../grades/DropdownGrade";

interface ApproveAccountTableProps {
  title: string;
  fetchData: (
    page: number,
    searchQuery: string,
    courseQuery: string,
  ) => Promise<{
    content: {
      id: string;
      name: string;
      course: {
        name: string;
      };
      grade: {
        name: string;
      };
    }[];
    totalPages: number;
  }>;
  class: ClassItem[] | ClassUserItem[];
  isSelecting?: boolean;
  selectedClasses?: string[];
  toggleSelection?: (id: string) => void;
  toggleSelectMode?: () => void;
  toggleSelectAll?: () => void;
  handleBulkAction?: () => void;
  handleAdd?: (id: string) => void;
}

const ApproveAccountTable: React.FC<ApproveAccountTableProps> = ({
  title,
  fetchData,
  isSelecting,
  selectedClasses,
  toggleSelection,
  toggleSelectMode,
  toggleSelectAll,
  handleBulkAction,
  handleAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<
    {
      id: string;
      name: string;
      course: {
        name: string;
      };
      grade: {
        name: string;
      };
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // // Fetch dữ liệu khi searchQuery hoặc currentPage thay đổi
  useEffect(() => {
    console.log(loading);
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const { content, totalPages } = await fetchData(
          currentPage - 1,
          searchQuery,
          selectedCourse ?? "",
        );
        console.log(content);
        setClasses(content);
        setTotalPages(totalPages || 1);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [currentPage, searchQuery]);

  const hasData = classes.length > 0;
  const showSelectColumn = hasData && isSelecting;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="border p-4">
      <h3 className="text-lg font-bold mb-4">{title}</h3>

      <div className="flex items-center justify-between mt-2 mb-4 gap-14">
        <SearchField
          className="w-full bg-primary-lighter rounded-2xl"
          placeholder="Tìm kiếm theo tên lớp..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <DropdownCourse label="Lọc" onSelectCourse={setSelectedCourse} />

          <DropdownGrade label="Lọc" />
        </div>
      </div>

      {hasData && toggleSelectMode && (
        <div className="mb-4 flex gap-2">
          <Button onClick={toggleSelectMode} className="mr-2">
            {isSelecting ? "Hủy bỏ" : "Chọn nhiều"}
          </Button>
          {isSelecting && toggleSelectAll && handleBulkAction && (
            <>
              <Button
                onClick={toggleSelectAll}
                className="bg-blue-500 text-white p-2"
              >
                <FaList className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleBulkAction()}
                className="bg-green-500 text-white p-2"
              >
                <FaPlus className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      )}

      <Table>
        <TableHeader
          columns={[
            ...(showSelectColumn ? ["✔ Chọn"] : []),
            "Tên lớp",
            "Tên môn học",
            "Tên khối",
            ...(!isSelecting && handleAdd ? ["Hành động"] : []),
          ]}
        />
        <TableBody>
          {!hasData ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            classes.map((classItem) => (
              <TableRow
                key={`${title}-${classItem.id}`}
                className={
                  selectedClasses?.includes(classItem.id)
                    ? "bg-green-100"
                    : "hover:bg-green-100"
                }
              >
                {showSelectColumn && toggleSelection && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedClasses?.includes(classItem.id)}
                      onChange={() => toggleSelection(classItem.id)}
                    />
                  </TableCell>
                )}
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{classItem.course.name}</TableCell>
                <TableCell>{classItem.grade.name}</TableCell>
                {!isSelecting && handleAdd && (
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="basic"
                        onClick={() => handleAdd(classItem.id)}
                        className="bg-success text-white hover:bg-success/80"
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {hasData && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={setCurrentPage}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
      )}
    </div>
  );
};

export default ApproveAccountTable;
