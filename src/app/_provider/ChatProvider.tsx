"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getUserId } from "../lib/action";
import { fetchChatHistory, setUserId } from "../store/ChatSlice";
import { useQueries } from "@tanstack/react-query";

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const room = useAppSelector((state) => state.chat.room);

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
