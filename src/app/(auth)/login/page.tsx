"use client";

import Link from "next/link";
import React, { useActionState, useEffect, useState } from "react";
import Head from "next/head";
import { Input } from "@/app/ui/components/common/Input";
import Image from "next/image";
import { HiHome } from "react-icons/hi";
import { Button } from "@/app/ui/components/common/Button";
import { logIn, LoginFormState } from "@/app/lib/action";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { CustomError } from "@/app/types/type";
import { setTokens, setUserInfo } from "@/app/lib/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Logo from "@/app/ui/components/common/Logo";
import Loading from "@/app/ui/components/common/Loading";
import { userLogin } from "@/app/lib/services/auth";

export default function Login() {
  const router = useRouter();
  const [genId, setGenId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
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
        const response = await userLogin(genId, password);
        setTokens(response.data.access_token, response.data.refresh_token);
        setUserInfo(JSON.stringify(response.data.user));

        const role = response.data.user.role;
        switch (role) {
          case "CLERK":
            router.push("/clerk/dashboard");
            toast.success("Đăng nhập thành công ! Đang chuyển hướng", {
              position: "bottom-right",
              autoClose: 5000,
              closeOnClick: false,
              pauseOnHover: false,
            });
            break;
          case "TEACHER":
            router.push("/teacher/classes");
            break;
          case "STUDENT":
            router.push("/student/home");
            break;
          default:
            break;
        }
      } catch (error: unknown) {
        const CustomError = error as CustomError;
        if (CustomError.status === 400) {
          setLoginError(
            typeof CustomError.data === "string" ? CustomError.data : "",
          );
          setShowError(true);
        }
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
      <Head>
        <link rel="preload" href="/bgLogin.jpg" as="image" />
      </Head>
      <main
        className="h-screen flex items-center justify-center p-4 md:p-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(91, 168, 160, 0.9), rgba(203, 229, 174, 0.8))",
        }}
      >
        <div
          className="
          grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 
          bg-white rounded-[30px] shadow-lg overflow-hidden"
        >
          {/* Login Form Section */}
          <div className="bg-[#D5E9F6] text-[#1E1E1E] flex items-center justify-center flex-col p-14 relative">
            {/* Back to Home Icon */}
            <Link
              href="/"
              className="absolute top-8 left-8 text-gray-600 hover:text-indigo-600"
            >
              <HiHome size={24} />
            </Link>

            <div className="mt-4 mb-10 text-center">
              <Logo />
              <p className="mt-2 text-sm text-gray-600">
                Chào mừng đến với hệ thống quản lý học tập
              </p>
            </div>

            <form action={action} className="w-full max-w-xs">
              {/* Floating Label for Email */}
              <Input
                type="text"
                name="genID"
                value={genId}
                onChange={(e) => {
                  setShowError(false);
                  setGenId(e.target.value);
                }}
                placeholder="Nhập mã người dùng"
                label="Mã người dùng"
                isError={showError}
                errorMsg={
                  (state?.errors?.genID && state?.errors?.genID[0]) ||
                  loginError
                }
              />

              {/* Floating Label for Password */}
              <div className="mt-6">
                <Input
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
                  errorMsg={
                    (state?.errors?.password && state?.errors?.password[0]) ||
                    loginError
                  }
                />
              </div>

              <Button
                isPending={isPending || isLoading}
                disabled={isPending || isLoading}
                type="submit"
                className={clsx(
                  {
                    "hover:scale-105": !isPending,
                  },
                  "mt-6 w-full",
                )}
              >
                Đăng nhập
              </Button>

              {/* Forgot Password Link */}
              <div className="flex justify-end w-full mt-6 mb-2">
                <p className="text-[13px] text-gray-600">
                  <a href="/forgot-password" className="hover:underline">
                    Quên mật khẩu?
                  </a>
                </p>
              </div>
            </form>

            {/* <p className="mt-6 text-xs text-gray-600">
              &copy; 2024 All rights reserved
            </p> */}
          </div>

          {/* Image Section */}
          <div className="relative hidden md:flex items-center justify-center bg-cover">
            <Image
              className="object-cover w-full h-full"
              fill
              src="/bgLogin.jpg"
              alt="Background Image"
              sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
              priority
            />
          </div>
        </div>
      </main>
    </>
  );
}
