"use client"

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { FiLock } from 'react-icons/fi';
import { AccountItem } from '@/app/types/type';
import { getAllAccount } from '@/app/lib/api';
import Loading from '../loading';
import PaginationAdmin from '../paginationAdmin';

interface UserTableProps {
  searchQuery: string;
}

const UserTable: React.FC<UserTableProps> = ({ searchQuery }) => {
  const [users, setUsers] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    let filteredData: AccountItem[] = [];
    setLoading(true);

    try {
      const response = await getAllAccount(searchQuery, currentPage - 1);

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
      setError('Error fetching users.');
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

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Họ tên</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Email</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Mã số</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Chức vụ</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                <Loading />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-red-500">
                {error}
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{user.genId}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{user.role}</td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className={user.isActive ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                    {user.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex justify-center items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                  <button className="text-yellow-600 hover:text-yellow-800">
                    <FiLock className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PaginationAdmin
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        handlePreviousPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        handleNextPage={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      />

    </div>
  );
};

export default UserTable;
