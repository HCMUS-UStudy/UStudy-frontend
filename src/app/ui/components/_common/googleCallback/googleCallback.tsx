"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUserByGoogle } from "@/app/lib/services/auth";
import { setTokensAndUserDataCookies } from "@/app/lib/action";
import { useDispatch } from "react-redux";
import { setPermissions } from "@/app/store/PermissionScreenSlice";
import { setChildren, setSelectedChild } from "@/app/store/ChildrenSlice";
import { setUserData } from "@/app/store/userSlice";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { AuthResponse } from "@/app/types";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const dispatch = useDispatch();
  const { addToast } = useCustomToast();

  const { mutate: handleGoogleLogin, isPending } = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("User ID is required");
      return getUserByGoogle(userId);
    },
    onSuccess: (response: AuthResponse) => {
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

      // Always redirect to /member/home after successful login
      router.push("/member/home");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Google login error:", error);
      addToast.error(error?.message || "Đăng nhập thất bại");
      router.push("/login");
    },
  });

  useEffect(() => {
    if (userId) {
      handleGoogleLogin();
    } else {
      addToast.error("Thiếu thông tin đăng nhập");
      router.push("/login");
    }
  }, [userId, handleGoogleLogin, router]);

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return null;
}
