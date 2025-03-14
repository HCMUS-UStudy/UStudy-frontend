// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { FaEllipsisV, FaFolder } from "react-icons/fa";
// import { Button } from "@/app/ui/components/_common/Button";
// import Pagination from "@/app/ui/components/_common/Pagination";
// import Loading from "@/app/ui/components/_common/Loading";
// import { MaterialItem } from "@/app/types/type";

// interface MaterialsGridProps {
//   searchQuery: string;
// }

// const MaterialsGrid: React.FC<MaterialsGridProps> = ({ searchQuery }) => {
//   const [materialItem, setMaterialItem] = useState<MaterialItem[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [isSelectMode] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   // const fetchMaterial = async () => {
//   //   setLoading(true);
//   //   setError("");
//   //   try {
//   //     const response = await getMaterialsByClassId("", 0, classId as string);
//   //     setMaterialItem(response.content);
//   //   } catch (err) {
//   //     console.error("Error fetching materials:", err);
//   //     setError("Không thể tải thông tin tài liệu lớp học.");
//   //   } finally {
//   //     console.log(loading);
//   //     console.log(error);
//   //     setLoading(false);
//   //   }
//   // };

//   const toggleDropdown = (id: string) => {
//     setActiveDropdown(activeDropdown === id ? "" : id);
//   };

//   // const handleSelectGrade = (id: string) => {
//   //     setSelectedGrades((prev) => {
//   //         const updated = new Set(prev);
//   //         updated.has(id) ? updated.delete(id) : updated.add(id);
//   //         return updated;
//   //     });
//   // };

//   const renderDropdown = (id: string) => {
//     return (
//       activeDropdown === id && (
//         <div
//           ref={dropdownRef}
//           className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//         >
//           <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
//             Cut
//           </button>
//           <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
//             Copy
//           </button>
//           <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
//             Delete
//           </button>
//         </div>
//       )
//     );
//   };

//   // useEffect(() => {
//   //   fetchMaterials();
//   // }, [courseId, currentPage, searchQuery]);

//   return (
//     <div>
//       {/* Pagination */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         handlePageClick={(page) => setCurrentPage(page)}
//         handlePreviousPage={() =>
//           setCurrentPage((prev) => Math.max(prev - 1, 1))
//         }
//         handleNextPage={() =>
//           setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//         }
//       />
//     </div>
//   );
// };

// export default MaterialsGrid;
