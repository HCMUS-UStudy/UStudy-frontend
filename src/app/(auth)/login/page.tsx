"use client";

import Link from "next/link";
import React, { useActionState, useState } from "react";
import Head from "next/head";
import { Input } from "@/app/ui/components/input";
import { Label } from "@/app/ui/components/label";
import Image from "next/image";
import { HiEye, HiEyeOff, HiHome } from "react-icons/hi";
import { Button } from "@/app/ui/components/button";
import { logIn, LoginFormState } from "@/app/lib/action";
import clsx from "clsx";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const initialState: LoginFormState = {
    errors: {},
    message: null,
  };
  const [state, action, isPending] = useActionState(logIn, initialState);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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

            <form action={action} className="w-full max-w-xs">
              {/* Floating Label for Email */}
              <div className="relative">
                <Input
                  className={clsx(
                    {
                      "border-rose-600": state?.errors?.email,
                      "border-gray-400": !state?.errors?.email,
                    },
                    "p-2 pl-4 bg-transparent rounded-full text-[#1E1E1E] border focus:border-indigo-600 focus:bg-white transition-all duration-200 placeholder-transparent"
                  )}
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, email: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, email: false }))
                  }
                  placeholder="Enter your email"
                />
                <Label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 ${
                    isFocused.email || email
                      ? "-top-3.5 text-xs text-indigo-600 bg-[#D5E9F6] px-1"
                      : "top-1/2 transform -translate-y-1/2 text-gray-400"
                  }`}>
                  Enter your email
                </Label>
              </div>
              {state?.errors?.email && (
                <span className="text-[13px] ml-3 text-error">
                  {state.errors.email}
                </span>
              )}

              {/* Floating Label for Password */}
              <div className="relative mt-6">
                <Input
                  className={clsx(
                    {
                      "border-rose-600": state?.errors?.password,
                      "border-gray-400": !state?.errors?.password,
                    },
                    "p-2 pl-4 bg-transparent rounded-full text-[#1E1E1E] border focus:border-indigo-600 focus:bg-white transition-all duration-200 placeholder-transparent"
                  )}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, password: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, password: false }))
                  }
                  placeholder="Enter your password"
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
              {state?.errors?.password && (
                <span className="text-[13px] ml-3 text-error">
                  {state.errors.password}
                </span>
              )}

              <Button
                disabled={isPending}
                type="submit"
                className={clsx(
                  {
                    "hover:scale-105": !isPending,
                  },
                  "mt-6 w-full text-white rounded-l-full rounded-r-full font-semibold text-base transition-all duration-200 shadow-md transform "
                )}>
                {isPending ? "Processing..." : "Log in"}
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
