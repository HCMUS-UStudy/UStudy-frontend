"use client"

import React, { useState } from 'react';
import { FaRegClock } from "react-icons/fa6";
import { MdPeopleOutline } from "react-icons/md";
import { GrScheduleNew } from "react-icons/gr";

export default function Classes() {
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing' hoặc 'completed'

  const ongoingClasses = [
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
    {
      id: 4,
      name: "7B1 - Lớp Sinh",
      time: "9:00 - 11:00",
      schedule: "T3, T5 hàng tuần",
      students: 20,
    },
    {
      id: 5,
      name: "8H1 - Lớp Hóa",
      time: "14:00 - 16:00",
      schedule: "T2, T4 hàng tuần",
      students: 18,
    },
  ];

  const completedClasses = [
    {
      id: 6,
      name: "9L1 - Lớp Lý",
      time: "8:00 - 10:00",
      schedule: "T2, T4 hàng tuần",
      students: 21,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách lớp học</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'ongoing' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
        >
          Lớp đang dạy
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
        >
          Lớp đã hoàn thành
        </button>
      </div>

      <div className="transition-transform duration-500 ease-in-out">
        {activeTab === 'ongoing' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingClasses.map((cls) => (
              <div key={cls.id} className="border rounded-2xl shadow-md p-5 bg-white">
                <h2 className="text-lg font-semibold">{cls.name}</h2>
                <div className='flex-col py-2'>
                  <p className="flex mt-2.5 items-center gap-2.5">
                    <FaRegClock className='font-semibold' />
                    {cls.time}
                  </p>
                  <p className="flex mt-2.5 items-center gap-2.5">
                    <GrScheduleNew className='font-semibold' />
                    {cls.schedule}
                  </p>
                  <p className="flex mt-2.5 items-center gap-2.5">
                    <MdPeopleOutline className='font-semibold' />
                    {cls.students} học sinh
                  </p>
                </div>
                <button className="mt-4 w-full bg-sky-600 hover:bg-sky-800 text-white py-2 px-4 rounded-2xl transition">
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedClasses.map((cls) => (
              <div key={cls.id} className="border rounded-2xl shadow-md p-5 bg-white">
                <h2 className="text-lg font-semibold">{cls.name}</h2>
                <div className='flex-col py-2'>
                  <p className="flex mt-2.5 items-center gap-2.5">
                    <FaRegClock className='font-semibold' />
                    {cls.time}
                  </p>
                  <p className="flex mt-2.5 items-center gap-2.5">
                    <GrScheduleNew className='font-semibold' />
                    {cls.schedule}
                  </p>
                  <p className="flex mt-2.5 items-center gap-2.5">
                    <MdPeopleOutline className='font-semibold' />
                    {cls.students} học sinh
                  </p>
                </div>
                <button className="mt-4 w-full bg-sky-600 hover:bg-sky-800 text-white py-2 px-4 rounded-2xl transition">
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
