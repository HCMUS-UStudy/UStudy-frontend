"use client";

import React, { useState } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
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

interface AddAccountModalProps {
  buttonLabel: string;
}

const CreateUserSchema = z.object({
  email: z
    .string({ message: "Đây là trường bắt buộc" })
    .email("Email không hợp lệ"),
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  phone: z
    .string({ message: "Đây là trường bắt buộc" })
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(9, "Số điện thoại từ 9 - 12 ký tự số")
    .max(12, "Số điện thoại từ 9 - 12 ký tự số"),
  address: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  birthday: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc")
    .refine((data) => !isNaN(Date.parse(data)), {
      message: "Ngày sinh không hợp lệ",
    }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Vui lòng chọn giới tính" }),
  role: z
    .string({ message: "Đây là trường bắt buộc" })
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
  const onSubmit = (data: CreateUserInputs) => {
    console.log(data);
    // call api
  };
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <ToastContainer />
      <Button onClick={handleOpenModal} className="pl-6 pr-6 rounded-2xl">
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
                  setValue("gender", value as "MALE" | "FEMALE");
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
                defaultValue={"STUDENT"}
                defaultLabel="Học viên"
                onValueChange={(value) => {
                  setValue("role", value as string);
                  clearErrors("role");
                }}
              >
                <SelectItem value="STUDENT">Học viên</SelectItem>
                <SelectItem value="TEACHER">Giáo viên</SelectItem>
                <SelectItem value="STAFF">Giáo vụ</SelectItem>
              </Select>
              <span className="text-error text-sm">{errors.role?.message}</span>
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
