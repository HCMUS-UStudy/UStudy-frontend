"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Input } from "@/app/ui/components/common/Input";
import Image from "next/image";
import { HiHome } from "react-icons/hi";
import { Button } from "@/app/ui/components/common/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { adminLogin } from "@/app/lib/api";
import { setTokens } from "@/app/lib/storage";

export default function Login() {
  useEffect(() => {
    const authToken = localStorage.getItem("accessToken");
    if (authToken) {
      Swal.fire({
        icon: "success",
        title: "Bạn đã đăng nhập thành công",
        timer: 9000,
        showConfirmButton: false,
      });

      window.location.href = "/admin/dashboard";
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await adminLogin(username, password);

      if (response.status === 200) {
        const token = response.data.data.access_token;
        const refresh_token = response.data.data.refresh_token;
        const creator = response.data.data.user.name;
        const user = response.data.data.user;

        setTokens(token, refresh_token);

        localStorage.setItem("creator", creator);
        localStorage.setItem("userData", JSON.stringify(user));

        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công",
          text: "Chào mừng quay trở lại!",
          timer: 2000,
          showConfirmButton: false,
        });
        window.location.href = "/admin/dashboard";
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data || "An error occurred. Please try again.";
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: message,
        });
      } else {
        const unexpectedError = "An unexpected error occurred.";
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: unexpectedError,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
              <div className="text-3xl font-bold flex justify-center">
                <div className="text-sky-700">US</div>tudy
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Chào mừng đến với hệ thống quản lý học tập
              </p>
            </div>

            <form className="w-full max-w-xs" onSubmit={handleLogin}>
              {/* Floating Label for Username */}
              <div className="relative mb-4">
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) =>
                    setUsername((e.target as HTMLInputElement).value)
                  }
                  placeholder="Nhập mã người dùng"
                  label="Mã người dùng"
                  required
                />
              </div>

              {/* Floating Label for Password */}
              <div className="relative mb-6 mt-6">
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) =>
                    setPassword((e.target as HTMLInputElement).value)
                  }
                  placeholder="Nhập mật khẩu"
                  label="Mật khẩu"
                  required
                />
              </div>

              <Button
                type="submit"
                className="mt-6 w-full hover:scale-105"
                isPending={isLoading}
                disabled={isLoading}
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
