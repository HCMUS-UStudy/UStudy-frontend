"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import Image from "next/image";
import { Button } from "@/app/ui/components/_common/Button";
import { setTokensAndUserDataCookies } from "@/app/lib/action";
import { usePathname, useRouter } from "next/navigation";
import { login, loginByGoogle } from "@/app/lib/services/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomError } from "@/app/types/common";
import { useDispatch } from "react-redux";
import { setPermissions } from "@/app/store/PermissionScreenSlice";
import { useMutation } from "@tanstack/react-query";
import { setChildren, setSelectedChild } from "@/app/store/ChildrenSlice";
import Loading from "./loading/Loading";
import Cookies from "js-cookie";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import Link from "next/link";
import { setUserData } from "@/app/store/userSlice";
import { AuthResponse } from "@/app/types";

const LogInSchema = z.object({
  username: z
    .string({ message: "Vui lòng nhập tên tài khoản" })
    .min(1, { message: "Vui lòng nhập tên tài khoản" }),
  password: z
    .string({ message: "Vui lòng nhập mật khẩu" })
    .min(1, { message: "Vui lòng nhập mật khẩu" }),
});

type LogInInputs = z.infer<typeof LogInSchema>;

// Hàm mã hóa phía client (AES-GCM, base64 key)
async function encryptClient(
  plainData: string,
  base64Key: string,
): Promise<{ encryptedData: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encoded = encoder.encode(plainData);
  const key = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0)),
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );
  return {
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

async function decryptClient(
  encryptedData: string,
  iv: string,
  base64Key: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0)),
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );
  const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0),
  );
  const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    encryptedBytes,
  );
  return new TextDecoder().decode(decrypted);
}

