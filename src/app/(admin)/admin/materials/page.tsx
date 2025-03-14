import MaterialsContent from "@/app/ui/components/admin/materials/MaterialsContent";

export default async function MaterialsPage(props: {
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

  return <MaterialsContent courseId={id} query={query} />;
}
