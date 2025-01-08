import React from "react";

import CourseTable from "@/app/ui/components/admin/courses/CourseTable";
import AddCourseModal from "@/app/ui/components/admin/courses/AddCourseModal";
import { SearchField } from "@/app/ui/components/_common/Input";

export default async function CoursePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  //const [selectedName, setSelectedName] = useState("");

  //const [setCourses] = useState<[]>([]);

  // const fetchAllCourses = async () => {
  //   const authToken = localStorage.getItem("authToken");
  //   let allCourses: any[] = [];
  //   let currentPage = 0;

  //   try {
  //     // Lặp qua tất cả các trang để lấy dữ liệu
  //     while (true) {
  //       const response = await axios.get(
  //         `http://localhost:8080/api/course/admin/get-list-course`,
  //         {
  //           params: {
  //             page: currentPage,
  //             limit: coursesPerPage,
  //           },
  //           headers: { Authorization: `Bearer ${authToken}` },
  //         }
  //       );

  //       const courses = response.data?.content || [];
  //       allCourses = [...allCourses, ...courses];

  //       // Kiểm tra nếu đã tới trang cuối
  //       if (currentPage + 1 >= response.data?.totalPages) {
  //         break;
  //       }

  //       currentPage++;
  //     }

  //     // Cập nhật danh sách toàn bộ khóa học
  //     const allIds = new Set(allCourses.map((courses) => courses.id));
  //     setAllCourseIds(allIds);

  //     console.log("Tất cả khóa học đã được fetch:", allCourses);
  //   } catch (error) {
  //     console.error("Error fetching all courses:", error);
  //   }
  // };

  // // Gọi hàm này khi component được mount
  // useEffect(() => {
  //   fetchAllCourses();
  // }, []);

  // const handleAttachmentClick = (id: string, subject: string) => {
  //   return `/admin/courses-documents/${encodeURIComponent(id)}/${encodeURIComponent(subject)}`;
  // };

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Quản lý tài liệu môn học
      </h2>
      <h2 className="text-xl tracking-tight mb-6">
        Tìm tất cả tài liệu của nền tảng tại đây
      </h2>

      <div className="flex items-center justify-between mt-8 mr-6">
        <h2 className="text-2xl font-bold">Tổng số môn học ({11})</h2>
      </div>

      <div className="flex justify-between items-center space-x-4 mb-2 mt-6">
        <SearchField
          className="w-[200px]"
          placeholder="Tìm theo tên môn học..."
        />
        <div className="flex items-center">
          <AddCourseModal buttonLabel="Tạo môn học" />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 max-h-[400px]">
        <CourseTable searchQuery={query} />
      </div>
    </>
  );
}
