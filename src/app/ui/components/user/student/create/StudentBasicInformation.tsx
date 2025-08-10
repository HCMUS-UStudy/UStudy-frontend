import React from "react";
import { Input } from "../../../_common/text-field/Input";
import { useFormContext } from "react-hook-form";
import { StudentRegisterInputs } from "@/app/register/page";
import { CustomDatePicker } from "../../../_common/text-field/CustomDatePicker";
import { CustomRadioGroup } from "../../../_common/text-field/CustomRadioGroup";

export default function StudentBasicInformation() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<StudentRegisterInputs>();

  const genderOptions = [
    { value: "MALE", label: "Nam" },
    { value: "FEMALE", label: "Nữ" },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        <div>
          <Input
            className="text-[14px]"
            type="text"
            required
            placeholder="Tên tài khoản"
            label="Tên tài khoản"
            isError={errors.username !== undefined}
            errorMsg={errors.username?.message}
            {...register("username")}
          />
        </div>
        <div>
          <Input
            className="text-[14px]"
            type="password"
            placeholder="Mật khẩu"
            label="Mật khẩu"
            required
            isError={errors.password !== undefined}
            errorMsg={errors.password?.message}
            {...register("password")}
          />
        </div>
        <div>
          <Input
            className="text-[14px]"
            type="password"
            placeholder="Nhập lại mật khẩu"
            label="Nhập lại mật khẩu"
            required
            isError={errors.retypePassword !== undefined}
            errorMsg={errors.retypePassword?.message}
            {...register("retypePassword")}
          />
        </div>
        <div>
          <Input
            className="text-[14px]"
            type="text"
            placeholder="Nhập địa chỉ email..."
            label="Email"
            required
            isError={errors.email !== undefined}
            errorMsg={errors.email?.message}
            {...register("email")}
          />
        </div>
        {/* <div>
          <Input
            className="text-[14px]"
            type="text"
            placeholder="Họ và tên"
            label="Họ và tên"
            isError={errors.name !== undefined}
            errorMsg={errors.name?.message}
            {...register("name")}
          />
        </div> */}
      </div>
      {/* <div className="flex flex-col gap-3">
        <div className="w-full">
          <CustomDatePicker
            label="Ngày sinh"
            control={control}
            name="birthday"
            isError={errors.birthday !== undefined}
            errorMsg={errors.birthday?.message}
          />
        </div>
        <div>
          <Input
            className="text-[14px]"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Số điện thoại"
            label="Số điện thoại"
            isError={errors.phone !== undefined}
            errorMsg={errors.phone?.message}
            {...register("phone")}
          />
        </div>
        <div>
          <Input
            className="text-[14px]"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
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
            placeholder="VD: 227 Nguyễn Văn Cừ, P. Bến Thành, Quận 5, TP.HCM"
            label="Địa chỉ"
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
      </div> */}
    </div>
  );
}
