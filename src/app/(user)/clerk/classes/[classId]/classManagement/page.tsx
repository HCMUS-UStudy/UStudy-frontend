"use client";
import React, { useEffect, useState } from "react";
import Collapsible from "@/app/ui/components/collapsible";
import { getClassById, getListChapter } from "@/app/lib/api";
import { AllChapter, Classroom } from "@/app/types/type";
import { useSpecificNameContext } from "@/app/context/context";
import { IoFileTrayFull } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";

export default function ClassManagement({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = React.use(params);
  const [classData, setClassData] = useState<Classroom | null>(null);
  const { setSpecificName } = useSpecificNameContext();
  const [listChapters, setListChapters] = useState<AllChapter[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchClass = await getClassById(classId);
        setClassData(fetchClass.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [classId]);

  useEffect(() => {
    const fetchListChapters = async () => {
      try {
        if (classData?.course.id && classData.grade.id) {
          const response = await getListChapter(
            classData?.course.id,
            classData?.grade.id,
            0,
            10
          );
          setListChapters(response.data.content);
          //   console.log(response.data.content);
        }
        return;
      } catch (error) {
        console.log(error);
      }
    };
    if (classData?.name !== undefined) {
      setSpecificName(classData?.name);
      console.log(classData);
    }
    fetchListChapters();
  }, [classData, setSpecificName]);

  return (
    <>
      <Collapsible
        title="📚 Thông tin chung"
        primaryColor="sky-500"
        secondaryColor="bg-sky-100"
        defaultChecked
        maxHeight={null}>
        <div className="text-gray-700 px-8 py-4">
          <div className="font-bold text-xl flex gap-10">
            <div>Lớp {classData?.name}</div>
            <div>Môn: {classData?.course.name}</div>
            <div></div>
          </div>
          <div className="w-full h-0.5 bg-sky-300 mt-2"></div>
          <div className="text-lg mt-2 text-gray-600">
            <div>
              <span className="font-bold">{classData?.grade.name}</span>
            </div>
            <div>
              Phòng: <span className="font-bold">{classData?.room.name}</span>
            </div>
          </div>
          <div className="w-full h-0.5 bg-sky-300 mt-2"></div>
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

      <div className="text-2xl font-bold text-gray-700 tracking-wider mt-10 pl-5">
        📑 Tài liệu học tập
      </div>
      {listChapters.map((chapter, i) => (
        <div
          key={i}
          className="w-full h-fit flex justify-between items-center gap-4 border-2 border-amber-200 rounded-xl p-4 mt-3 cursor-pointer bg-white hover:bg-yellow-100 transition-colors">
          <div className="flex items-center gap-4">
            <IoFileTrayFull size={40} className="text-amber-500" />
            <div className="font-bold text-xl tracking-wider">
              {chapter.name}
            </div>
            <div className="font-semibold text-base tracking-wider text-gray-500 ml-72">
              {chapter.description}
            </div>
          </div>
          <HiDotsVertical size={25} className="text-gray-600" />
        </div>
      ))}
    </>
  );
}
