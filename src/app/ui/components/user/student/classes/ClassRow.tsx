"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/app/ui/components/_common/Pagination";
import { ClassUserItem } from "@/app/types/type";
import { getAllStudentClasses, getClassById } from "@/app/lib/services/class";
import Loading from "../../../_common/Loading";
import { Button } from "../../../_common/Button";
import { useRouter } from "next/navigation";

interface GradeTableProps {
  searchQuery: string;
  classQuery: string;
}

const ClassRow: React.FC<GradeTableProps> = ({ searchQuery, classQuery }) => {
  const [classes, setClasses] = useState<ClassUserItem[]>([]);
  const router = useRouter();
  const [classDetails, setClassDetails] = useState<{
    [key: string]: ClassUserItem;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const defaultClass = classQuery === "All" ? "" : classQuery;

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
        currentPage - 1,
        5,
      );

      setClasses(response.content);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Error fetching classes.");
    } finally {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchClassDetails = async (classId: string) => {
    if (classDetails[classId]) {
      console.log(
        `Class details for ${classId} already fetched:`,
        classDetails[classId],
      );
      return; // Avoid fetching if details already exist
    }

    try {
      const response = await getClassById(classId);

      setClassDetails((prevDetails) => {
        const updatedDetails = { ...prevDetails, [classId]: response.data };
        console.log("Updated class details:", updatedDetails); // Log the updated state
        return updatedDetails;
      });
    } catch (err) {
      console.error("Error fetching class details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [currentPage, searchQuery, defaultClass]);

  useEffect(() => {
    if (classes.length > 0) {
      classes.forEach((classItem) => fetchClassDetails(classItem.id));
    }
  }, [classes]);

  useEffect(() => {
    if (classes.length > 0) {
      const fetchDetails = async () => {
        await Promise.all(
          classes.map((classItem) => fetchClassDetails(classItem.id)),
        );
      };
      fetchDetails();
    }
  }, [classes]);

  const handleDetail = (id: string) => {
    setLoading(true);
    fetchClassDetails(id).finally(() => setLoading(false));
    router.push(`/student/classes/${id}`);
  };

  return (
    <div>
      <div className="flex flex-col space-y-6">
        {loading ? (
          <Loading />
        ) : classes.length > 0 ? (
          classes.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center bg-gradient-to-r from-white to-green-50 border border-gray-200 p-6 rounded-2xl transition-transform transform hover:scale-95"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-primary-lighter text-primary-dark flex items-center justify-center font-extrabold text-lg mr-6">
                {classDetails[classItem.id]?.course?.name.charAt(0)}
              </div>
              {/* Class Details */}
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-700 mb-1">
                  {classDetails[classItem.id]?.course?.name
                    ? `Lớp ${classItem.name} - ${classDetails[classItem.id]?.course?.name} ${classDetails[classItem.id]?.grade?.name}`
                    : classItem.name}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Giáo viên:</strong>{" "}
                  {/* {classDetails[classItem.id]?.teacher?.name ||
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
