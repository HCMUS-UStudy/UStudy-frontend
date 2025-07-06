"use client";

import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { UserProfile } from "@/app/types";
import { Button } from "../Button";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import EditAvatarModal from "./EditAvatarModal";
import { updateProfile, updateAvatar } from "@/app/lib/services/user";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const ProfileHeader = ({
  user,
  onSuccess,
}: {
  user: UserProfile | null;
  onSuccess?: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const { addToast } = useCustomToast();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-8 border-b border-gray-200 bg-gradient-to-r from-primary-light to-white">
      <div className="flex items-center gap-6">
        <div
          className="relative w-24 h-24 sm:w-28 sm:h-28 cursor-pointer"
          onClick={() => setIsAvatarModalOpen(true)}
          title="Click để thay đổi avatar"
        >
          <img
            src={user?.avatar || "/bg-login.jpg"}
            alt="User Avatar"
          />

        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {user?.name || "Unknown User"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Mã số: {user?.genId || "N/A"}
          </p>
        </div>
      </div>

      <Button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-primary-dark text-white text-sm sm:text-base rounded-full hover:bg-primary-darker transition-all duration-200 shadow-md"
      >
        <FiEdit className="text-lg" />
        <span>Cập nhật</span>
      </Button>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSave={async (data) => {
          await updateProfile(data);
          addToast.success("Cập nhật thông tin thành công");
          onSuccess?.();
        }}
      />

      <EditAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={user?.avatar || ""}
        onSave={async (file) => {
          // Gọi API upload avatar
          await updateAvatar(file);
          addToast.success("Cập nhật avatar thành công");
          onSuccess?.();
        }}
      />
    </div>
  );
};

export default ProfileHeader;
