import Image from "next/image";
import React from "react";
import { Input } from "../ui/components/_common/text-field/Input";
import Link from "next/link";
import { Button } from "../ui/components/_common/Button";

export default function StudentRegister() {
  return (
    <>
      <div className="flex items-center justify-center h-screen overflow-auto">
        {/* <div className="flex flex-col items-center justify-center w-4/5 h-full bg-primary-light">
          <Image src="/logo.png" alt="Logo" width={280} height={280} />

          <h1 className="text-2xl font-semibold text-[#273526]">
            Trở thành một học viên của UStudy
          </h1>
        </div> */}
        <div className="flex relative items-center h-full justify-center w-full bg-primary-light">
          {/* <Image
            className="absolute animate-fall_1 -top-[100px] opacity-50 left-[0%]"
            src="/Intersect.png"
            alt="Intersect"
            width={100}
            height={100}
          />
          <Image
            className="absolute animate-fall_2 -top-[100px] opacity-50 left-[22%]"
            src="/Intersect.png"
            alt="Intersect"
            width={100}
            height={100}
          />
          <Image
            className="absolute animate-fall_3 -top-[100px] opacity-50 left-[44%]"
            src="/Intersect.png"
            alt="Intersect"
            width={100}
            height={100}
          />
          <Image
            className="absolute animate-fall_4 -top-[100px] opacity-50 left-[66%]"
            src="/Intersect.png"
            alt="Intersect"
            width={100}
            height={100}
          />
          <Image
            className="absolute animate-fall_5 -top-[100px] opacity-50 left-[90%]"
            src="/Intersect.png"
            alt="Intersect"
            width={100}
            height={100}
          /> */}

          <form
            // onSubmit={handleSubmit(onSubmit)}
            className="bg-foreground py-10 px-12 rounded-3xl shadow-lg z-[100] flex flex-col gap-5 w-1/3"
          >
            <div className="text-[#F48C06] text-3xl font-bold mb-3 flex justify-center">
              Ghi danh
            </div>
            <div>
              <Input
                className="text-[14px]"
                type="text"
                placeholder="Họ và tên"
                label="Họ và tên"
              />
            </div>
            <div>
              <Input
                className="text-[14px]"
                type="text"
                placeholder="Email"
                label="Email"
              />
            </div>
            <div>
              <Input
                className="text-[14px]"
                type="date"
                placeholder="Ngày sinh"
                label="Ngày sinh"
              />
            </div>
            <div>
              <Input
                className="text-[14px]"
                type="text"
                placeholder="Số điện thoại"
                label="Số điện thoại"
              />
            </div>
            <div>
              <Input
                className="text-[14px]"
                type="text"
                placeholder="Số điện thoại phụ huynh"
                label="Số điện thoại phụ huynh"
              />
            </div>
            <div>
              <Input
                className="text-[14px]"
                type="text"
                placeholder="Địa chỉ"
                label="Địa chỉ"
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
                    name="gender"
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
                    name="gender"
                  />
                  <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-primary-darkest scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Nữ</span>
              </div>
            </div>

            <Button className="mt-6 w-full" type="submit">
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
