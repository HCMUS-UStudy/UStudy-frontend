"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewAccount } from "@/app/lib/services/user";
import { useRouter } from "next/navigation";
import { getAllRoles } from "@/app/lib/services/role";
import { GenderType } from "@/app/types";

interface AddAccountModalProps {
  buttonLabel: string;
}

const CreateUserSchema = z.object({
  email: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .email("Email không hợp lệ"),
  name: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  phone: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(9, "Số điện thoại từ 9 - 12 ký tự số")
    .max(12, "Số điện thoại từ 9 - 12 ký tự số"),
  address: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  birthday: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc")
    .refine((data) => !isNaN(Date.parse(data)), {
      message: "(*) Ngày sinh không hợp lệ",
    }),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "(*) Vui lòng chọn giới tính",
  }),
  roleId: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
});

type CreateUserInputs = z.infer<typeof CreateUserSchema>;

const AddAccountModal: React.FC<AddAccountModalProps> = ({ buttonLabel }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm<CreateUserInputs>({
    resolver: zodResolver(CreateUserSchema),
  });

  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();

  // Gọi API để lấy danh sách roles khi component render
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRoles();
        if (response.statusCode === "OK") {
          setRoles(response.data); // Lưu danh sách roles
        } else {
          toast.error("Lỗi khi tải danh sách quyền");
        }
      } catch (error) {
        console.error("Lỗi khi lấy roles:", error);
        toast.error("Không thể lấy danh sách quyền");
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data: CreateUserInputs) => {
    try {
      console.log(data);
      const response = await createNewAccount(data);
      console.log(response);

      if (response.statusCode === "OK") {
        toast.success("Tạo tài khoản thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        setShowModal(false);
        router.push("/admin/accounts");
      } else {
        toast.error("Đã xảy ra lỗi khi tạo tài khoản.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Button onClick={handleOpenModal} className="pl-6 pr-6">
        {buttonLabel}
      </Button>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="w-[50vw]"
      >
        <DialogHeader>Tạo người dùng mới</DialogHeader>
        <DialogContent>
          <form
            id="add-account-admin-form"
            onSubmit={handleSubmit(onSubmit)}
            // className="space-y-4"
          >
            {/*Email*/}
            <div className="relative mb-4">
              <Input
                type="email"
                placeholder="Nhập địa chỉ email"
                label="Email *"
                alwaysShowLabel={true}
                {...register("email")}
              />
              <span className="text-error text-sm">
                {errors.email?.message}
              </span>
            </div>
            {/*Name*/}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Nhập tên người dùng"
                label="Tên người dùng *"
                alwaysShowLabel={true}
                {...register("name")}
              />
              <span className="text-error text-sm">{errors.name?.message}</span>
            </div>
            {/*Phone*/}
            <div className="relative mb-4">
              <Input
                type="tel"
                placeholder="Nhập số điện thoại"
                label="Số điện thoại *"
                alwaysShowLabel={true}
                {...register("phone")}
              />
              <span className="text-error text-sm">
                {errors.phone?.message}
              </span>
            </div>
            {/*Address*/}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Nhập địa chỉ"
                label="Địa chỉ *"
                alwaysShowLabel={true}
                {...register("address")}
              />
              <span className="text-error text-sm">
                {errors.address?.message}
              </span>
            </div>
            {/*Gender*/}
            <div className="relative mb-4">
              <Select
                id="gender"
                name="gender"
                label="Giới tính"
                defaultValue={"MALE"}
                defaultLabel="Nam"
                onValueChange={(value) => {
                  setValue("gender", value as GenderType);
                }}
              >
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value="FEMALE">Nữ</SelectItem>
              </Select>
              <span className="text-error text-sm">
                {errors.gender?.message}
              </span>
            </div>
            {/*Role*/}
            <div className="relative mb-4">
              <Select
                id="role"
                name="role"
                label="Chức vụ"
                onValueChange={(value) => {
                  setValue("roleId", String(value)); // Lưu ID của roleId
                  clearErrors("roleId");
                }}
              >
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name === "Teacher"
                      ? "Giáo Viên"
                      : role.name === "Admin"
                        ? "Quản Trị Viên"
                        : role.name === "Clerk"
                          ? "Giáo Vụ"
                          : role.name === "Parent"
                            ? "Phụ Huynh"
                            : role.name === "Student"
                              ? "Học Viên"
                              : role.name}
                  </SelectItem>
                ))}
              </Select>
              <span className="text-error text-sm">
                {errors.roleId?.message}
              </span>
            </div>

            {/*birthday*/}
            <div className="relative mb-4">
              <Input
                type="date"
                label="Ngày sinh *"
                {...register("birthday")}
              />
              <span className="text-error text-sm">
                {errors.birthday?.message}
              </span>
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <div className="flex justify-between">
            <Button
              variant="basic"
              type="button"
              onClick={handleCloseModal}
              className="bg-neutral hover:bg-neutral/80 text-primary-text w-[15%]"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              form="add-account-admin-form"
              type="submit"
              className="w-[15%]"
            >
              Tạo
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddAccountModal;
