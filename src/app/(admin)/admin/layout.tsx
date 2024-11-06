"use client";
import { usePathname } from 'next/navigation';
import Header from "@/app/ui/components/header";
import PageWrapper from "@/app/ui/components/pagewrapper";
import { SideBar } from "@/app/ui/sidebar/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Exclude the layout for the 'admin/login' path
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <>
            <SideBar />
            <div className="flex flex-col h-full w-full">
                <Header />
                <PageWrapper> {children} </PageWrapper>
            </div>
        </>
    );
}
