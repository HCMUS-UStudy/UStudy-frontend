"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogContent, DialogFooter } from "../Dialog";
import { GenderType, UserProfile } from "@/app/types";
import { Input } from "../text-field/Input";
import { Button } from "../Button";
import { Select, SelectItem } from "../Select";
import { FiEdit2, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { changePassword } from "@/app/lib/services/auth";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSave: (data: Partial<UserProfile>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    address: string;
    birthday: string;
    gender: GenderType | "";
  }>({
    name: "",
    phone: "",
    address: "",
    birthday: "",
    gender: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        birthday: user.birthday?.slice(0, 10) || "",
        gender: (user.gender as GenderType) || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      gender: formData.gender as GenderType,
    });
    onClose();
  };

  const handlePasswordSubmit = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        toast.error("Mật khẩu mới không khớp");
        return;
      }

      setIsLoading(true);
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });

      toast.success("Đổi mật khẩu thành công");
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        className="w-2/3 md:w-full max-w-md rounded-2xl overflow-y-auto bg-white shadow-xl"
        displayCloseButton
      >
        <DialogHeader className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Chỉnh sửa thông tin
          </h2>
        </DialogHeader>

        <DialogContent className="space-y-6 overflow-y-auto mb-4 px-6 py-4">
          <div className="space-y-4">
            <Input
              label="Họ tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary-light"
            />
            <Input
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary-light"
            />
            <Input
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary-light"
            />
            <Input
              label="Ngày sinh"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary-light"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <Select
                name="gender"
                defaultValue={formData.gender}
                onValueChange={(value) =>
                  handleChange({
                    target: { name: "gender", value },
                  } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
                }
                className="w-full text-sm transition-all duration-200 focus:ring-2 focus:ring-primary-light"
                defaultLabel="-- Chọn giới tính --"
              >
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value="FEMALE">Nữ</SelectItem>
              </Select>
            </div>
            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-gray-600">
                Bảo mật
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                    <FiLock className="text-gray-400 w-5 h-5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">
                        Mật khẩu
                      </div>
                      <div className="text-sm text-gray-500">********</div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2.5 text-sm text-white bg-primary-dark rounded-lg hover:bg-primary-darker transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogFooter className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-primary-dark rounded-lg hover:bg-primary-darker transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        className="w-2/3 md:w-full max-w-md rounded-2xl overflow-y-auto bg-white shadow-xl"
        displayCloseButton
      >
        <DialogHeader className="border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800">Đổi mật khẩu</h2>
        </DialogHeader>

        <DialogContent className="space-y-6 overflow-y-auto mb-4 px-6 py-4">
          <div className="space-y-4">
            <Input
              label="Mật khẩu hiện tại"
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary-light border-0 bg-gray-50"
              icon={<FiLock className="text-gray-400" />}
            />
            <Input
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary-light border-0 bg-gray-50"
              icon={<FiLock className="text-gray-400" />}
            />
            <Input
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary-light border-0 bg-gray-50"
              icon={<FiLock className="text-gray-400" />}
            />
          </div>
        </DialogContent>

        <DialogFooter className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button
            onClick={() => setShowPasswordModal(false)}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handlePasswordSubmit}
            className="px-4 py-2 text-sm text-white bg-primary-dark rounded-lg hover:bg-primary-darker transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default EditProfileModal;
