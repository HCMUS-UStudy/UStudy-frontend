"use client";

import { useState } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { updateBranch } from "@/app/lib/services/branch";
import { Branch } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { useCustomToast } from "@/app/lib/hooks/useToast";

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
  onSuccess: () => void;
}

export default function EditBranchModal({
  isOpen,
  onClose,
  branch,
  onSuccess,
}: EditBranchModalProps) {
  const [formData, setFormData] = useState({
    id: branch?.id || "",
    name: branch?.name || "",
    address: branch?.address || "",
    contactNumber: branch?.contactNumber || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useCustomToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.contactNumber) {
      addToast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsLoading(true);
      await updateBranch(formData);
      addToast.success("Cập nhật chi nhánh thành công");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating branch:", error);
      addToast.error("Có lỗi xảy ra khi cập nhật chi nhánh");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!branch) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-md"
      enableClickOutside={!isLoading}
    >
      <DialogHeader>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Chỉnh sửa chi nhánh
        </h3>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chi nhánh <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên chi nhánh"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
              disabled={isLoading}
            />
          </div>
        </DialogContent>

        <DialogFooter>
          <div className="flex justify-end gap-3 w-full">
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" isPending={isLoading} disabled={isLoading}>
              Lưu thay đổi
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
