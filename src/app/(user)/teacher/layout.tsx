"use client";
import PageWrapper from "@/app/ui/components/pagewrapper";
import Sidebar from "@/app/ui/sidebar/sidebar";
import { SIDENAV_ITEMS_TEACHER } from "@/app/menu_constants";
import HeaderTeacher from "@/app/ui/components/headerTeacher";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className='bg-background'>
            <Sidebar menuItems={SIDENAV_ITEMS_TEACHER}/>
            <div className="flex flex-col h-full w-full">
                <HeaderTeacher />
                <PageWrapper> {children} </PageWrapper>
            </div>
        </div>
    );
}
