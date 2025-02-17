"use client";

import Link from "next/link";
import React, { useActionState, useEffect, useState } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import Image from "next/image";
import { Button } from "@/app/ui/components/_common/Button";
import { logIn, LoginFormState } from "@/app/lib/action";
import { useRouter } from "next/navigation";
// import { CustomError } from "@/app/types/type";
import { setTokens, setUserInfo } from "@/app/lib/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { login } from "@/app/lib/services/auth";

export default function Login({ isUser = true }: { isUser?: boolean }) {
  const router = useRouter();
  const [genId, setGenId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [loginError, setLoginError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initialState: LoginFormState = {
    errors: {
      genID: null,
      password: null,
    },
    message: null,
    accessToken: null,
    refreshToken: null,
  };
  const [state, action, isPending] = useActionState(logIn, initialState);

  useEffect(() => {
    const handleLogin = async () => {
      try {
        setIsLoading(true);
        const response = await login(genId, password, isUser);
        const defaultRoute = response.data.user.role.defaultRoute;
        if (
          (isUser && (defaultRoute === "ADMIN" || defaultRoute === "CLERK")) ||
          (!isUser && defaultRoute !== "ADMIN" && defaultRoute !== "CLERK")
        ) {
          throw new Error("Đăng nhập không hợp lệ");
        }
        setTokens(response.data.access_token, response.data.refresh_token);

        if (isUser) {
          setUserInfo(JSON.stringify(response.data.user));
        } else {
          localStorage.setItem("creator", response.data.user.name);
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }

        toast.success("Đăng nhập thành công ! Đang chuyển hướng", {
          position: "bottom-right",
          autoClose: 5000,
          closeOnClick: false,
          pauseOnHover: false,
        });
        switch (defaultRoute) {
          case "TEACHER":
            router.push("/teacher/classes");
            break;
          case "STUDENT":
            router.push("/student/home");
            break;
          case "ADMIN":
          case "CLERK":
            router.push("/admin/dashboard");
            break;
          default:
            break;
        }
      } catch {
        // const CustomError = error as CustomError;
        // if (CustomError.status === 400) {
        //   setLoginError(
        //     typeof CustomError.data === "string" ? CustomError.data : "",
        //   );
        //   setShowError(true);
        // }
        toast.error("Đăng nhập thất bại", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: false,
          closeOnClick: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (state.message === "Successful") {
      handleLogin();
    } else if (state.message === "Invalid form") {
      setShowError(true);
      return;
    }
  }, [state]);

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="flex flex-col items-center justify-center w-4/5 h-full bg-primary-light">
          <Image src="/logo.png" alt="Logo" width={280} height={280} />
          {isUser && (
            <h1 className="text-2xl font-semibold text-[#273526]">
              Học tập toàn diện, Vươn tầm tri thức
            </h1>
          )}
          {!isUser && (
            <h1 className="text-2xl font-semibold text-[#273526]">
              Chào mừng đến với trang quản lý hệ thống
            </h1>
          )}
        </div>
        <div className="flex relative items-center h-full justify-center w-full bg-background">
          <Image
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
          />

          <form
            action={action}
            className="bg-foreground py-20 px-16 rounded-3xl shadow-lg z-[100]"
          >
            <div className="text-[#F48C06] text-3xl font-bold flex justify-center">
              Đăng nhập
            </div>
            <div className="mt-6 mb-4 w-[350px]">
              <Input
                className="text-[14px]"
                name="genID"
                value={genId}
                type="text"
                placeholder="Nhập mã người dùng"
                label="Mã người dùng"
                onChange={(e) => {
                  setShowError(false);
                  setGenId(e.target.value);
                }}
                isError={showError}
                errorMsg={state?.errors?.genID && state?.errors?.genID[0]}
              />
            </div>
            <div>
              <Input
                className="text-[14px]"
                type="password"
                value={password}
                name="password"
                onChange={(e) => {
                  setShowError(false);
                  setPassword(e.target.value);
                }}
                placeholder="Nhập mật khẩu"
                label="Mật khẩu"
                isError={showError}
                errorMsg={state?.errors?.password && state?.errors?.password[0]}
              />
            </div>
            <div className="flex w-full justify-between mt-4 px-1">
              <div className="flex items-center justify-center">
                <input type="checkbox" id="rememberMe" className="mr-1" />
                <div className="text-sm text-gray-600">Ghi nhớ đăng nhập</div>
              </div>
              <div className="flex">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
            <Button
              className="mt-6 w-full"
              isPending={isPending || isLoading}
              disabled={isPending || isLoading}
              type="submit"
            >
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
