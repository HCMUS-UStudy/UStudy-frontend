import React from 'react'

import { FaRegClock } from "react-icons/fa6";
import { MdPeopleOutline } from "react-icons/md";
import { GrScheduleNew } from "react-icons/gr";

export default function Classes() {
  const classes = [
    {
      id: 1,
      name: "6T1 - Lớp Toán",
      time: "7:00 - 10:00",
      schedule: "T2, T4, T6 hàng tuần",
      students: 24,
    },
    {
      id: 2,
      name: "6V2 - Lớp Văn",
      time: "8:00 - 11:00",
      schedule: "T3, T5 hàng tuần",
      students: 22,
    },
    {
      id: 3,
      name: "6A3 - Lớp Anh",
      time: "13:00 - 16:00",
      schedule: "T2, T4, T6 hàng tuần",
      students: 25,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách lớp học</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="border rounded-2xl shadow-md p-5 bg-white"
          >
            <h2 className="text-lg font-semibold">{cls.name}</h2>
            <div className='flex-col py-2'>
              <p className="flex mt-2.5 items-center gap-2.5">
                <FaRegClock className='font-semibold'/>
                {cls.time}
              </p>
              <p className="flex mt-2.5 items-center gap-2.5">
                <GrScheduleNew className='font-semibold'/>
                {cls.schedule}
              </p>
              <p className="flex mt-2.5 items-center gap-2.5">
                <MdPeopleOutline className='font-semibold'/>
                {cls.students} học sinh
              </p>
            </div>
            <button className="mt-4 w-full bg-sky-600 hover:bg-sky-800 text-white py-2 px-4 rounded-2xl transition">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
