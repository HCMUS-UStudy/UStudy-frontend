"use client";
import { ChevronRight, HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
export default function Breadcrumb() {
  const paths = usePathname();
  const pathnames = paths.split("/").filter((path) => path);

  const translate = (pathname: string) => {
    switch (pathname) {
      case "clerk":
        return "Giáo Vụ";
      case "courses":
        return "Các khóa học";
      case "accounts":
        return "Tài khoản";
      case "dashboard":
        return "Trang tổng quát";
      case "classes":
        return "Các lớp học";
      default:
        return "Chưa xử lý pathname này";
    }
  };

  const renderPaths = () => {
    const renderedPaths: React.ReactNode[] = [];
    renderedPaths.push(
      <li key={"homepage"} className="flex items-center gap-4 text-base ">
        <Link
          href={"/"}
          className="flex items-center gap-2 hover:text-sky-500 font-bold hover:scale-110 transition-all duration-200">
          <HomeIcon size={20} />
          Trang chủ
        </Link>
        <ChevronRight size={20} />
      </li>
    );
    pathnames.map((pathname, i) => {
      const href = `/${pathnames.slice(0, i + 1).join("/")}`;
      // console.log(href);
      renderedPaths.push(
        <li key={i} className="flex items-center gap-4 text-base">
          {i !== pathnames.length - 1 ? (
            <>
              <Link
                href={i === 0 ? `${href}/dashboard` : href}
                className="flex items-center gap-2 hover:text-sky-500 font-bold hover:scale-110 transition-all duration-200">
                {translate(pathname)}
              </Link>
              <ChevronRight size={20} />
            </>
          ) : (
            <div className="flex items-center gap-2 font-bold">
              {translate(pathname)}
            </div>
          )}
        </li>
      );
    });
    return renderedPaths;
  };

  return (
    <div>
      <div>
        <ul className="flex gap-5 text-sky-700">{renderPaths()}</ul>
      </div>
    </div>
  );
}
