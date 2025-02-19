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
import { RegisterClassItem, MemberItem } from "@/app/types/type";

interface ClassTableProps {
  title: string;
  users: RegisterClassItem[] | MemberItem[];
  isSelecting?: boolean;
  selectedUsers?: string[];
  toggleSelection?: (id: string) => void;
  toggleSelectMode?: () => void;
  toggleSelectAll?: () => void;
  handleBulkAction?: () => void;
  handleAdd?: (id: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const ClassTable: React.FC<ClassTableProps> = ({
  title,
  users,
  isSelecting,
  selectedUsers,
  toggleSelection,
  toggleSelectMode,
  toggleSelectAll,
  handleBulkAction,
  handleAdd,
  currentPage,
  totalPages,
  setCurrentPage,
  handlePreviousPage,
  handleNextPage,
}) => {
  const isRegisterClassItem = (
    student: RegisterClassItem | MemberItem,
  ): student is RegisterClassItem => {
    return (student as RegisterClassItem).genId !== undefined;
  };

  const isRegisterClassList = users.some(isRegisterClassItem);

  return (
    <div className="border p-4">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {isRegisterClassList && toggleSelectMode && (
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
            ...(isSelecting ? ["✔ Chọn"] : []),
            ...(users.some(isRegisterClassItem) ? ["ID"] : []),
            "Tên",
            "Email",
            "Giới tính",
            ...(!isSelecting && users.some(isRegisterClassItem)
              ? ["Hành động"]
              : []),
          ]}
        />
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={users.some(isRegisterClassItem) ? 5 : 3}
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
                {isSelecting && isRegisterClassList && toggleSelection && (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={setCurrentPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};

export default ClassTable;
