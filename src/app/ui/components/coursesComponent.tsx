// "use client";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { FaEdit, FaTrashAlt } from "react-icons/fa";
// import { FaPaperclip } from "react-icons/fa6";
// import { Button } from "./button";

// export default function CoursesComponent() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const router = useRouter();

//   const onCreateCourse = () => {
//     //setShowModal(true);
//   };

//   const courses = [
//     {
//       creator: "Daniel Grant",
//       subject: "Toán học",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 10",
//       createdAt: "17 Feb 2024",
//       status: "Active",
//       notes: "Chưa hoàn thành bài tập cuối kỳ",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Ngữ văn",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 11",
//       createdAt: "14 Feb 2024",
//       status: "Active",
//       notes: "Cần cập nhật tài liệu",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Tiếng Anh",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 12",
//       createdAt: "14 Feb 2024",
//       status: "Active",
//       notes: "Cần thêm phần nghe",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Vật lý",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 10",
//       createdAt: "14 Feb 2024",
//       status: "Deleted",
//       notes: "Không còn sử dụng tài liệu này nữa",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Hóa học",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 11",
//       createdAt: "14 Feb 2024",
//       status: "Active",
//       notes: "Chờ cập nhật bài tập",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Sinh học",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 12",
//       createdAt: "14 Feb 2024",
//       status: "Active",
//       notes: "Cần bổ sung video giảng dạy",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Lịch sử",
//       attachments: 200,
//       description: "Khóa học này dành cho các bạn học sinh lớp 10",
//       createdAt: "14 Feb 2024",
//       status: "Deleted",
//       notes: "Chưa hoàn thành phần lịch sử hiện đại",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Địa lý",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 11",
//       createdAt: "14 Feb 2024",
//       status: "Active",
//       notes: "Cần thêm phần bài tập thực hành",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Giáo dục công dân",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 12",
//       createdAt: "14 Feb 2024",
//       status: "Active",
//       notes: "Tài liệu còn thiếu phần thực tế",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Tin học",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 10",
//       createdAt: "14 Feb 2024",
//       status: "Deleted",
//       notes: "Chưa hoàn thành các phần bài tập lập trình",
//     },
//     {
//       creator: "Daniel Grant",
//       subject: "Công nghệ",
//       attachments: 100,
//       description: "Khóa học này dành cho các bạn học sinh lớp 11",
//       createdAt: "14 Feb 2024",
//       status: "Active",
//       notes: "Cần cập nhật tài liệu mới nhất",
//     },
//   ];

//   const filteredCourses = courses.filter((courses) => {
//     return (
//       (selectedSubject ? courses.subject === selectedSubject : true) &&
//       (searchQuery
//         ? courses.subject.toLowerCase().includes(searchQuery.toLowerCase())
//         : true)
//     );
//   });

//   const handleAttachmentClick = (subject: string) => {
//     // Navigate to the courses page using the subject
//     router.push(`/admin/courses-documents?subject=${subject}`);
//   };

//   return (
//     <>
//       <h2 className="text-3xl font-bold tracking-tight my-4">
//         Quản lý tài liệu môn học
//       </h2>
//       <h2 className="text-xl tracking-tight mb-6">
//         Tìm tất cả tài liệu của nền tảng tại đây
//       </h2>

//       <div className="flex items-center justify-between mt-6 mr-6">
//         <div className="flex items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
//             <option value="">Tất cả môn học</option>
//             <option value="math">Toán học</option>
//             <option value="literature">Ngữ văn</option>
//             <option value="english">Tiếng Anh</option>
//             <option value="physics">Vật lý</option>
//             <option value="chemistry">Hóa học</option>
//             <option value="biology">Sinh học</option>
//             <option value="history">Lịch sử</option>
//             <option value="geography">Địa lý</option>
//             <option value="civics">Giáo dục công dân</option>
//             <option value="informatics">Tin học</option>
//             <option value="technology">Công nghệ</option>
//           </select>
//           <h2 className="text-lg text-slate-400">
//             {filteredCourses.length} khóa học đã được liệt kê
//           </h2>
//         </div>

//         <div className="flex justify-end">
//           <Button onClick={onCreateCourse} type="button" className="pl-6 pr-6">
//             Tạo môn học
//           </Button>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto mt-6 max-h-[400px] mr-6">
//         <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
//                 Người tạo
//               </th>
//               <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
//                 Môn học
//               </th>
//               <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
//                 Tệp đính kèm
//               </th>
//               <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
//                 Mô tả
//               </th>
//               <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
//                 Ngày tạo
//               </th>
//               <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
//                 Trạng thái
//               </th>
//               <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
//                 Ghi chú
//               </th>
//               <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
//                 Hành động
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCourses.map((courses, index) => (
//               <tr
//                 key={index}
//                 className="hover:bg-gray-50 transition-all duration-200">
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {courses.creator}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700 text-center">
//                   {courses.subject}
//                 </td>
//                 <td
//                   className="px-6 py-4 text-sm text-gray-700 mt-3 flex items-center hover:underline"
//                   onClick={() => handleAttachmentClick(courses.subject)}>
//                   {courses.attachments}
//                   <FaPaperclip className=" ml-2 text-green-500" />
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {courses.description}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700 text-center">
//                   {courses.createdAt}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-center text-gray-700">
//                   <span
//                     className={`px-2 py-1 rounded-full text-white ${
//                       courses.status === "Active" ? "bg-green-500" : "bg-red-500"
//                     }`}>
//                     {courses.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {courses.notes}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700 flex items-center space-x-3 text-center">
//                   <button className="text-blue-600 hover:text-blue-800">
//                     <FaEdit className="h-5 w-5" />
//                   </button>
//                   <button className="text-red-600 hover:text-red-800">
//                     <FaTrashAlt className="h-4 w-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }
