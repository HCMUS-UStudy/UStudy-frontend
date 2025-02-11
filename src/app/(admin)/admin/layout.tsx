"use client";
import { usePathname } from "next/navigation";
import Header from "@/app/ui/components/admin/Header";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import { SIDENAV_ITEMS_ADMIN } from "@/app/menu-constants";
import { BreadcrumbProvider } from "@/app/context/BreadcrumbContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Exclude the layout for the 'admin/login' path
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <BreadcrumbProvider>
      <div>
        <Sidebar />
        <div>
          <Header />
          <PageWrapper>{children}</PageWrapper>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}
