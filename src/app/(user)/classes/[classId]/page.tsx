"use client";
import React, { useEffect } from "react";
import axiosInstance from "@/app/lib/axios";

export default function Class({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = React.use(params);
  const mainSections: string[] = ["Lớp học", "Học viên", "Điểm", "Trao đổi"];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/class/all/get-one", {
          params: {
            classId,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex gap-3 mx-auto">
        {mainSections.map((data, i) => (
          <div
            key={i}
            className="w-[15vw] bg-sky-600 hover:bg-sky-800 hover:cursor-pointer transition-colors text-background font-bold text-center text-lg tracking-wider py-5 rounded-xl">
            {data}
          </div>
        ))}
      </div>
      <div id="generalInformation" className="mt-5">
        <h1 className="text-2xl">📚 Thông tin chung</h1>
      </div>
    </>
  );
}
