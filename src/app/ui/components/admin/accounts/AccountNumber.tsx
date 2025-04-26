"use client";

import React, { useState, useEffect } from "react";
import { AccountItem } from "@/app/types";
import { getAllAccount } from "@/app/lib/services/user";

interface AccountNumberProps {
  searchQuery: string;
  roleQuery: string;
}

const AccountNumber: React.FC<AccountNumberProps> = ({
  searchQuery,
  roleQuery,
}) => {
  const [users, setUsers] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const roleQueryUp = (roleQuery || "All").toUpperCase();
      const defaultRole = roleQueryUp === "ALL" ? "" : roleQueryUp;

      const response = await getAllAccount(searchQuery, 10000, defaultRole, 0);
      setUsers(response.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleQuery]);

  return (
    <h2
      className={`text-2xl font-bold ${
        loading ? "animate-pulse text-gray-400" : ""
      }`}
    >
      Tổng số người dùng (
      {loading ? "Đang tải..." : users.length.toLocaleString("vi-VN")})
    </h2>
  );
};

export default AccountNumber;
