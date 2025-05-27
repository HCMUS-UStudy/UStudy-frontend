"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Pagination from "@/app/ui/components/_common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { deleteUser, getAllAccount } from "@/app/lib/services/user";
import Tooltip from "../../_common/Tooltip";
import { toast } from "react-toastify";
import { accountStatus } from "@/app/lib/utils";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface AccountTableProps {
  searchQuery: string;
  roleQuery: string;
}

const AccountTable: React.FC<AccountTableProps> = ({
  searchQuery,
  roleQuery,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const {
    data: fetchAccounts,
    error,
    isLoading,
  } = useQuery({
    queryKey: [
      "Accounts",
      searchQuery,
      currentPage - 1,
      roleQuery.toUpperCase(),
    ],
    queryFn: () =>
      getAllAccount(
        searchQuery,
        5,
        roleQuery === "All" ? "" : roleQuery.toUpperCase(),
        currentPage - 1,
      ),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setTotalPages(fetchAccounts?.totalPages || 1);
  }, [fetchAccounts]);

  const queryClient = useQueryClient();
  const useDeleteAccountMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      toast.success("Xóa tài khoản thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      queryClient.invalidateQueries({ queryKey: ["Accounts"] });
    },
    onError: () => {
      toast.error("Xóa tài khoản thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
  });

  const handleDeleteAccount = async (userId: string) => {
    useDeleteAccountMutation.mutate(userId);
  };

  function formatDateToVN(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div>
      <Table>
        <TableHeader
          columns={[
            "Mã số",
            "Họ tên",
            "Email",
            "Vai trò",
            "Trạng thái",
            "Ngày tạo",
            "Hành động",
          ]}
          className="bg-gray-100"
        />
        <TableBody isLoading={isLoading}>
          {error ? (
            <TableRow>
              <TableCell colSpan={7} className="text-red-500">
                {error.message}
              </TableCell>
            </TableRow>
          ) : (
            fetchAccounts?.content.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-primary-lighter cursor-pointer"
              >
                <TableCell>{user.genId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell>
                  <span
                    className={`${accountStatus[user.status ?? "ACTIVE"].color} font-bold`}
                  >
                    {accountStatus[user.status ?? "ACTIVE"].label}
                  </span>
                </TableCell>
                <TableCell>{formatDateToVN(user.createdAt)}</TableCell>
                <TableCell className="flex justify-center items-center gap-2">
                  <button className="flex justify-center items-center text-blue-600 hover:text-blue-800 transition-colors">
                    <Tooltip text="Chỉnh sửa tài khoản">
                      <FaEdit className="size-5" />
                    </Tooltip>
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(user.id)}
                    className="flex justify-center items-center text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Tooltip text="Xóa tài khoản">
                      <FaTrashAlt className="size-5" />
                    </Tooltip>
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {fetchAccounts && fetchAccounts.content.length > 0 && (
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
      )}
    </div>
  );
};

export default AccountTable;
