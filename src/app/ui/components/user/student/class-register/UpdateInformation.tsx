"use client";
import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../../_common/Dialog";
import { Button } from "../../../_common/Button";
import {
  CustomDatePicker,
  CustomRadioGroup,
  Input,
} from "../../../_common/text-field";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "@/app/lib/services";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const updateInfoSchema = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, { message: "Đây là trường bắt buộc" }),
  birthday: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc")
    .refine((data) => !isNaN(Date.parse(data)), {
      message: "Ngày sinh không hợp lệ",
    }),
  phone: z
    .string({ message: "Đây là trường bắt buộc" })
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(9, "Số điện thoại từ 9 - 12 ký tự số")
    .max(12, "Số điện thoại từ 9 - 12 ký tự số"),
  parentPhone: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (/^\d+$/.test(val) && val.length >= 9 && val.length <= 12),
      { message: "Số điện thoại phải chứa 9-12 ký tự số" },
    ),
  address: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, { message: "Đây là trường bắt buộc" }),

  gender: z.enum(["MALE", "FEMALE"], { message: "Vui lòng chọn giới tính" }),
});

export type UpdateInfo = z.infer<typeof updateInfoSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  openClassRegisterModal: () => void;
};

const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
];

function UpdateInformation({ isOpen, onClose, openClassRegisterModal }: Props) {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<UpdateInfo>({
    resolver: zodResolver(updateInfoSchema),
    defaultValues: {
      gender: "MALE",
    },
  });
  const { addToast } = useCustomToast();
  const handleUpdateInfoMutation = useMutation({
    mutationFn: (data: UpdateInfo) => updateUserInfo(data),
    onError: () => {
      addToast.error("Cập nhật thông tin thất bại");
    },
    onSuccess: () => {
      addToast.success("Cập nhật thông tin thành công");
      onClose();
      openClassRegisterModal();
    },
  });
  const onSubmit = (data: UpdateInfo) => {
    return handleUpdateInfoMutation.mutate(data);
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>Cập nhật thông tin</DialogHeader>
      <DialogContent>
        <form
          id="updateInfo"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Input
              className="text-[14px]"
              type="text"
              placeholder="Họ và tên"
              label="Họ và tên"
              required
              isError={errors.name !== undefined}
              errorMsg={errors.name?.message}
              {...register("name")}
            />
          </div>

          <div>
            <CustomDatePicker
              name="birthday"
              control={control}
              placeholder="dd/MM/yyyy"
              label="Ngày sinh"
              isError={errors.birthday !== undefined}
              errorMsg={errors.birthday?.message}
            />
          </div>

          <div>
            <Input
              className="text-[14px]"
              type="text"
              placeholder="Số điện thoại"
              label="Số điện thoại"
              required
              isError={errors.phone !== undefined}
              errorMsg={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <div>
            <Input
              className="text-[14px]"
              type="text"
              placeholder="Số điện thoại phụ huynh"
              label="Số điện thoại phụ huynh"
              isError={errors.parentPhone !== undefined}
              errorMsg={errors.parentPhone?.message}
              {...register("parentPhone")}
            />
          </div>

          <div>
            <Input
              className="text-[14px]"
              type="text"
              placeholder="Địa chỉ"
              label="Địa chỉ"
              required
              isError={errors.address !== undefined}
              errorMsg={errors.address?.message}
              {...register("address")}
            />
          </div>

          <CustomRadioGroup
            name="gender"
            control={control}
            label="Giới tính"
            options={genderOptions}
            error={errors.gender?.message}
          />
        </form>
        <div className="text-sm text-primary-darkest mt-3">
          * Vui lòng cập nhật đầy đủ thông tin để đăng ký học
        </div>
      </DialogContent>
      <DialogFooter>
        <Button
          form="updateInfo"
          className="w-full"
          isPending={handleUpdateInfoMutation.status === "pending"}
        >
          Cập nhật
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default memo(UpdateInformation);
