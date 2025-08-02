"use client";

import React, { useState } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
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
// import { createNewAccount } from "@/app/lib/services/user";
// import { useRouter } from "next/navigation";
import { getAllRoles } from "@/app/lib/services/role";
import { CustomError, GenderType } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { createNewAccount } from "@/app/lib/services";
import { CustomDatePicker } from "../../_common/text-field";

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
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm<CreateUserInputs>({
    resolver: zodResolver(CreateUserSchema),
  });

  const { addToast } = useCustomToast();

  const { data: roles, status: rolesStatus } = useQuery({
    queryKey: ["Roles"],
    queryFn: () => getAllRoles(),
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserInputs) => {
      return createNewAccount({
        name: data.name,
        birthday: data.birthday,
        email: data.email,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        roleId: data.roleId,
      });
    },
    onError: (error) => {
      const customError = error as CustomError;
      if (customError.status !== 500) {
        addToast.error(
          (customError as { data?: string }).data || "Tạo tài khoản thất bại",
        );
      } else {
        addToast.error("Lỗi hệ thống");
      }
    },
    onSuccess: () => {
      addToast.success("Tạo tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["Accounts"] });
      queryClient.invalidateQueries({ queryKey: ["ListMembersToAdd"] });
      setShowModal(false);
    },
  });

  const onSubmit = (data: CreateUserInputs) => {
    createUserMutation.mutate(data);
  };
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);

  return (
    <>
      <Button onClick={handleOpenModal} className="w-full">
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
                isError={errors.email !== undefined}
                errorMsg={errors.email?.message}
                {...register("email")}
              />
            </div>
            {/*Name*/}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Nhập tên người dùng"
                label="Tên người dùng *"
                alwaysShowLabel={true}
                isError={errors.name !== undefined}
                errorMsg={errors.name?.message}
                {...register("name")}
              />
            </div>
            {/*Phone*/}
            <div className="relative mb-4">
              <Input
                type="tel"
                placeholder="Nhập số điện thoại"
                label="Số điện thoại *"
                alwaysShowLabel={true}
                isError={errors.phone !== undefined}
                errorMsg={errors.phone?.message}
                {...register("phone")}
              />
            </div>
            {/*Address*/}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Nhập địa chỉ"
                label="Địa chỉ *"
                alwaysShowLabel={true}
                isError={errors.address !== undefined}
                errorMsg={errors.address?.message}
                {...register("address")}
              />
            </div>
            {/*Gender*/}
            <div className="relative mb-4">
              <Select
                id="gender"
                name="gender"
                label="Giới tính *"
                defaultValue={"MALE"}
                defaultLabel="Nam"
                onValueChange={(value) => {
                  setValue("gender", value as GenderType);
                }}
                showClearButton={false}
              >
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value="FEMALE">Nữ</SelectItem>
              </Select>
              {errors.gender && (
                <span className="text-error text-sm mt-1 block">
                  {errors.gender.message}
                </span>
              )}
            </div>
            {/*Role*/}
            <div className="relative mb-4">
              <Select
                id="role"
                name="role"
                label="Chức vụ *"
                defaultLabel="Chọn chức vụ cho tài khoản (Bắt buộc)"
                isLoading={rolesStatus === "pending"}
                onValueChange={(value) => {
                  setValue("roleId", String(value));
                  clearErrors("roleId");
                }}
                showClearButton={false}
              >
                {roles?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </Select>
              {errors.roleId && (
                <span className="text-error text-sm mt-1 block">
                  {errors.roleId.message}
                </span>
              )}
            </div>

            {/*birthday*/}
            {/* <div className="relative mb-4">
              <Input
                type="date"
                label="Ngày sinh *"
                isError={errors.birthday !== undefined}
                errorMsg={errors.birthday?.message}
                {...register("birthday")}
              />
            </div> */}
            <div className="relative mb-4">
              <CustomDatePicker
                label="Ngày sinh"
                control={control}
                name="birthday"
                isError={errors.birthday !== undefined}
                errorMsg={errors.birthday?.message}
              />
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <div className="flex justify-between">
            <Button
              variant="primary"
              form="add-account-admin-form"
              type="submit"
              isPending={createUserMutation.status === "pending"}
              className="w-full"
            >
              Tạo người dùng mới
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddAccountModal;
