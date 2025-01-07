"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { ClassTeacher } from "@/app/types/type";
import { useEffect, useState } from "react";
import { getClassById } from "@/app/lib/services/class";

export default function ClassDetail() {
  const { classId } = useParams() as { classId: string };
  const [classDetail, setClassDetail] = useState<ClassTeacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await getClassById(classId);
        setClassDetail(response.data);
      } catch (error) {
        console.error("Error fetching class:", error);
      }
    };

    fetchClass();
  }, [classId]);

  useEffect(() => {
    if (classDetail) {
      setLoading(false);
    }
  }, [classDetail]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Nếu không tìm thấy lớp
  if (!classDetail) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">Class not found</h1>
        <p className="mt-4">
          Please check the class ID or go back to the class list.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{classDetail.name}</h1>
      <p className="mb-4">Room: {classDetail.room?.name}</p>
      <p className="mb-4">Description: {classDetail.description}</p>
      <p className="mb-4">Number of students: {classDetail.students?.length}</p>
      <h2 className="text-2xl font-semibold mt-6">List of students:</h2>
      {classDetail.students?.length > 0 ? (
        <ul className="list-disc pl-6 mt-4">
          {classDetail.students?.map((student) => (
            <div key={student.id}>
              {/* avatar */}
              <Image
                src={student.avatar}
                alt={student.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <p>
                {" "}
                {student.name} ({student.email}){" "}
              </p>
            </div>
          ))}
        </ul>
      ) : (
        <p className="mt-4">No students enrolled in this class.</p>
      )}
    </div>
  );
}
