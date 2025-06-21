"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import Image from "next/image";
import { Button } from "@/app/ui/components/_common/Button";
import { setTokensAndUserDataCookies } from "@/app/lib/action";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login } from "@/app/lib/services/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomError } from "@/app/types/common";
import { useDispatch } from "react-redux";
import { setPermissions } from "@/app/store/PermissionScreenSlice";
import { useMutation } from "@tanstack/react-query";
import { setChildren, setSelectedChild } from "@/app/store/ChildrenSlice";
import Loading from "./loading/Loading";

const LogInSchema = z.object({
  username: z
    .string({ message: "Vui lòng nhập tên tài khoản" })
    .min(1, { message: "Vui lòng nhập tên tài khoản" }),
  password: z
    .string({ message: "Vui lòng nhập mật khẩu" })
    .min(1, { message: "Vui lòng nhập mật khẩu" }),
});

type LogInInputs = z.infer<typeof LogInSchema>;

export default function Login() {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const isUser = pathname === "/login";
  const dispatch = useDispatch();
  const [isLoadingForgot, setIsLoadingForgot] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
  } = useForm<LogInInputs>({ resolver: zodResolver(LogInSchema) });

  const useLoginMutation = useMutation({
    mutationFn: (data: LogInInputs) =>
      login(data.username, data.password, isUser),
    onError: (error) => {
      const customError = error as CustomError;
      setError("username", { message: String(customError.data || "") });
      setError("password", { message: String(customError.data || "") });
    },
    onSuccess: (response) => {
      const defaultRoute = response.data.user.role.defaultRoute;
      let userDataToSave = response.data.user;
      if (defaultRoute === "PARENT") {
        userDataToSave = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(response.data.user as any),
          children: response.data.children ?? [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as typeof response.data.user & { children?: any[] };
      }
      setTokensAndUserDataCookies(
        response.data.access_token,
        response.data.refresh_token,
        JSON.stringify(userDataToSave),
        JSON.stringify(response.data.screens),
      );
      dispatch(setPermissions(response.data.screens));
      if (defaultRoute === "PARENT") {
        dispatch(setChildren(response.data.children ?? []));
        dispatch(
          setSelectedChild(
            response.data.children ? response.data.children[0] : null,
          ),
        );
      }
      toast.success("Đăng nhập thành công", {
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
        default:
          break;
      }
    },
  });

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const expireAt = localStorage.getItem("rememberedUsernameExpire");
    if (savedUsername && expireAt) {
      if (Date.now() < Number(expireAt)) {
        setValue("username", savedUsername);
        setRememberMe(true);
      } else {
        // Hết hạn, xóa khỏi localStorage
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedUsernameExpire");
      }
    }
  }, [setValue]);

  const onSubmit = (data: LogInInputs) => {
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", data.username);
      // Lưu thời điểm hết hạn (hiện tại + 3 ngày)
      const expireAt = Date.now() + 3 * 24 * 60 * 60 * 1000;
      localStorage.setItem("rememberedUsernameExpire", expireAt.toString());
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedUsernameExpire");
    }
    useLoginMutation.mutate(data);
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
            className="bg-foreground py-10 lg:py-10 xl:py-16 px-10 lg:px-14 xl:px-16 rounded-3xl shadow-lg z-[100]"
          >
            <div className="text-[#F48C06] text-2xl md:text-3xl font-bold flex justify-center">
              Đăng nhập
            </div>
            <div className="mt-6 mb-4 w-[250px] md:w-[350px]">
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
            <div className="flex flex-col gap-2 md:flex-row w-full justify-between mt-4 px-1">
              <div className="flex items-center">
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
              </div>
              <div className="flex">
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
              className="mt-6 w-full"
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
