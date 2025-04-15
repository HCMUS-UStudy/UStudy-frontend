"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/app/ui/components/_common/Pagination";
import { ClassUserItem } from "@/app/types";
import { getAllStudentClasses } from "@/app/lib/services/class";
import { Button } from "../../../_common/Button";
import { useRouter } from "next/navigation";
import ClassesLoading from "../../../_common/loading/ClassesLoading";

interface GradeTableProps {
  searchQuery: string;
  classQuery: string;
}

const ClassRow: React.FC<GradeTableProps> = ({ searchQuery, classQuery }) => {
  const [classes, setClasses] = useState<ClassUserItem[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const defaultClass = classQuery === "All" ? "" : classQuery;

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError("");

      try {
        const searchParam =
          searchQuery && defaultClass
            ? `${defaultClass} ${searchQuery}`
            : defaultClass || searchQuery || "";

        const response = await getAllStudentClasses(
          searchParam,
          "",
          "",
          currentPage - 1,
          5,
        );

        setClasses(response.content);
        // console.log("Classes: ", classes);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Error fetching classes.");
      } finally {
        console.log(error);
        setLoading(false);
      }
    };
    fetchClasses();
    return;
  }, [currentPage, searchQuery, defaultClass]);

  const handleDetail = (id: string) => {
    // setLoading(true);
    //fetchClassDetails(id).finally(() => setLoading(false));
    router.push(`/member/classes/${id}`);
  };

  return (
    <div>
      <div className="flex flex-col space-y-6">
        {loading ? (
          <ClassesLoading />
        ) : classes.length > 0 ? (
          classes.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center bg-gradient-to-r from-white to-green-50 border border-gray-200 p-6 rounded-2xl transition-all transform hover:shadow-md"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-primary-lighter text-primary-dark flex items-center justify-center font-extrabold text-lg mr-6">
                {classItem.course?.name.charAt(0) || "?"}
              </div>
              {/* Class Details */}
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-700 mb-1">
                  {classItem?.course?.name
                    ? `Lớp ${classItem.name} - ${classItem?.course?.name} ${classItem?.grade?.name}`
                    : classItem.name}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Giáo viên:</strong>{" "}
                  {/* {classItem?.teacher?.name ||
                    "Chưa có giáo viên"} */}
                </p>
                {/* <p className="text-sm text-gray-600">
                  <strong>Phòng học:</strong> {classItem.room.name}
                </p> */}
              </div>
              {/* Action */}
              <Button
                className="px-4 py-2 bg-primary-dark text-white text-sm rounded-full hover:bg-hover-primary"
                onClick={() => {
                  handleDetail(classItem.id);
                }}
              >
                Xem chi tiết
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">Không có lớp học nào.</div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={(page) => setCurrentPage(page)}
        handlePreviousPage={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        handleNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      />
    </div>
  );
};

export default ClassRow;
