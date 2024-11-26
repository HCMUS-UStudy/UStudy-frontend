  "use client";

  import Link from "next/link";
  import React, { useEffect, useState } from "react";
  import Head from "next/head";
  import { Input } from "@/app/ui/components/input";
  import { Label } from "@/app/ui/components/label";
  import Image from "next/image";
  import { HiEye, HiEyeOff, HiHome } from "react-icons/hi";
  import { Button } from "@/app/ui/components/button";
  import axios from "axios";
  import Swal from "sweetalert2";

  export default function Login() {

    useEffect(() => {
      const authToken = localStorage.getItem("authToken");
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

    const [showPassword, setShowPassword] = useState(false);
    const [genId, setgenId] = useState("");
    const [password, setPassword] = useState("");
    const [isFocused, setIsFocused] = useState({ genId: false, password: false });
    const [errorMessage, setErrorMessage] = useState("");

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage("");

      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/admin/login",
          {
            genId,
            password,
          }
        );

        if (response.status === 200) {
          const token = response.data.access_token;
          const creator = response.data.user.name;
          const user = response.data.user;

          localStorage.setItem("authToken", token);
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
          setErrorMessage(message);
        } else {
          const unexpectedError = "An unexpected error occurred.";
          setErrorMessage("An unexpected error occurred.");
          Swal.fire({
            icon: "error",
            title: "Đăng nhập thất bại",
            text: unexpectedError,
          });
        }
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
          }}>
          <div
            className="
            grid w-full h-[60vh] max-w-7xl grid-cols-1 md:grid-cols-2 
            bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Login Form Section */}
            <div className="bg-[#D5E9F6] text-[#1E1E1E] flex items-center justify-center flex-col p-8 relative">
              {/* Back to Home Icon */}
              <Link
                href="/"
                className="absolute top-4 left-4 text-gray-600 hover:text-indigo-600">
                <HiHome size={24} />
              </Link>

              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold">Login</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Empower Your Education and Achieve Your Goals
                </p>
              </div>

              <form className="w-full max-w-xs" onSubmit={handleLogin}>
                {/* Floating Label for genId */}
                <div className="relative mb-4">
                  <Input
                    className="p-2 pl-4 bg-transparent rounded-full text-[#1E1E1E] border border-gray-400 focus:border-indigo-600 focus:bg-white transition-all duration-200 placeholder-transparent"
                    type="string"
                    id="genId"
                    value={genId}
                    onChange={(e) => setgenId(e.target.value)}
                    onFocus={() =>
                      setIsFocused((prev) => ({ ...prev, genId: true }))
                    }
                    onBlur={() =>
                      setIsFocused((prev) => ({ ...prev, genId: false }))
                    }
                    placeholder="Enter your genId"
                    required
                  />
                  <Label
                    htmlFor="genId"
                    className={`absolute left-4 transition-all duration-200 ${
                      isFocused.genId || genId
                        ? "-top-3.5 text-xs text-indigo-600 bg-[#D5E9F6] px-1"
                        : "top-1/2 transform -translate-y-1/2 text-gray-400"
                    }`}>
                    Enter your genId
                  </Label>
                </div>

                {/* Floating Label for Password */}
                <div className="relative mb-6 mt-6">
                  <Input
                    className="p-2 pl-4 bg-transparent rounded-full text-[#1E1E1E] border border-gray-400 focus:border-indigo-600 focus:bg-white transition-all duration-200 placeholder-transparent"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() =>
                      setIsFocused((prev) => ({ ...prev, password: true }))
                    }
                    onBlur={() =>
                      setIsFocused((prev) => ({ ...prev, password: false }))
                    }
                    placeholder="Enter your password"
                    required
                  />
                  <Label
                    htmlFor="password"
                    className={`absolute left-4 transition-all duration-200 ${
                      isFocused.password || password
                        ? "-top-3.5 text-xs text-indigo-600 bg-[#D5E9F6] px-1"
                        : "top-1/2 transform -translate-y-1/2 text-gray-400"
                    }`}>
                    Enter your password
                  </Label>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="pr-2 absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none">
                    {showPassword ? (
                      <HiEyeOff className="text-gray-600" />
                    ) : (
                      <HiEye className="text-gray-600" />
                    )}
                  </button>
                </div>

                <Button
                  onClick={() => {}}
                  type="submit"
                  className="mt-6 w-full text-white rounded-l-full rounded-r-full font-semibold text-base transition-all duration-200 shadow-md transform hover:scale-105">
                  Login
                </Button>

                {/* Forgot Password Link */}
                <div className="flex justify-end w-full mt-4">
                  <p className="text-xs text-gray-600">
                    <a href="/forgot-password" className="hover:underline">
                      Forgot Password?
                    </a>
                  </p>
                </div>
              </form>

              <p className="mt-6 text-xs text-gray-600">
                &copy; 2024 All rights reserved
              </p>
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
