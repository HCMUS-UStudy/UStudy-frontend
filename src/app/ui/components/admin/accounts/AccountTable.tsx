"use client";

import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
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
import { accountStatus } from "@/app/lib/utils";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { useRouter } from "next/navigation";

interface AccountTableProps {
  searchQuery: string;
  roleQuery: string;
}

const AccountTable: React.FC<AccountTableProps> = ({
  searchQuery,
  roleQuery,
}) => {
  // const [users, setUsers] = useState<AccountItem[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const router = useRouter();
  // const [trigger, setTrigger] = useState<boolean>(false);

  // const { handleNavigate } = useEncodedRoute();
  const { addToast } = useCustomToast();

  const {
    data: fetchAccounts,
    error,
    status,
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

  const handleDetail = (userId: string) => {
    // handleNavigate(userId, "/admin/accounts");
    router.push(`/admin/accounts/${userId}`);
  };

  const queryClient = useQueryClient();
  const useDeleteAccountMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      addToast.success("Xóa tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["Accounts"] });
    },
    onError: () => {
      addToast.error("Xóa tài khoản thất bại");
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
            "Mã người dùng",
            "Họ tên",
            "Email",
            "Vai trò",
            "Trạng thái",
            "Ngày tạo",
            "Hành động",
          ]}
        />
        <TableBody isLoading={status === "pending"}>
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
                // onClick={() => handleDetail(user.id)}
              >
                <TableCell>{user.genId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell>
                  <span
                    className={`${accountStatus[user.status].color} font-bold`}
                  >
                    {accountStatus[user.status].label}
                  </span>
                </TableCell>
                <TableCell>{formatDateToVN(user.createdAt)}</TableCell>
                <TableCell className="flex justify-start items-center gap-2">
                  <button
                    onClick={() => handleDeleteAccount(user.id)}
                    className="flex justify-center items-center text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Tooltip text="Xóa tài khoản">
                      <FaTrashAlt className="size-4 md:size-4" />
                    </Tooltip>
                  </button>
                  <button className="flex justify-center items-center text-yellow-600 hover:text-yellow-800 transition-colors">
                    <Tooltip text="Khóa tài khoản">
                      <FiLock className="size-4 md:size-5" />
                    </Tooltip>
                  </button>
                  <button
                    onClick={() => handleDetail(user.id)}
                    className="flex justify-center items-center text-primary-dark hover:text-primary-darkest transition-colors"
                  >
                    <Tooltip text="Xem chi tiết">
                      <Eye className="size-5 md:size-6" />
                    </Tooltip>
                  </button>
                </TableCell>
              </TableRow>
            ))
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
