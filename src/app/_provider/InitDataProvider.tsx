"use client";

import { useQueries } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getPermissions } from "../lib/services";
import { useAppDispatch } from "../store/store";
import { setPermissions, setStatus } from "../store/PermissionScreenSlice";

export default function InitDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const results = useQueries({
    queries: [
      {
        queryKey: ["Permissions"],
        queryFn: () => getPermissions(),
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
