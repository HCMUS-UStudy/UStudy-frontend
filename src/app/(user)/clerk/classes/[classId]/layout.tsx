"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdTextIncrease } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";

export default function ClerkClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const paths = usePathname();
  const pathnames = paths.split("/").filter((path) => path);
  const classId = pathnames[2] !== undefined ? pathnames[2] : undefined;
  // useEffect(() => {
  //   console.log(pathnames);
  // }, []);
  return (
    <>
      <div className="flex gap-3 mx-auto mt-5">
        <Link
          href={`/clerk/classes/${classId}/classManagement`}
          className="w-[15vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Lớp học
          <FaChalkboardTeacher className="size-10 absolute right-5 -bottom-10 group-hover:bottom-1 transition-all duration-300" />
        </Link>
        <Link
          href={`/clerk/classes/${classId}/userManagement`}
          className="w-[15vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Thành viên
          <PiStudentFill className="size-10 absolute right-5 -bottom-10 group-hover:bottom-1 transition-all duration-300" />
        </Link>
        <Link
          href={`/clerk/classes/${classId}/gradeManagement`}
          className="w-[15vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Điểm số
          <MdTextIncrease className="size-10 absolute right-5 -bottom-10 group-hover:bottom-1 transition-all duration-300" />
        </Link>
        <Link
          href={`/clerk/classes/${classId}/forum`}
          className="w-[15vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Trao đổi
          <IoChatboxEllipses className="size-10 absolute right-5 -bottom-10 group-hover:bottom-1 transition-all duration-300" />
        </Link>
      </div>
      {children}
    </>
  );
}
