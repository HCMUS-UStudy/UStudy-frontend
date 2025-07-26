"use client";
import { ChevronRight, HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";

/**
 * Breadcrumb component
 *
 * @description
 * To add a new breadcrumb, add a new case in the translate() function
 *
 * - Return null if you want to skip rendering the breadcrumb
 * - Return an empty string if you want to render the dynamic breadcrumb
 *
 * @description
 * To set the dynamic breadcrumbs, use the useBreadcrumbContext hook
 * and call setDynamicBreadcrumbs with an array of strings.
 * @example
 * ```tsx
 *  const { setDynamicBreadcrumbs } = useBreadcrumbContext();
 *  setDynamicBreadcrumbs(["Name 1", "Name 2"]);
 * ```
 */
export default function Breadcrumb() {
  const paths = usePathname();
  const pathnames = paths?.split("/").filter((path) => path);

  const { dynamicBreadcrumbs } = useBreadcrumbContext();

  // if return null, it will not be rendered
  // if return "", it will be rendered as the dynamic breadcrumb
  const translate = (pathname: string) => {
    switch (pathname) {
      case "clerk":
        return "Giáo vụ";
      case "courses":
        return "Môn học";
      case "accounts":
        return "Tài khoản";
      case "dashboard":
        return "Trang tổng quát";
      case "classes":
        return "Lớp học";
      case "classes-management":
        return "Quản lý lớp học";
      case "admin":
        return "Quản trị viên";
      case "branches":
        return "Chi nhánh";
      case "course-documents":
        return null;
      case "class-management":
        return null;
      default: {
        return "";
      }
    }
  };

  const displayedPathnames =
    pathnames?.filter((pathname) => translate(pathname) !== null) ?? [];

  const renderPaths = () => {
    const renderedPaths: React.ReactNode[] = [];
    renderedPaths.push(
      <li key={"homepage"} className="flex items-center gap-4 text-base ">
        <Link
          href={"/"}
          className="flex items-center gap-2 hover:text-blue-500 font-bold hover:scale-110 transition-all duration-200"
        >
          <HomeIcon size={20} />
          Trang chủ
        </Link>
        <ChevronRight size={20} />
      </li>,
    );
    let dynamicIdx = 0;
    pathnames?.map((pathname, i) => {
      const href = `/${pathnames.slice(0, i + 1).join("/")}`;
      let label = translate(pathname);
      if (label == null) {
        return;
      }
      if (label === "") {
        label = dynamicBreadcrumbs[dynamicIdx];
        dynamicIdx++;
      }

      renderedPaths.push(
        <li key={i} className="flex items-center gap-4 text-base">
          {i !== displayedPathnames.length - 1 ? (
            <>
              <Link
                href={i === 0 ? `${href}/dashboard` : href}
                className="flex items-center gap-2 hover:text-blue-500 font-bold hover:scale-110 transition-all duration-200"
              >
                {label}
              </Link>
              <ChevronRight size={20} />
            </>
          ) : (
            <div className="flex items-center gap-2 font-bold">{label}</div>
          )}
        </li>,
      );
    });
    return renderedPaths;
  };

  return (
    <div>
      <div>
        <ul className="flex gap-5 text-blue-700">{renderPaths()}</ul>
      </div>
    </div>
  );
}
