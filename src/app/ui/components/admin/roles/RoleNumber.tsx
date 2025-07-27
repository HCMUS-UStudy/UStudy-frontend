"use client";

import React, { useState, useEffect } from "react";
import { DefaultRoute, RoleItem } from "@/app/types";
import { getAllRolesByDefault } from "@/app/lib/services";

const RoleNumber = () => {
  const [roles, setRoles] = useState<{ [key: string]: RoleItem[] }>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleTypes = ["ADMIN", "TEACHER", "STUDENT", "PARENT"];
        const responses = await Promise.all(
          roleTypes.map((role) => getAllRolesByDefault(role as DefaultRoute)),
        );

        const roleData: { [key: string]: RoleItem[] } = {};
        roleTypes.forEach((role, index) => {
          roleData[role] = responses[index] || [];
        });

        setRoles(roleData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <h2
      className={`text-lg md:text-2xl font-bold ${
        loading ? "animate-pulse text-gray-400" : ""
      }`}
    >
      Tổng số chức vụ (
      {loading
        ? "Đang tải..."
        : Object.values(roles)
            .reduce((acc, arr) => acc + arr.length, 0)
            .toLocaleString("vi-VN")}
      )
    </h2>
  );
};

export default RoleNumber;
