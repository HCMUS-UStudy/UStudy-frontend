"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoChatboxEllipses, IoFileTrayFull } from "react-icons/io5";
import { MdTextIncrease } from "react-icons/md";

export default function ClerkClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const paths = usePathname();
  const pathnames = paths.split("/").filter((path) => path);
  const classId = pathnames[2] !== undefined ? pathnames[2] : undefined;
  return (
    <>
      <div className="flex gap-3 mx-auto mt-5">
        <Link
          href={`/clerk/classes/${classId}/classManagement`}
          className={clsx(
            {
              "bg-[100%_0]":
                paths === `/clerk/classes/${classId}/classManagement`,
            },
            `w-[13vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-base tracking-wider py-5 rounded-lg`
          )}>
          Lớp học
          <FaChalkboardTeacher
            className={clsx(
              {
                "bottom-1":
                  paths === `/clerk/classes/${classId}/classManagement`,
              },
              "size-8 absolute right-5 -bottom-10 group-hover:bottom-1 transition-all duration-300"
            )}
          />
        </Link>
        <Link
          href={`/clerk/classes/${classId}/userManagement`}
          className={clsx(
            {
              "bg-[100%_0]":
                paths === `/clerk/classes/${classId}/userManagement`,
            },
            `w-[13vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-base tracking-wider py-5 rounded-lg`
          )}>
          Thành viên
          <FaUser
            className={clsx(
              {
                "bottom-2":
                  paths === `/clerk/classes/${classId}/userManagement`,
              },
              "size-6 absolute right-5 -bottom-10 group-hover:bottom-2 transition-all duration-300"
            )}
          />
        </Link>
        <Link
          href={`/clerk/classes/${classId}/coursesManagement`}
          className={clsx(
            {
              "bg-[100%_0]":
                paths === `/clerk/classes/${classId}/coursesManagement`,
            },
            `w-[13vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-base tracking-wider py-5 rounded-lg`
          )}>
          Tài liệu
          <IoFileTrayFull
            className={clsx(
              {
                "bottom-1":
                  paths === `/clerk/classes/${classId}/coursesManagement`,
              },
              "size-8 absolute right-5 -bottom-10 group-hover:bottom-1 transition-all duration-300"
            )}
          />
        </Link>
        <Link
          href={`/clerk/classes/${classId}/gradeManagement`}
          className={clsx(
            {
              "bg-[100%_0]":
                paths === `/clerk/classes/${classId}/gradeManagement`,
            },
            `w-[13vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-base tracking-wider py-5 rounded-lg`
          )}>
          Điểm số
          <MdTextIncrease
            className={clsx(
              {
                "bottom-1":
                  paths === `/clerk/classes/${classId}/gradeManagement`,
              },
              "size-8 absolute right-5 -bottom-10 group-hover:bottom-1 transition-all duration-300"
            )}
          />
        </Link>
        <Link
          href={`/clerk/classes/${classId}/forum`}
          className={clsx(
            {
              "bg-[100%_0]": paths === `/clerk/classes/${classId}/forum`,
            },
            `w-[13vw] relative group bg-gradient-to-tr from-indigo-800 via-blue-600 to-indigo-800 bg-[length:100%_300%] bg-[100%_100%] hover:bg-[100%_0] transition-all duration-300 hover:cursor-pointer hover:scale-105 text-background font-bold text-center text-base tracking-wider py-5 rounded-lg`
          )}>
          Trao đổi
          <IoChatboxEllipses
            className={clsx(
              {
                "bottom-1": paths === `/clerk/classes/${classId}/forum`,
              },
              "size-8 absolute right-5 -bottom-10 group-hover:bottom-1 transition-all duration-300"
            )}
          />
        </Link>
      </div>
      {children}
    </>
  );
}
