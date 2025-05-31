"use client";

import React, { useState } from "react";
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
// import { createNewAccount } from "@/app/lib/services/user";
// import { useRouter } from "next/navigation";
import { getAllRoles } from "@/app/lib/services/role";
import { GenderType } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

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

  // const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  // const router = useRouter();

  // Gọi API để lấy danh sách roles khi component render
  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     try {
  //       const response = await getAllRoles();
  //       if (response.statusCode === "OK") {
  //         setRoles(response.data); // Lưu danh sách roles
  //       } else {
  //         toast.error("Lỗi khi tải danh sách quyền");
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy roles:", error);
  //       toast.error("Không thể lấy danh sách quyền");
  //     }
  //   };

  //   fetchRoles();
  // }, []);

  const { data: roles, status: rolesStatus } = useQuery({
    queryKey: ["Roles"],
    queryFn: () => getAllRoles(),
  });

  const onSubmit = async (data: CreateUserInputs) => {
    try {
      console.log(data);
      // const response = await createNewAccount(data);
      // console.log(response);

      // if (response.statusCode === "OK") {
      //   toast.success("Tạo tài khoản thành công!", {
      //     position: "bottom-right",
      //     autoClose: 3000,
      //   });
      //   setShowModal(false);
      //   router.push("/admin/accounts");
      // } else {
      //   toast.error("Đã xảy ra lỗi khi tạo tài khoản.", {
      //     position: "bottom-right",
      //     autoClose: 3000,
      //   });
      // }
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
                label="Chức vụ"
                isLoading={rolesStatus === "pending"}
                onValueChange={(value) => {
                  setValue("roleId", String(value));
                  clearErrors("roleId");
                }}
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
            <div className="relative mb-4">
              <Input
                type="date"
                label="Ngày sinh *"
                isError={errors.birthday !== undefined}
                errorMsg={errors.birthday?.message}
                {...register("birthday")}
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
