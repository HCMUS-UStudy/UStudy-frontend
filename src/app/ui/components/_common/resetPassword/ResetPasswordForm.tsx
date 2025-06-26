"use client";
import { Button } from "@/app/ui/components/_common/Button";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import React from "react";
import Loading from "@/app/ui/components/_common/loading/Loading";
import ResetPasswordAnimation from "@/app/ui/components/_common/resetPassword/ResetPasswordAnimation";

export default function ResetPasswordForm({
  onSubmit,
  errors,
  register,
  isLoading,
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
      className="bg-white/90 backdrop-blur-md py-6 px-4 md:py-8 md:px-10 rounded-3xl shadow-xl border border-primary-light/40 flex flex-col gap-4 max-w-md w-full mx-auto"
    >
      <div className="text-highlight-text text-2xl md:text-3xl font-bold flex justify-center">
        Đặt lại mật khẩu
      </div>
      <div className="flex flex-col items-center gap-0 mb-2">
        <ResetPasswordAnimation className="w-32 h-32 md:w-40 md:h-40 mx-auto -mb-4" />
      </div>
      <div className="flex flex-col items-center gap-0">
        <p className="text-gray-600 text-center text-sm md:text-lg max-w-xs mb-2">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>
      <div className="mt-2 mb-2 w-full max-w-xs md:max-w-md mx-auto">
        <Input
          id="password"
          className="text-base md:text-[14px]"
          type="password"
          placeholder="Nhập mật khẩu mới"
          label="Mật khẩu mới"
          isError={errors.password?.message !== undefined}
          errorMsg={errors.password?.message}
          {...register("password")}
        />
      </div>
      <div className="mb-2 w-full max-w-xs md:max-w-md mx-auto">
        <Input
          id="confirmPassword"
          className="text-base md:text-[14px]"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          label="Xác nhận mật khẩu"
          isError={errors.confirmPassword?.message !== undefined}
          errorMsg={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>
      <Button
        className="mt-2 w-full py-2 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center relative overflow-hidden"
        type="submit"
        disabled={isLoading || isLoadingBack}
      >
        <span className="flex items-center justify-center w-full transition-all duration-200 group-hover:-translate-x-2">
          {isLoading && (
            <Loading
              className="mr-2"
              customStyle={{ spinner: "w-5 h-5 border-white" }}
            />
          )}
          Xác nhận
        </span>
        {!isLoading && (
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
        )}
      </Button>
      <button
        type="button"
        className="text-xs md:text-sm text-gray-600 hover:underline focus:outline-none mt-2 group flex items-center justify-center gap-1"
        onClick={() => {
          setIsLoadingBack(true);
          router.push(backTo);
        }}
        disabled={isLoading || isLoadingBack}
      >
        <span className="relative flex items-center">
          {isLoadingBack ? (
            <Loading
              className="mr-1"
              customStyle={{ spinner: "w-4 h-4 border-gray-600" }}
            />
          ) : (
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
          )}
          Quay lại đăng nhập
        </span>
      </button>
    </form>
  );
}
