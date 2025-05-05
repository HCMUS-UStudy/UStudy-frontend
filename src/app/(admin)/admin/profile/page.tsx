"use client";
import React, { useEffect, useState } from "react";
import { FiMail, FiCalendar } from "react-icons/fi";
// import { AiOutlineEdit } from "react-icons/ai";
// import { Button } from "@/app/ui/components/_common/Button";
import Image from "next/image";
import { getUserDataFromCookies } from "@/app/lib/action";
import { UserData } from "@/app/types";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserDataFromCookies();
      setUser(userInfo);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <Image
            src={user?.avatar || "/bg-login.jpg"}
            alt="User Avatar"
            className="rounded-full"
            width={80}
            height={80}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-bold">{user?.name}</div>
          <div className="text-lg text-gray-500">{user?.role.name}</div>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <div className="flex items-center gap-1">
          <FiMail size={20} />
          <div>Email: {user?.email}</div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <FiCalendar size={20} />
          <div>GenId: {user?.genId}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
