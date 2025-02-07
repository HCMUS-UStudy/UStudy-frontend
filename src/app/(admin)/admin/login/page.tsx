"use client";
import Image from "next/image";
 
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Input } from "@/app/ui/components/input";
import { Label } from "@/app/ui/components/label";
// import Image from "next/image";
import { HiEye, HiEyeOff, HiHome } from "react-icons/hi";
import { Button } from "@/app/ui/components/button";
import axios from "axios";
import Swal from "sweetalert2";
import { adminLogin } from "@/app/lib/api";
import { setTokens } from "@/app/lib/storage";

// export default function Login() {
//   useEffect(() => {
//     const authToken = localStorage.getItem("accessToken");
//     if (authToken) {
//       Swal.fire({
//         icon: "success",
//         title: "Bạn đã đăng nhập thành công",
//         timer: 9000,
//         showConfirmButton: false,
//       });
      
//       window.location.href = "/admin/dashboard";
//     }
//   }, []);
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");  
//   const [isFocused, setIsFocused] = useState({ username: false, password: false });
  
//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const response = await adminLogin(username, password);

//       if (response.status === 200) {
//         const token = response.data.access_token;
//         const refresh_token = response.data.refresh_token;
//         const creator = response.data.user.name;
//         const user = response.data.user;

//         setTokens(token, refresh_token);

//         localStorage.setItem("creator", creator);
//         localStorage.setItem("userData", JSON.stringify(user));

//         Swal.fire({
//           icon: "success",
//           title: "Đăng nhập thành công",
//           text: "Chào mừng quay trở lại!",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         window.location.href = "/admin/dashboard";
//       }
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         const message =
//           err.response?.data || "An error occurred. Please try again.";
//         Swal.fire({
//           icon: "error",
//           title: "Đăng nhập thất bại",
//           text: message,
//         });
//       } else {
//         const unexpectedError = "An unexpected error occurred.";
//         Swal.fire({
//           icon: "error",
//           title: "Đăng nhập thất bại",
//           text: unexpectedError,
//         });
//       }
//     }
//   };

//   return (
//     <>
//       <Head>
//         <link rel="preload" href="/bgLogin.jpg" as="image" />
//       </Head>
//       <main
//         className="h-screen flex items-center justify-center p-4 md:p-10"
//         style={{
//           background:
//             "linear-gradient(to bottom, rgba(91, 168, 160, 0.9), rgba(203, 229, 174, 0.8))",
//         }}>
//         <div
//           className="
//           grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 
//           bg-white rounded-[30px] shadow-lg overflow-hidden">

//           <div className="bg-[#D5E9F6] text-[#1E1E1E] flex items-center justify-center flex-col p-14 relative">
//             <Link
//               href="/"
//               className="absolute top-8 left-8 text-gray-600 hover:text-indigo-600">
//               <HiHome size={24} />
//             </Link>

//             <div className="mt-4 mb-10 text-center">
//               <div className="text-3xl font-bold flex justify-center">
//                 <div className="text-sky-700">US</div>tudy
//               </div>
//               <p className="mt-2 text-sm text-gray-600">
//                 Chào mừng đến với hệ thống quản lý học tập
//               </p>
//             </div>

//             <form className="w-full max-w-xs" onSubmit={handleLogin}>
//               <div className="relative mb-4">
//                 <Input
//                   className={`p-2 pl-4 bg-transparent rounded-full text-[#1E1E1E] border border-gray-400
//                           focus:border-indigo-600 focus:bg-white transition-all duration-200 
//                           ${isFocused.username ? "placeholder-transparent" : "placeholder-gray-400"}`}
//                   type="text"
//                   id="username"
//                   value={username}
//                   onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
//                   onFocus={() =>
//                     setIsFocused((prev) => ({ ...prev, username: true }))
//                   }
//                   onBlur={() =>
//                     setIsFocused((prev) => ({ ...prev, username: false }))
//                   }
//                   placeholder="Nhập mã người dùng"
//                   required
//                 />
//                 <Label
//                   htmlFor="username"
//                   className={`absolute left-4 transition-all duration-200 hover:cursor-auto ${
//                     isFocused.username || username
//                       ? "-top-3.5 text-xs text-indigo-600 bg-[#D5E9F6] px-1"
//                       : "top-1/2 transform -translate-y-1/2 text-transparent"
//                   }`}>
//                   Nhập mã người dùng
//                 </Label>
//               </div>

