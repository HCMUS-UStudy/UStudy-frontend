import React from "react";

import CourseTable from "@/app/ui/components/admin/courses/CourseTable";
import AddCourseModal from "@/app/ui/components/admin/courses/AddCourseModal";
import CourseNumber from "@/app/ui/components/admin/courses/CourseNumber";

//import DropdownCourse from "@/app/ui/components/admin/courses/DropdownCourse";

export default async function CoursePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    subject?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  // const subject = searchParams?.subject || "All";

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
      <div className="px-2">
        <div className="flex items-center justify-between mb-6">
          <CourseNumber searchQuery={query} />
          <div className="flex items-center">
            <AddCourseModal buttonLabel="Tạo môn học" />
          </div>
        </div>

        <CourseTable searchQuery={query} />
      </div>
    </>
  );
}
