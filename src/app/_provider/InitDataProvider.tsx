"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getAllChildrenOfParent, getPermissions } from "../lib/services";
import { useAppDispatch } from "../store/store";
import { setPermissions, setStatus } from "../store/PermissionScreenSlice";
import { usePathname } from "next/navigation";
import { setChildren, setSelectedChild } from "../store/ChildrenSlice";
import { getUserDataFromCookies } from "../lib/action";
import { setUserData } from "../store/userSlice";

export default function InitDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const { data: userData } = useQuery({
    queryKey: ["UserData"],
    queryFn: () => getUserDataFromCookies(),
    refetchOnWindowFocus: false,
  });

  const results = useQueries({
    queries: [
      {
        queryKey: ["Permissions"],
        queryFn: () => getPermissions(),
        refetchOnWindowFocus: false,
        enabled: !(
          pathname?.includes("/login") ||
          pathname === "/" ||
          pathname === "/register"
        ),
      },
      {
        queryKey: ["ChildrenOfParent"],
        queryFn: () => getAllChildrenOfParent(),
        refetchOnWindowFocus: false,
        enabled: userData?.role.defaultRoute === "PARENT",
      },
    ],
  });
  const permissions = results[0];
  const childrenData = results[1];

  useEffect(() => {
    if (permissions.status === "success") {
      dispatch(setPermissions(permissions.data));
      dispatch(setStatus("success"));
      // updatePermissionsCookies(permissions.data);
    } else if (permissions.status === "pending") {
      dispatch(setStatus("pending"));
    } else {
      dispatch(setStatus("error"));
    }
  }, [permissions]);

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (childrenData.data) {
      dispatch(setChildren(childrenData.data));
      dispatch(setSelectedChild(childrenData.data[0]));
    }
  }, [childrenData]);

  // useEffect(() => {
  //   dispatch(fetchAllGrades({ page: 0, limit: 100, filter: "" }));
  // }, []);
  return <>{children}</>;
}
