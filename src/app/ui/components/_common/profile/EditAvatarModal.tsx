"use client";

import { useState } from "react";
import { Button } from "../Button";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePathAvatar } from "@/app/lib/services";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../Dialog";

interface EditAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
}

const avatars = [
  "bear.png",
  "cat.png",
  "duck.png",
  "panda.png",
  "puffer-fish.png",
];

const EditAvatarModal: React.FC<EditAvatarModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
}) => {
  const [avatar, setAvatar] = useState<string>(currentAvatar || "cat");
  const { addToast } = useCustomToast();

  const queryClient = useQueryClient();
  const updatePathAvatarMutation = useMutation({
    mutationFn: (file: string) => updatePathAvatar(file),
    onError: (error) => {
      addToast.error(error.message);
    },
    onSuccess: () => {
      addToast.success("Cập nhật avatar thành công");
      queryClient.invalidateQueries({ queryKey: ["UserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["UserData"] });
      onClose();
    },
  });
  const handleSave = (file: string) => {
    updatePathAvatarMutation.mutate(file);
  };

  const fallbackAvatar = "/bg-login.jpg";
  const oldAvatarSrc =
    currentAvatar && currentAvatar.trim() !== ""
      ? currentAvatar
      : fallbackAvatar;

  return (
    <Dialog isOpen={isOpen} onClose={() => onClose()}>
      <DialogHeader>Thay đổi ảnh đại diện</DialogHeader>
      <DialogContent>
        <div className="flex items-center justify-center gap-5 mb-6">
          <div className="relative w-24 h-24 rounded-full border-4 border-gray-300 shadow overflow-hidden">
            <Image
              src={`/userAvatars/${oldAvatarSrc}.png`}
              alt="Ảnh cũ"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-3xl text-gray-400">
            <IoIosArrowForward />
          </div>

          <div className="relative w-24 h-24 rounded-full border-4 border-green-500 shadow overflow-hidden">
            {oldAvatarSrc !== avatar ? (
              <Image
                src={`/userAvatars/${avatar}.png`}
                alt="Ảnh mới"
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src={`/userAvatars/${oldAvatarSrc}.png`}
                alt="Ảnh hiện tại"
                fill
                className="object-cover opacity-30"
              />
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ảnh mới:
          </label>
          <div className="flex flex-wrap gap-3">
            {avatars.map((item) => (
              <div
                key={item}
                onClick={() => {
                  setAvatar(item.split(".")[0]);
                }}
                className="cursor-pointer p-1 border-2 rounded-full hover:border-primary-dark transition-all"
              >
                <Image
                  src={`/userAvatars/${item}`}
                  width={50}
                  height={50}
                  alt="avatar"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onClose()}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-4 py-2 transition-all"
          >
            Hủy
          </Button>
          <Button
            onClick={() => handleSave(avatar)}
            disabled={avatar === oldAvatarSrc}
            isPending={updatePathAvatarMutation.status === "pending"}
          >
            Lưu
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default EditAvatarModal;
