"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { AccountItem } from "@/app/types/type";
import Pagination from "@/app/ui/components/_common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { getAllAccount } from "@/app/lib/services/user";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import AccountRegisterModal from "./AccountRegisterModal";
import AddAccountModal from "./AddAccountModal";

const AccountTable: React.FC = () => {
  const [users, setUsers] = useState<AccountItem[]>([]);
  const [filteredData, setFilteredData] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await getAllAccount("", currentPage - 1);
      const allUsers = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        genId: item.genId,
        role: item.role,
        isActive: item.isActive,
        createdAt: item.createdAt,
      }));

      setTotalPages(response.totalPages || 1);
      setUsers(allUsers);
      setFilteredData(allUsers); // Initialize filtered data with all users
    } catch (error) {
      console.log(error);
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredData(users); // If no search term, show all users
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, users]);

  useEffect(() => {
    // Read search query from URL on component mount
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get("query") || "";
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    // Update URL when searchQuery changes
    if (searchQuery.trim() !== "") {
      const newUrl = `?query=${searchQuery}`; // Construct the new URL with the search term
      window.history.pushState({ searchQuery }, "", newUrl); // Update the URL without reloading the page
    }
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update the state with the input value
  };

  return (
    <div>
      {/* Search Field */}
      <div className="flex justify-between items-center mt-6 mb-6">
        <SearchField
          className="w-[200px]"
          placeholder="Tìm theo tên người dùng..."
          value={searchQuery} // Bind the value to searchQuery state
          onChange={handleSearchChange} // Handle input changes
        />
        <div className="flex items-center pr-6">
          <AccountRegisterModal buttonLabel="Duyệt đăng ký" />
          <AddAccountModal buttonLabel="Tạo người dùng" />
        </div>
      </div>

      <div className="overflow-x-auto mt-6 max-h-[400px] mr-6">
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
            ) : filteredData.length > 0 ? (
              filteredData.map((user) => (
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
      </div>

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
