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
import { RegisterClassItem, MemberItem } from "@/app/types";

import Dropdown from "../../_common/Dropdown";
import SearchField from "../../_common/text-field/SearchField";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ClassTableProps {
  title: string;
  fetchData: (
    page: number,
    searchQuery: string,
  ) => Promise<{
    content: RegisterClassItem[] | MemberItem[];
    totalPages: number;
  }>;
  users: RegisterClassItem[] | MemberItem[];
  isSelecting?: boolean;
  selectedUsers?: string[];
  toggleSelection?: (id: string) => void;
  toggleSelectMode?: () => void;
  toggleSelectAll?: () => void;
  handleBulkAction?: () => void;
  handleAdd?: (id: string) => void;
  role?: string;
  roles?: { [key: string]: string };
}

const ClassTable: React.FC<ClassTableProps> = ({
  title,
  fetchData,
  isSelecting,
  selectedUsers,
  toggleSelection,
  toggleSelectMode,
  toggleSelectAll,
  handleBulkAction,
  handleAdd,
  role,
  roles = {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<RegisterClassItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch dữ liệu khi searchQuery hoặc currentPage thay đổi
  useEffect(() => {
    console.log(loading);
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { content, totalPages } = await fetchData(
          currentPage - 1,
          searchQuery,
        );
        setUsers(content);
        setTotalPages(totalPages || 1);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchQuery]);

  const isRegisterClassItem = (
    student: RegisterClassItem | MemberItem,
  ): student is RegisterClassItem => {
    return (student as RegisterClassItem).genId !== undefined;
  };

  const hasData = users.length > 0;
  const isRegisterClassList = hasData && users.some(isRegisterClassItem);
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
          placeholder="Tìm kiếm người dùng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center">
          <Dropdown
            label="Lọc"
            items={Object.entries(roles).map(([key, label]) => ({
              key,
              label,
            }))}
            selected={role}
          />
        </div>
      </div>

      {hasData && isRegisterClassList && toggleSelectMode && (
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
            ...(isRegisterClassList ? ["ID"] : []),
            "Tên",
            "Email",
            "Giới tính",
            ...(!isSelecting && isRegisterClassList && handleAdd
              ? ["Hành động"]
              : []),
          ]}
        />
        <TableBody>
          {!users.length ? (
            <TableRow>
              <TableCell
                colSpan={isRegisterClassList ? 5 : 4}
                className="text-center"
              >
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className={
                  selectedUsers?.includes(user.id)
                    ? "bg-green-100"
                    : "hover:bg-green-100"
                }
              >
                {showSelectColumn && toggleSelection && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user.id)}
                      onChange={() => toggleSelection(user.id)}
                    />
                  </TableCell>
                )}
                {isRegisterClassItem(user) && (
                  <TableCell>{user.genId}</TableCell>
                )}
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.gender}</TableCell>
                {!isSelecting && isRegisterClassItem(user) && handleAdd && (
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="basic"
                        onClick={() => handleAdd(user.id)}
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

export default ClassTable;
