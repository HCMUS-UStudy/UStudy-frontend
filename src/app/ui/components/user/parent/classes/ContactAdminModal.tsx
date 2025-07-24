"use client";

import { BsChatDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { UserSummary } from "@/app/types";
import { Dialog, DialogHeader } from "../../../_common/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../../_common/Avatar";

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admins: UserSummary[];
}

export default function ContactAdminModal({
  isOpen,
  onClose,
  admins,
}: ContactAdminModalProps) {
  const router = useRouter();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="sm:max-w-[500px]">
      <DialogHeader>
        <h2 className="text-xl font-semibold">Chọn giáo vụ để liên hệ</h2>
      </DialogHeader>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {admins?.map((admin) => (
          <div
            key={admin.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3 mr-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={admin.avatar} alt={admin.name} />
                <AvatarFallback>{admin.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{admin.name}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                router.push(`/member/contact?teacher=${admin.name}`);
                onClose();
              }}
              className="px-3 py-1.5 bg-primary-dark hover:bg-primary-darker text-white text-sm rounded-md flex items-center"
            >
              <BsChatDots className="mr-1.5" />
              Nhắn tin
            </button>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
