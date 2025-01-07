"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { AccountItem } from "@/app/types/type";
import Pagination from "../../common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/common/Table";
import { getAllAccount } from "@/app/lib/services/user";

interface AccountTableProps {
  searchQuery: string;
}

const AccountTable: React.FC<AccountTableProps> = ({ searchQuery }) => {
  const [users, setUsers] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    let filteredData: AccountItem[] = [];
    setLoading(true);

    try {
      const response = await getAllAccount(searchQuery, currentPage - 1);
      console.log(response);

      filteredData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        genId: item.genId,
        role: item.role,
        isActive: item.isActive,
        createdAt: item.createdAt,
      }));

      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.log(error);
      setError("Error fetching users.");
    } finally {
      setUsers(filteredData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]); // Use searchQueryState in the dependency array

  return (
    <div>
      <div className="mb-4 flex justify-between">
        {/* <input
          type="text"
          placeholder="Search..."
          value={searchQueryState} // Use searchQueryState here
          onChange={(e) => setSearchQuery(e.target.value)} // Use setSearchQuery to update the state
          className="border p-2 rounded"
        /> */}
      </div>

      <Table>
        <TableHeader
          columns={[
            "Họ tên",
            "Email",
            "Mã số",
            "Chức vụ",
            "Trạng thái",
            "Ngày tạo",
            "Hành động",
          ]}
          className="bg-gray-100"
        />
        <TableBody isLoading={loading}>
          {error ? (
            <TableRow>
              <TableCell colSpan={7} className="text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.genId}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span
                    className={
                      user.isActive
                        ? "text-green-600 font-semibold"
                        : "text-gray-500"
                    }
                  >
                    {user.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="flex justify-center items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                  <button className="text-yellow-600 hover:text-yellow-800">
                    <FiLock className="h-5 w-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7}>No users found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
  );
};

export default AccountTable;
