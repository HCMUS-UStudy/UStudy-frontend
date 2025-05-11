import React from "react";
import { Input } from "../../../_common/text-field/Input";
import { useFormContext } from "react-hook-form";
import { StudentRegisterInputs } from "@/app/register/page";
import { CustomDatePicker } from "../../../_common/text-field/CustomDatePicker";

export default function StudentBasicInformation() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<StudentRegisterInputs>();
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="flex flex-col gap-3">
        <div>
          <Input
            className="text-[14px]"
            type="text"
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
            isError={errors.retypePassword !== undefined}
            errorMsg={errors.retypePassword?.message}
            {...register("retypePassword")}
          />
        </div>
        <div>
          <Input
            className="text-[14px]"
            type="text"
            placeholder="Họ và tên"
            label="Họ và tên"
            isError={errors.name !== undefined}
            errorMsg={errors.name?.message}
            {...register("name")}
          />
        </div>
        <div>
          <Input
            className="text-[14px]"
            type="text"
            placeholder="abc@gmail.com..."
            label="Email"
            isError={errors.email !== undefined}
            errorMsg={errors.email?.message}
            {...register("email")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-full">
          <CustomDatePicker
            label="Ngày sinh"
            control={control}
            name="birthday"
            locale="vi_VN"
            showMonthDropdown
            showYearDropdown
            onCalendarClose={() => {}}
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
            placeholder="VD: 227 Nguyễn Văn Cừ, P. Bến Thành, Quận 5, TP.HCM"
            label="Địa chỉ"
            isError={errors.address !== undefined}
            errorMsg={errors.address?.message}
            {...register("address")}
          />
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-gray-700">Giới tính:{"  "}</h1>
          <div className="flex items-center gap-2">
            <label
              htmlFor="MALE"
              className="cursor-pointer h-8 w-8 bg-background border-2  rounded-full flex justify-center items-center relative"
            >
              <input
                type="radio"
                id="MALE"
                className="hidden peer"
                value={"MALE"}
                {...register("gender")}
              />
              <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
              <div className="w-4 h-4 bg-primary-darkest scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
            </label>
            <span>Nam</span>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="FEMALE"
              className="cursor-pointer h-8 w-8 bg-background border-2  rounded-full flex justify-center items-center relative"
            >
              <input
                type="radio"
                id="FEMALE"
                className="hidden peer"
                value={"FEMALE"}
                {...register("gender")}
              />
              <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
              <div className="w-4 h-4 bg-primary-darkest scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
            </label>
            <span>Nữ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
