"use client";
import React, { useEffect, useState } from "react";
import Collapsible from "@/app/ui/components/collapsible";
import { getClassById } from "@/app/lib/api";
import { Classroom } from "@/app/types/type";

export default function Class({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = React.use(params);
  const [classData, setClassData] = useState<Classroom | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClassById(classId);
        setClassData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [classId]);

  useEffect(() => {
    console.log(classData);
  }, [classData]);

  return (
    <>
      <div className="flex gap-3 mx-auto mt-5">
        <div className="w-[15vw] bg-gradient-to-br from-blue-500 to-emerald-500 hover:bg-gradient-to-bl hover:cursor-pointer transition-colors duration-200 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Lớp học
        </div>
        <div className="w-[15vw] bg-gradient-to-br from-indigo-500 to-sky-500 hover:bg-gradient-to-bl hover:cursor-pointer transition-colors duration-200 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Học viên
        </div>
        <div className="w-[15vw] bg-gradient-to-br from-red-500 to-yellow-500 hover:bg-gradient-to-bl hover:cursor-pointer transition-colors duration-200 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Điểm
        </div>
        <div className="w-[15vw] bg-gradient-to-br from-purple-500 to-pink-500 hover:bg-gradient-to-bl hover:cursor-pointer transition-colors duration-200 text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
          Trao đổi
        </div>
      </div>
      <Collapsible
        title="📚 Thông tin chung"
        primaryColor="teazl-500"
        secondaryColor="bg-teal-100"
        defaultChecked>
        <div className="text-gray-700 px-8 py-4">
          <div className="font-bold text-xl flex gap-10">
            <div>Lớp {classData?.name}</div>
            <div>Môn: {classData?.course.name}</div>
            <div></div>
          </div>
          <div className="w-full h-0.5 bg-teal-300 mt-2"></div>
          <div className="text-lg mt-2 text-gray-600">
            <div>
              <span className="font-bold">{classData?.grade.name}</span>
            </div>
            <div>
              Phòng: <span className="font-bold">{classData?.room.name}</span>
            </div>
          </div>
          <div className="w-full h-0.5 bg-teal-300 mt-2"></div>
          {classData?.teacher ? (
            <div className="text-lg mt-2 text-gray-600">
              <div>
                Giáo viên:{" "}
                <span className="font-bold">{classData?.teacher?.name}</span>
              </div>
              <div>
                Email liên lạc:{" "}
                <span className="font-bold">{classData?.teacher?.email}</span>
              </div>
            </div>
          ) : (
            <div className="text-error font-bold mt-2">Chưa có giáo viên</div>
          )}
        </div>
      </Collapsible>
    </>
  );
}
