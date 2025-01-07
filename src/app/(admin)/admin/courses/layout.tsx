import { CourseAdminProvider } from "@/app/context/CourseAdminContext";

export default function CourseAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CourseAdminProvider>{children}</CourseAdminProvider>;
}
