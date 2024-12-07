import React from "react";

export default function ClerkClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex gap-3 mx-auto mt-5">
        <div className="w-[15vw] bg-gradient-to-br from-indigo-500 to-sky-500 hover:bg-gradient-to-bl hover:cursor-pointer transition-colors duration-200 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Lớp học
        </div>
        <div className="w-[15vw] bg-gradient-to-br from-indigo-500 to-sky-500 hover:bg-gradient-to-bl hover:cursor-pointer transition-colors duration-200 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Học viên
        </div>
        <div className="w-[15vw] bg-gradient-to-br from-indigo-500 to-sky-500 hover:bg-gradient-to-bl hover:cursor-pointer transition-colors duration-200 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Điểm
        </div>
        <div className="w-[15vw] bg-gradient-to-br from-indigo-500 to-sky-500 hover:bg-gradient-to-bl hover:cursor-pointer transition-colors duration-200 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Trao đổi
        </div>
      </div>
      {children}
    </>
  );
}
