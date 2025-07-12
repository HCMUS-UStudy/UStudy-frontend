"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getUserId } from "../lib/action";
import { fetchChatHistory, setUserId } from "../store/ChatSlice";
import { useQueries } from "@tanstack/react-query";
import { AppDispatch } from "../store/store";

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch: AppDispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room = useAppSelector((state: any) => state.chat.room);

  const results = useQueries({
    queries: [
      {
        queryKey: ["userId"],
        queryFn: () => getUserId(),
      },
    ],
  });

  useEffect(() => {
    if (room?.roomChatId) {
      dispatch(fetchChatHistory(room?.roomChatId));
    }
  }, [room]);

  useEffect(() => {
    if (results[0].status === "success") {
      dispatch(setUserId(results[0].data));
    }
  }, [results]);

  return <>{children}</>;
}