export default function Login() {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const isUser = pathname === "/login";
  const isAdmin = pathname?.startsWith("/admin/login");
  const dispatch = useDispatch();
  const [isLoadingForgot, setIsLoadingForgot] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { addToast } = useCustomToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
  } = useForm<LogInInputs>({ resolver: zodResolver(LogInSchema) });

  // Tách riêng phần xử lý response
  const handleLoginSuccess = (response: AuthResponse) => {
    const defaultRoute = response.data.user.role.defaultRoute;
    let userDataToSave = response.data.user;

    if (defaultRoute === "PARENT") {
      userDataToSave = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(response.data.user as any),
        children: response.data.children ?? [],
      };
    }

    setTokensAndUserDataCookies(
      response.data.access_token,
      response.data.refresh_token,
      JSON.stringify(userDataToSave),
      JSON.stringify(response.data.screens),
    );

    dispatch(setPermissions(response.data.screens));
    dispatch(setUserData(userDataToSave));

    if (defaultRoute === "PARENT") {
      dispatch(setChildren(response.data.children ?? []));
      dispatch(
        setSelectedChild(
          response.data.children ? response.data.children[0] : null,
        ),
      );
    }

    addToast.success("Đăng nhập thành công");

    switch (defaultRoute) {
      case "TEACHER":
        router.push("/teacher/classes");
        break;
      case "STUDENT":
        if (response.data.user.hadClass) {
          router.push("/member/home");
        } else {
          router.push("/member/class-register");
        }
        break;
      case "PARENT":
        router.push("/member/tuition");
        break;
      case "ADMIN":
        router.push("/admin/dashboard");
        break;
    }
  };

  const useLoginMutation = useMutation({
    mutationFn: (data: LogInInputs) =>
      login(data.username, data.password, isUser),
    onError: (error) => {
      const customError = error as CustomError;
      setError("username", { message: String(customError.data || "") });
      setError("password", { message: String(customError.data || "") });
    },
    onSuccess: handleLoginSuccess,
  });

  // Thêm hàm helper để lấy cookie prefix
  const getCookiePrefix = () => (isUser ? "user_" : "admin_");

  useEffect(() => {
    const getRemembered = async () => {
      const prefix = getCookiePrefix();
      const encrypted = Cookies.get(`${prefix}rememberedLogin`);
      const iv = Cookies.get(`${prefix}rememberedLogin_iv`);
      const key = process.env.NEXT_PUBLIC_COOKIES_SECRET_LOGIN_KEY;
      if (encrypted && iv && key) {
        try {
          const decrypted = await decryptClient(encrypted, iv, key);
          const { username, password } = JSON.parse(decrypted);
          setValue("username", username);
          setValue("password", password);
          setRememberMe(true);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          Cookies.remove(`${prefix}rememberedLogin`);
          Cookies.remove(`${prefix}rememberedLogin_iv`);
        }
      }
    };
    getRemembered();
  }, [setValue, isUser]);

  const onSubmit = async (data: LogInInputs) => {
    const key = process.env.NEXT_PUBLIC_COOKIES_SECRET_LOGIN_KEY;
    const prefix = getCookiePrefix();
    if (rememberMe && key) {
      const expireDays = 3;
      const encrypted = await encryptClient(JSON.stringify(data), key);
      Cookies.set(`${prefix}rememberedLogin`, encrypted.encryptedData, {
        expires: expireDays,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set(`${prefix}rememberedLogin_iv`, encrypted.iv, {
        expires: expireDays,
        secure: true,
        sameSite: "strict",
      });
    } else {
      Cookies.remove(`${prefix}rememberedLogin`);
      Cookies.remove(`${prefix}rememberedLogin_iv`);
    }
    useLoginMutation.mutate(data);
  };

  const handleGoogleLogin = async () => {
    try {
      // Redirect to Google OAuth URL
      const response = await loginByGoogle();
      if (response?.data) {
        window.location.href = response.data;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      addToast.error("Đăng nhập Google thất bại");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="hidden lg:flex flex-col items-center justify-center w-4/5 h-full bg-primary-light">
          <div className="relative  lg:h-[80px] lg:w-[250px] xl:h-[100px] xl:w-[300px]">
            <Image className="object-contain" src="/logo.png" alt="Logo" fill />
          </div>
          {isUser && (
            <h1 className="text-xl xl:text-2xl font-semibold text-[#273526]">
              Học tập toàn diện, Vươn tầm tri thức
            </h1>
          )}
          {!isUser && (
            <h1 className="text-xl xl:text-2xl font-semibold text-[#273526]">
              Chào mừng đến với trang quản lý hệ thống
            </h1>
          )}
        </div>
        <div className="flex relative items-center h-full justify-center w-full bg-primary-light lg:bg-background">
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
            onSubmit={handleSubmit(onSubmit)}
            className="bg-foreground p-10 lg:px-12 xl:px-16 xl:pt-16 xl:pb-14 rounded-3xl shadow-lg z-[100]"
          >
            <div className="text-[#F48C06] text-2xl md:text-3xl font-bold flex justify-center">
              Đăng nhập
            </div>
            <div className="mt-8 mb-4 w-[250px] md:w-[350px]">
              <Input
                type="text"
                placeholder="Nhập tên tài khoản"
                label="Tên tài khoản"
                isError={errors.username?.message !== undefined}
                errorMsg={errors.username?.message}
                {...register("username")}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                label="Mật khẩu"
                isError={errors.password !== undefined}
                errorMsg={errors.password?.message}
                {...register("password")}
              />
            </div>
            <div className="flex flex-col gap-2 md:flex-row w-full justify-end mt-4 px-1">
              {/* <div className="flex items-center">
                <SmallCheckbox
                  labelText="Ghi nhớ đăng nhập"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="mr-1"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div> */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:underline focus:outline-none flex items-center"
                  onClick={() => {
                    setIsLoadingForgot(true);
                    router.push(
                      isUser ? "/forgot-password" : "/admin/forgot-password",
                    );
                  }}
                  disabled={isLoadingForgot}
                >
                  {isLoadingForgot && (
                    <Loading
                      className="mr-1"
                      customStyle={{
                        spinner: "w-4 h-4 border-gray-600",
                      }}
                    />
                  )}
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            <Button
              isPending={useLoginMutation.status === "pending"}
              className="mt-4 w-full"
              type="submit"
            >
              Đăng nhập
            </Button>

            {!isAdmin && (
              <Button
                onClick={handleGoogleLogin}
                type="button"
                className="mt-4 w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white hover:bg-primary-lighter transition-all duration-200"
              >
                {/* SVG logo Google */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="20"
                  height="20"
                >
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.3 1.54 7.74 2.84l5.64-5.64C33.18 3.58 28.92 2 24 2 14.84 2 7.14 7.84 3.64 15.76l6.84 5.32C12.26 13.14 17.6 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.5 24.5c0-1.62-.15-3.18-.42-4.68H24v9.1h12.68c-.54 2.84-2.15 5.24-4.54 6.86l7.04 5.47c4.12-3.8 6.32-9.38 6.32-15.75z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.48 28.38A13.94 13.94 0 0 1 9.5 24c0-1.52.26-2.98.73-4.38l-6.84-5.32A21.94 21.94 0 0 0 2 24c0 3.54.84 6.9 2.34 9.88l6.14-5.5z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 46c5.94 0 10.92-1.96 14.56-5.32l-7.04-5.47c-2.02 1.36-4.6 2.16-7.52 2.16-6.4 0-11.74-3.64-14.52-8.86l-6.14 5.5C7.14 40.16 14.84 46 24 46z"
                  />
                  <path fill="none" d="M2 2h44v44H2z" />
                </svg>
                <span className="text-gray-700 font-medium">
                  Đăng nhập bằng Google
                </span>
              </Button>
            )}

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
              <Link
                href={"/register"}
                className="text-sm font-semibold text-primary-dark hover:text-primary-darkest underline-offset-4 hover:underline transition-colors duration-200"
              >
                Đăng ký ngay
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
