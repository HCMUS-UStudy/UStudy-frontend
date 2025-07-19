"use client";

import { useQueries } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getPermissions } from "../lib/services";
import { useAppDispatch } from "../store/store";
import { setPermissions, setStatus } from "../store/PermissionScreenSlice";
import { usePathname } from "next/navigation";

export default function InitDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const results = useQueries({
    queries: [
      {
        queryKey: ["Permissions"],
        queryFn: () => getPermissions(),
        refetchOnWindowFocus: false,
        enabled: !pathname?.includes("/login"),
      },
    ],
  });
  const permissions = results[0];

  useEffect(() => {
    if (permissions.status === "success") {
      dispatch(setPermissions(permissions.data));
      dispatch(setStatus("success"));
    } else if (permissions.status === "pending") {
      dispatch(setStatus("pending"));
    } else {
      dispatch(setStatus("error"));
    }
  }, [permissions]);

  // useEffect(() => {
  //   dispatch(fetchAllGrades({ page: 0, limit: 100, filter: "" }));
  // }, []);
  return <>{children}</>;
}
