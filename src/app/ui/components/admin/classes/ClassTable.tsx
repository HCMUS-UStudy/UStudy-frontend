"use client";

import { FaCheck, FaList } from "react-icons/fa6";
import { Button } from "../../_common/Button";
import { FaTimes } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../_common/Table";
import Pagination from "../../_common/Pagination";
import { RegisterClassItem, StudentItem } from "@/app/types/type";

interface ClassTableProps {
  title: string;
  users: RegisterClassItem[] | StudentItem[];
  isSelecting: boolean;
  selectedUsers: string[];
  toggleSelection: (id: string) => void;
  toggleSelectMode: () => void;
  toggleSelectAll: () => void;
  handleBulkAction: (action: "approve" | "reject") => void;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
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
  handleApprove,
  handleReject,
  currentPage,
  totalPages,
  setCurrentPage,
  handlePreviousPage,
  handleNextPage,
}) => {
  const isRegisterClassItem = (
    student: RegisterClassItem | StudentItem,
  ): student is RegisterClassItem => {
    return (student as RegisterClassItem).genId !== undefined;
  };

  return (
    <div className="border p-4">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="mb-4 flex gap-2">
        <Button onClick={toggleSelectMode} className="mr-2">
          {isSelecting ? "Hủy bỏ" : "Chọn nhiều"}
        </Button>
        {isSelecting && (
          <>
            <Button
              onClick={() => toggleSelectAll()}
              className="bg-blue-500 text-white p-2"
            >
              <FaList className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => handleBulkAction("approve")}
              className="bg-green-500 text-white p-2"
            >
              <FaCheck className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => handleBulkAction("reject")}
              className="bg-red-500 text-white p-2"
            >
              <FaTimes className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

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
                  selectedUsers.includes(user.id)
                    ? "bg-green-100"
                    : "hover:bg-green-100"
                }
              >
                {isSelecting && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
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
                {!isSelecting && isRegisterClassItem(user) && (
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="basic"
                        onClick={() => handleApprove(user.id)}
                        className="bg-success text-white hover:bg-success/80"
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        variant="basic"
                        onClick={() => handleReject(user.id)}
                        className="bg-error text-white hover:bg-error/80 ml-4"
                      >
                        <FaTimes />
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
