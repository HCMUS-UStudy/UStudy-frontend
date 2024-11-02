import Header from "@/app/ui/components/header";
import PageWrapper from "@/app/ui/components/pagewrapper";
import { SideBar } from "@/app/ui/components/sidebar";

export default function Admin({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SideBar />
            <div className="flex flex-col h-full w-full">
                <Header />
                <PageWrapper children={children} />
            </div>
        </>
    )
}