//               {/* Floating Label for Password */}
//               <div className="relative mb-6 mt-6">
//                 <Input
//                   className={`p-2 pl-4 bg-transparent rounded-full text-[#1E1E1E] border border-gray-400
//                     focus:border-indigo-600 focus:bg-white transition-all duration-200 
//                     ${isFocused.password ? "placeholder-transparent" : "placeholder-gray-400"}`}
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   value={password}
//                   onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
//                   onFocus={() =>
//                     setIsFocused((prev) => ({ ...prev, password: true }))
//                   }
//                   onBlur={() =>
//                     setIsFocused((prev) => ({ ...prev, password: false }))
//                   }
//                   placeholder="Nhập mật khẩu"
//                   required
//                 />
//                 <Label
//                   htmlFor="password"
//                   className={`absolute left-4 transition-all duration-200 hover:cursor-auto ${
//                     isFocused.password || password
//                       ? "-top-3.5 text-xs text-indigo-600 bg-[#D5E9F6] px-1"
//                       : "top-1/2 transform -translate-y-1/2 text-transparent"
//                   }`}>
//                   Nhập mật khẩu
//                 </Label>
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="pr-2 absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none">
//                   {showPassword ? (
//                     <HiEyeOff className="text-gray-600" />
//                   ) : (
//                     <HiEye className="text-gray-600" />
//                   )}
//                 </button>
//               </div>

//               <Button
//                 onClick={() => {}}
//                 type="submit"
//                 className="mt-6 w-full text-white rounded-l-full rounded-r-full font-semibold text-base transition-all duration-200 shadow-md transform hover:scale-105">
//                 Đăng nhập
//               </Button>

//               {/* Forgot Password Link */}
//               <div className="flex justify-end w-full mt-6 mb-2">
//                 <p className="text-[13px] text-gray-600">
//                   <a href="/forgot-password" className="hover:underline">
//                     Quên mật khẩu?
//                   </a>
//                 </p>
//               </div>
//             </form>

//           </div>
//           <div className="relative hidden md:flex items-center justify-center bg-cover">
//             <Image
//               className="object-cover w-full h-full"
//               fill
//               src="/bgLogin.jpg"
//               alt="Background Image"
//               sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
//               priority
//             />
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      {/* <h1>Admin Login</h1> */}
      <div className="flex flex-col items-center justify-center w-4/5 h-full bg-[#d5e9e1]">
        <Image
          src="/logo.png"
          alt="Logo"
          width={280}
          height={280}
        />
        <h1 className="text-2xl font-bold text-[#273526]">Học tập toàn diện, Vươn tầm tri thức</h1>
      </div>
      <div className="flex relative items-center h-full justify-center w-full bg-[#F6F5F5]">
        <Image className='absolute animate-fall_1 -top-[100px] opacity-50 left-[0%]' src='/Intersect.png' alt="Intersect" width={100} height={100} /> 
        <Image className='absolute animate-fall_2 -top-[100px] opacity-50 left-[22%]' src='/Intersect.png' alt="Intersect" width={100} height={100} /> 
        <Image className='absolute animate-fall_3 -top-[100px] opacity-50 left-[44%]' src='/Intersect.png' alt="Intersect" width={100} height={100} /> 
        <Image className='absolute animate-fall_4 -top-[100px] opacity-50 left-[66%]' src='/Intersect.png' alt="Intersect" width={100} height={100} /> 
        <Image className='absolute animate-fall_5 -top-[100px] opacity-50 left-[90%]' src='/Intersect.png' alt="Intersect" width={100} height={100} /> 
    
        <form className="bg-white py-16 px-16 rounded-3xl shadow-lg z-[100]">
          <div className="text-[#F48C06] text-3xl font-bold flex justify-center">Đăng nhập</div>
          <div className="mt-6 mb-4 w-[350px]">
            <Label className="text-[13px] ml-2" htmlFor="username">Mã người dùng</Label>
            <Input className="text-[14px]" id="username" type="text" placeholder="Nhập mã người dùng"/>
          </div>
          <div>
            <Label className="text-[13px] ml-2" htmlFor="password">Mật khẩu</Label>
            <Input className="text-[14px]" id="password" type="password" placeholder="Nhập mật khẩu" />
          </div>
          <div className="flex w-full justify-between mt-4 px-1">
            <div className="flex items-center justify-center">
              <input type="checkbox" id="rememberMe" className="mr-1" />
              <Label htmlFor="rememberMe" className="text-[13px] text-gray-600">Ghi nhớ đăng nhập</Label>
            </div>
            <div className="flex">
              <Link href="/forgot-password" className="text-[13px] text-gray-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          <button 
            className="flex w-full justify-center bg-[#AEDDCE] text-sm text-black font-semibold py-[12px] 
                      rounded-lg shadow-md mt-6 hover:bg-[#9ad7c3] transition duration-200 ease-in-out" 
            type="submit"
          >
            Đăng nhập
          </button>
          
          {/* <div className="flex w-full justify-center mt-5">
            <p className="text-[13px] text-gray-600">Bạn chưa có tài khoản? <Link href="/register" className="hover:underline">Đăng ký</Link></p>
          </div> */}
        </form>
      </div>
    </div>
  );
}