import React from "react";
// import { FaRegClock } from "react-icons/fa6";
// import { MdMeetingRoom } from "react-icons/md";
// import { MdPeopleOutline } from "react-icons/md";
// import { GrScheduleNew } from "react-icons/gr";
import { ClassTeacher } from "@/app/types";
import { useRouter } from "next/navigation";

export default function ClassCard({
  cls,
  completed,
}: {
  cls: ClassTeacher;
  completed: boolean;
}) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/teacher/classes/${cls.id}`);
  };

  return (
    <div
      className={`border border-slate-200 rounded-2xl shadow-sm p-5 cursor-pointer 
      ${!completed ? "bg-white hover:shadow-md hover:shadow-primary-light" : "bg-slate-100 hover:bg-slate-200"}`}
      onClick={handleClick}
    >
      <h2 className="text-lg font-semibold">{cls.name}</h2>
      <p className="bg-gray-200 rounded-lg text-sm text-slate-800 w-fit px-1 mt-1">
        {cls.course?.name} - {cls.grade.name}
      </p>
      <div className="flex-col py-2 text-sm">25 học sinh</div>
      {!completed && (
        <div className="flex items-center gap-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-dark h-2.5 rounded-full"
              style={{
                width: `${
                  ((new Date(cls.endDate).getTime() - Date.now()) /
                    (new Date(cls.endDate).getTime() -
                      new Date(cls.startDate).getTime())) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <div className="text-[12px] text-primary-darkest">
            {" "}
            {Math.round(
              ((Date.now() - new Date(cls.startDate).getTime()) /
                (new Date(cls.endDate).getTime() -
                  new Date(cls.startDate).getTime())) *
                100,
            )}
            {"%"}
          </div>
        </div>
      )}
      <p className="text-[14px] text-gray-900 mt-1">
        {new Date(cls.startDate).toLocaleDateString("en-GB")} -{" "}
        {new Date(cls.endDate).toLocaleDateString("en-GB")}
      </p>
    </div>
  );
}
