"use client";
import { usePathname } from "next/navigation";
import Header from "@/app/ui/components/admin/Header";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import { BreadcrumbProvider } from "@/app/context/BreadcrumbContext";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setCollapsed(false);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const pathname = usePathname();

  // Exclude the layout for the 'admin/login' path
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/verify-token" ||
    pathname === "/admin/reset-password"
  ) {
    return <>{children}</>;
  }

  return (
    <BreadcrumbProvider>
      <div className="bg-background">
        <Sidebar
          isOpen={isMenuOpen}
          handleClose={() => setIsMenuOpen(false)}
          collapsed={collapsed}
        />

        <div className="flex flex-col h-full w-full">
          <Header
            handleMenuOpen={setIsMenuOpen}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <PageWrapper collapsed={collapsed}> {children} </PageWrapper>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}

// ("use client");
// import PageWrapper from "@/app/ui/components/_common/PageWrapper";
// import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
// import Header from "@/app/ui/components/user/Header";
// import { useState, useEffect } from "react";

// export default function TeacherLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   useEffect(() => {
//     function handleResize() {
//       if (window.innerWidth < 768) {
//         setCollapsed(false);
//       }
//     }
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return (
//     <div className="bg-background">
//       <Sidebar
//         isOpen={isMenuOpen}
//         handleClose={() => setIsMenuOpen(false)}
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//       />

//       <div className="flex flex-col h-full w-full">
//         <Header
//           role="teacher"
//           handleMenuOpen={setIsMenuOpen}
//           collapsed={collapsed}
//         />
//         <PageWrapper collapsed={collapsed}> {children} </PageWrapper>
//       </div>
//     </div>
//   );
// }
