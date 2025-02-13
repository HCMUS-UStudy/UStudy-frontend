import CourseDocumentsContent from "@/app/ui/components/admin/courses/CourseDocumentsContent ";

export default async function CourseDocumentsPage(props: {
  params?: Promise<{
    id?: string;
  }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const query = searchParams?.query || "";
  const id = params?.id || "";

  return <CourseDocumentsContent courseId={id} query={query} />;
}
