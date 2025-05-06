"use client";

import React, { useState, useEffect } from "react";
import { getAllRolesByDefault } from "@/app/lib/services/role";
import {
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserFriends,
} from "react-icons/fa";
import { DefaultRoute, RoleItem } from "@/app/types";

const roleIcons = {
  ADMIN: <FaUserShield className="text-red-500 text-5xl drop-shadow-lg" />,
  TEACHER: (
    <FaChalkboardTeacher className="text-blue-500 text-5xl drop-shadow-lg" />
  ),
  STUDENT: (
    <FaUserGraduate className="text-green-500 text-5xl drop-shadow-lg" />
  ),
  PARENT: <FaUserFriends className="text-purple-500 text-5xl drop-shadow-lg" />,
};

const RoleDisplay = () => {
  const [roles, setRoles] = useState<{ [key: string]: RoleItem[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
        setError("Lỗi khi lấy dữ liệu vai trò.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 text-lg animate-pulse">
        Đang tải dữ liệu...
      </p>
    );
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {Object.keys(roles).map((roleType) => (
        <div
          key={roleType}
          className="p-6 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center border border-gray-200 hover:scale-105"
        >
          <div className="p-4 bg-gray-100 rounded-full shadow-md">
            {roleIcons[roleType as keyof typeof roleIcons]}
          </div>
          <h3 className="font-semibold text-xl mt-3 text-gray-800 uppercase tracking-wide">
            {roleType}
          </h3>
          <ul className="mt-4 space-y-2 text-gray-700 text-sm w-full text-center">
            {roles[roleType].length > 0 ? (
              roles[roleType].map((role) => (
                <li
                  key={role.id}
                  className="px-4 py-2 bg-gray-50 rounded-md shadow-sm border border-gray-200 transition-all duration-200 hover:bg-gray-200"
                >
                  {role.name}
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">Chưa có dữ liệu</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RoleDisplay;
