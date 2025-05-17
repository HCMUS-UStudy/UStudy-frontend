"use server";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import Header from "@/app/ui/components/user/Header";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <Sidebar />
      <div className="flex flex-col h-full w-full">
        <Header role="student" />
        <PageWrapper> {children} </PageWrapper>
      </div>
    </div>
  );
}
