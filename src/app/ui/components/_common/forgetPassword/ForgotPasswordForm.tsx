"use client";
import { Button } from "@/app/ui/components/_common/Button";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import React from "react";

export default function ForgotPasswordForm({
  onSubmit,
  errors,
  register,
  isLoadingBack,
  router,
  setIsLoadingBack,
  handleSubmit,
  backTo = "/login",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/90 backdrop-blur-md py-8 px-6 md:px-10 rounded-3xl shadow-xl border border-primary-light/40 flex flex-col gap-4"
    >
      <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-dark via-highlight-text to-primary-darker drop-shadow-lg text-center -mt-2">
        Quên mật khẩu
      </div>
      <div className="mt-2 mb-2 w-[250px] md:w-[350px]">
        <Input
          id="email"
          className="text-base md:text-[14px]"
          type="email"
          placeholder="Nhập email của bạn"
          label="Email"
          isError={errors.email?.message !== undefined}
          errorMsg={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Button
        className="group mt-2 w-full bg-gradient-to-r from-primary-dark to-highlight-text text-white font-bold py-2 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center relative overflow-hidden"
        type="submit"
      >
        <span className="flex items-center justify-center w-full transition-all duration-200 group-hover:-translate-x-2">
          Gửi email xác nhận
        </span>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </Button>
      <button
        type="button"
        className="text-sm text-gray-600 hover:underline focus:outline-none mt-2 group flex items-center justify-center gap-1"
        onClick={() => {
          setIsLoadingBack(true);
          router.push(backTo);
        }}
        disabled={isLoadingBack}
      >
        <span className="relative flex items-center">
          <svg
            className="w-4 h-4 mr-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại đăng nhập
        </span>
      </button>
    </form>
  );
}
