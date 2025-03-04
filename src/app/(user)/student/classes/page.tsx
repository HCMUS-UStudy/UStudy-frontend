"use client";

import React, { useEffect, useState } from "react";
import { getUserDataFromCookies } from "@/app/lib/action";
import { getClassById, getListUserClass } from "@/app/lib/services/class";
import Loading from "@/app/ui/components/_common/Loading";
import { ClassUserItem } from "@/app/types/type";

export default function Classes() {
  const [classes, setClasses] = useState<ClassUserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [classDetails, setClassDetails] = useState<{ [key: string]: any }>({});

  const fetchClasses = async () => {
    setLoading(true);

    const user = await getUserDataFromCookies();
    try {
      const response = await getListUserClass(
        user?.genId as string,
        "",
        0,
        100,
      );
      console.log(response);
      setClasses(response.content);
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
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
  }, []);

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

  return (
    <div className="flex-grow pr-6 md:pr-5">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
          Danh sách lớp học
        </span>
      </h2>
      <div className="flex flex-col space-y-6">
        {loading ? (
          <Loading />
        ) : classes.length > 0 ? (
          classes.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center bg-gradient-to-r from-white to-blue-50 shadow-xl border border-gray-200 p-6 rounded-2xl hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-lg mr-6 shadow-inner">
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
                  {classDetails[classItem.id]?.teacher?.name ||
                    "Chưa có giáo viên"}
                </p>
                {/* <p className="text-sm text-gray-600">
                  <strong>Phòng học:</strong> {classItem.room.name}
                </p> */}
              </div>
              {/* Action */}
              <button
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full shadow-md hover:bg-blue-600 transition-all"
                onClick={() => {
                  setLoading(true);
                  fetchClassDetails(classItem.id).finally(() =>
                    setLoading(false),
                  );
                }}
              >
                Xem chi tiết
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">Không có lớp học nào.</div>
        )}
      </div>

      {/* Pagination Section */}
    </div>
  );
}
