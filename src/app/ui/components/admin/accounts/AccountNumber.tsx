"use client";

import React from "react";
import { getAllAccount } from "@/app/lib/services/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface AccountNumberProps {
  searchQuery: string;
  roleQuery: string;
}

const AccountNumber: React.FC<AccountNumberProps> = ({
  searchQuery,
  roleQuery,
}) => {
  const { data: fetchAccounts, status } = useQuery({
    queryKey: ["Accounts", searchQuery, roleQuery.toUpperCase()],
    queryFn: () =>
      getAllAccount(
        searchQuery,
        10000,
        roleQuery === "All" ? "" : roleQuery.toUpperCase(),
        0,
      ),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  return (
    <h2
      className={`text-lg md:text-2xl font-bold ${
        status === "pending" ? "animate-pulse text-gray-400" : ""
      }`}
    >
      Tổng số người dùng (
      {status === "pending"
        ? "Đang tải..."
        : fetchAccounts?.content.length.toLocaleString("vi-VN")}
      )
    </h2>
  );
};

export default AccountNumber;
