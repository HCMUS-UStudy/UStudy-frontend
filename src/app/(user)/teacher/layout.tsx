"use client";
import Header from "@/app/ui/components/header";
import PageWrapper from "@/app/ui/components/pagewrapper";
import Sidebar from "@/app/ui/sidebar/sidebar";
import { SIDENAV_ITEMS_TEACHER } from "@/app/menu_constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className='bg-background'>
            <Sidebar menuItems={SIDENAV_ITEMS_TEACHER}/>
            <div className="flex flex-col h-full w-full">
                <Header />
                <PageWrapper> {children} </PageWrapper>
            </div>
        </div>
    );
}
