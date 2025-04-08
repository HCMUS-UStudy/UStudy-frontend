import React from "react";
import Header from "@/app/ui/components/user/Header";

export default function StudentChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header role="student" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
} 