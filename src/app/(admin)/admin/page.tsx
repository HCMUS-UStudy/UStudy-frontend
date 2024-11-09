import Header from "@/app/ui/components/header";
import PageWrapper from "@/app/ui/components/pagewrapper";
import { Sidebar } from "@/app/ui/sidebar/sidebar";

export default function Admin({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Sidebar />
            <div className="flex flex-col h-full w-full">
                <Header />
                <PageWrapper> {children} </PageWrapper>
            </div>
        </>
    )
}