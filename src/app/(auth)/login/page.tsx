"use client";

import React, { useState } from "react";
import Head from "next/head";
import { Input } from "@/app/ui/components/input";
import { Label } from "@/app/ui/components/label";
import Image from "next/image";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Button from "@/app/ui/components/button";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Head>
        <link rel="preload" href="/bgLogin.jpg" as="image" />{" "}
        {/* Preload image */}
      </Head>
      <main
        className="h-screen flex items-center justify-center p-4 md:p-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(91, 168, 160, 0.9), rgba(203, 229, 174, 0.8))",
        }}>
        <div className="grid w-full h-[60vh] max-w-7xl grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Login Form Section */}
          <div className="bg-[#D5E9F6] text-[#1E1E1E] flex items-center justify-center flex-col p-8">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold">Login</h1>
              <p className="mt-2 text-sm text-gray-600">
                Empower Your Education and Achieve Your Goals
              </p>
            </div>

            <form className="w-full max-w-xs">
              <Label htmlFor="email" className="mb-1">
                Email*
              </Label>
              <Input
                className="mb-4 p-2 bg-transparent rounded-full text-[#1E1E1E] border border-gray-400 focus:border-indigo-600 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
              <Label htmlFor="password" className="mb-1">
                Password*
              </Label>
              <div className="relative mb-6">
                <Input
                  className="p-2 bg-transparent rounded-full text-[#1E1E1E] border border-gray-400 focus:border-indigo-600 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  type={showPassword ? "text" : "password"} // Toggle input type
                  id="password"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none">
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
                className="w-full text-white rounded-full font-semibold text-base transition-all duration-200 shadow-md transform hover:scale-105">
                Login
              </Button>

              {/* Move Forgot Password link here */}
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
