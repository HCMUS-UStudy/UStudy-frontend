import React from "react";
import { FaRegClock } from "react-icons/fa6";
import { MdMeetingRoom } from "react-icons/md";
import { MdPeopleOutline } from "react-icons/md";
import { GrScheduleNew } from "react-icons/gr";
import { ClassTeacher, ClassTime } from "@/app/types/type";
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

  const getDay = (classTimes: ClassTime[]) => {
    const days = classTimes.map((item) => item.day);
    days.sort((a, b) => a - b);
    // Chuyển thành chuỗi "T2", "T6", ...
    const dayLabels = days.map((day) => (day === 1 ? "CN" : `T${day}`));
    return dayLabels.join(" - ");
  };

  const getTime = (classTimes: ClassTime[]) => {
    return (
      classTimes[0].startTime.split(":").slice(0, 2).join(":") +
      " - " +
      classTimes[0].endTime.split(":").slice(0, 2).join(":")
    );
  };

  const details = [
    { icon: <MdMeetingRoom className="font-semibold" />, text: cls.room.name },
    {
      icon: <FaRegClock className="font-semibold" />,
      text: getTime(cls.classTimes),
    },
    {
      icon: <GrScheduleNew className="font-semibold" />,
      text: getDay(cls.classTimes),
    },
    {
      icon: <MdPeopleOutline className="font-semibold" />,
      text: `${cls.students.length} học sinh`,
    },
  ];

  return (
    <div
      className={`border rounded-2xl shadow-md p-5 cursor-pointer ${!completed ? "bg-white hover:bg-slate-50" : "bg-slate-100 hover:bg-slate-200"}`}
      onClick={handleClick}
    >
      <h2 className="text-lg font-semibold">{cls.name}</h2>
      <div className="flex-col py-2">
        {details.map((detail, index) => (
          <p key={index} className="flex mt-2.5 items-center gap-2.5">
            {detail.icon}
            {detail.text}
          </p>
        ))}
      </div>
      {/* <button 
        className={`mt-4 w-full py-2 px-4 rounded-2xl transition text-black
                  ${!completed ? "bg-white" : "bg-slate-500 hover:bg-slate-600"}`}
        onClick={handleClick}
      >
				Xem chi tiết
			</button> */}
    </div>
  );
}
