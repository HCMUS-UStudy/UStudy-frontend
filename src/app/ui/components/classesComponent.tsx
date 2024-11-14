"use client";
import React, { useState } from "react";
import Button from "./button";
import { SearchField } from "./input";
import Pagination from "./pagination";

export default function CoursesComponent(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const [selectedSubject, setSelectedSubject] = useState("");
  const onCreateCourse = () => {
    //setShowModal(true);
  };
  const sampleClasses = [
    {
      ID: 1,
      MaLop: "T1",
      TenLop: "Toán 1",
      SiSo: 30,
      NgayBatDau: "2024-01-10",
      NgayKetThuc: "2024-05-20",
    },
    {
      ID: 2,
      MaLop: "TC1",
      TenLop: "Toán Chuyên 1",
      SiSo: 25,
      NgayBatDau: "2024-02-01",
      NgayKetThuc: "2024-06-15",
    },
    {
      ID: 3,
      MaLop: "L1",
      TenLop: "Lý 1",
      SiSo: 28,
      NgayBatDau: "2024-01-15",
      NgayKetThuc: "2024-05-30",
    },
    {
      ID: 4,
      MaLop: "LC1",
      TenLop: "Lý Chuyên 1",
      SiSo: 20,
      NgayBatDau: "2024-03-01",
      NgayKetThuc: "2024-07-10",
    },
    {
      ID: 5,
      MaLop: "H1",
      TenLop: "Hóa 1",
      SiSo: 32,
      NgayBatDau: "2024-01-20",
      NgayKetThuc: "2024-06-25",
    },
    // {
    //   ID: 6,
    //   MaLop: "HC1",
    //   TenLop: "Hóa Chuyên 1",
    //   SiSo: 26,
    //   NgayBatDau: "2024-02-15",
    //   NgayKetThuc: "2024-07-05",
    // },
    // {
    //   ID: 7,
    //   MaLop: "S1",
    //   TenLop: "Sinh 1",
    //   SiSo: 24,
    //   NgayBatDau: "2024-01-25",
    //   NgayKetThuc: "2024-05-25",
    // },
    // {
    //   ID: 8,
    //   MaLop: "SC1",
    //   TenLop: "Sinh Chuyên 1",
    //   SiSo: 22,
    //   NgayBatDau: "2024-03-10",
    //   NgayKetThuc: "2024-08-15",
    // },
    // {
    //   ID: 9,
    //   MaLop: "V1",
    //   TenLop: "Văn 1",
    //   SiSo: 27,
    //   NgayBatDau: "2024-02-20",
    //   NgayKetThuc: "2024-06-30",
    // },
    // {
    //   ID: 10,
    //   MaLop: "VC1",
    //   TenLop: "Văn Chuyên 1",
    //   SiSo: 23,
    //   NgayBatDau: "2024-03-20",
    //   NgayKetThuc: "2024-08-20",
    // },
  ];

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Quản lý lớp học
      </h2>

      <div className="relative flex items-center justify-between mt-6 mr-6">
        <div className="flex gap-3 items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả các khối</option>
            <option value="">Khối 10</option>
            <option value="">Khối 11</option>
            <option value="">Khối 12</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả các môn</option>
            <option value="">Toán</option>
            <option value="">Lý</option>
            <option value="">Hóa</option>
            <option value="">Văn</option>
            <option value="">Anh</option>
            <option value="">Sinh</option>
          </select>
          <SearchField
            className="w-[200px]"
            placeholder="Tìm theo tên lớp..."
          />
        </div>

        <Button onClick={onCreateCourse} type="button" className="pl-6 pr-6">
          Thêm lớp học
        </Button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 mr-6">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                ID
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center ">
                Mã lớp
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center w-[150px]">
                Tên lớp
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Sỉ số
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Ngày bắt đầu
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Ngày kết thúc
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleClasses.map((c, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.ID}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.MaLop}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 ">{c.TenLop}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.SiSo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.NgayBatDau}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {c.NgayKetThuc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination className="flex justify-end mt-5" totalPages={3} />
      </div>
    </>
  );
}
