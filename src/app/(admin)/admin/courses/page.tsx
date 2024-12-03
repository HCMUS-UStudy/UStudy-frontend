import React from "react";

import CourseTable from "@/app/ui/components/courseTable";
import ModalCourse from "@/app/ui/components/modalCourse-Ad";

const CoursePage: React.FC = () => {

  const searchQuery = ""; 
  const coursesPerPage = 4;

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
  //     const allIds = new Set(allCourses.map((course) => course.id));
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
  //   return `/admin/course-documents/${encodeURIComponent(id)}/${encodeURIComponent(subject)}`;
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
        <h2 className="text-2xl font-bold">
          Tổng số môn học ({11})
        </h2>
        {/* <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm môn học..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-l-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-full bg-white text-black hover:bg-slate-100 focus:ring-2 focus:ring-blue-300">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
          <select
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            className="border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả môn học</option>
            <option value="math">Toán</option>
            <option value="literature">Ngữ văn</option>
            <option value="english">Tiếng Anh</option>
            <option value="physics">Vật lý</option>
            <option value="chemistry">Hóa</option>
            <option value="biology">Sinh học</option>
            <option value="history">Lịch sử</option>
            <option value="geography">Địa lý</option>
            <option value="civics">Giáo dục công dân</option>
            <option value="informatics">Tin học</option>
            <option value="technology">Công nghệ</option>
          </select>
        </form> */}
      </div>

      <div className="flex justify-end items-center space-x-4 mb-2 mt-6">
        <div className="flex items-center space-x-4">
          <ModalCourse buttonLabel="Tạo môn học" />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 max-h-[400px]">
        <CourseTable searchQuery={searchQuery} coursesPerPage={coursesPerPage} />
      </div>

    </>
  );
};

export default CoursePage;