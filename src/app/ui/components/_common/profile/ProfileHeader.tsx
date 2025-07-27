"use client";

import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { UserProfile } from "@/app/types";
import { Button } from "../Button";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import EditAvatarModal from "./EditAvatarModal";
import { updateProfile } from "@/app/lib/services/user";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";

const ProfileHeader = ({ user }: { user: UserProfile | undefined }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const { addToast } = useCustomToast();
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-8 border-b border-gray-200 bg-gradient-to-r from-primary-light to-white">
      <div className="flex items-center gap-6">
        <div
          className="relative w-24 h-24 sm:w-28 sm:h-28 cursor-pointer"
          onClick={() => setIsAvatarModalOpen(true)}
          title="Click để thay đổi avatar"
        >
          <Image
            src={`/userAvatars/${user?.avatar}.png` || "/bg-login.jpg"}
            alt="User Avatar"
            fill
            className="rounded-full object-cover border-4 border-white hover:border-primary-dark transition-all shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {user?.name || "Unknown User"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Mã số học viên: {user?.genId || "N/A"}
          </p>
        </div>
      </div>

      <Button onClick={() => setIsModalOpen(true)}>
        <FiEdit className="text-lg mr-2" />
        <span>Cập nhật</span>
      </Button>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSave={async (data) => {
          await updateProfile(data);
          addToast.success("Cập nhật thông tin thành công");
          queryClient.invalidateQueries({ queryKey: ["UserProfile"] });
        }}
      />

      <EditAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={user?.avatar || "cat"}
      />
    </div>
  );
};

export default ProfileHeader;
