"use server";
import { getAllClasses } from "@/app/lib/api";
import { ClassData, ClassItem } from "@/app/types/type";
import { cookies } from "next/headers";
import React from "react";

export interface ColumnContent {
  colName: string;
  rowContent: string[];
}

export interface TableProps {
  tableName: string;
  colNames: string[];
  content: ColumnContent[];
}

export async function Table({ tableName, colNames, content }: TableProps) {
  return (
    <div className="flex flex-col w-full space-y-4 p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <p className="text-xl text-gray-950 font-extrabold">{tableName}</p>
      </div>
      <div className="relative overflow-x-auto rounded-md shadow-md">
        <table className="w-full text-sm text-left text-secondary_text bg-sky-50 table-auto divide-y divide-gray-300 ">
          <thead className="text-gray-950">
            <tr className="divide-x divide-gray-300">
              {colNames.map((col, index) => (
                <th key={index} scope="row" className="px-6 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 divide-dashed">
            {content[0].rowContent.map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className="odd:bg-white even:bg-sky-50 divide-x divide-gray-300 divide-dashed">
                {content.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    {col.rowContent[rowIdx]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function ClassesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  let displays: ClassItem[] = [];
  try {
    const classes = await getAllClasses(query, currentPage);
    // console.log(classes);
    displays = classes.content.map((item) => ({
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      room: {
        name: item.room.name,
      },
      branch: {
        address: item.branch.address,
        name: item.branch.name,
      },
    }));
    // console.log(classes);
  } catch (error) {
    console.log(error);
  }
  // console.log(classes);
  return (
    <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            ID
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center w-[150px]">
            Tên lớp
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Phòng
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Ngày bắt đầu
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Ngày kết thúc
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Tên chi nhánh
          </th>
          <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
            Địa chỉ
          </th>
        </tr>
      </thead>
      <tbody>
        {/* {classes.content.map((c, i) => {})} */}
        {displays.map((c, i) => (
          <tr key={i} className="hover:bg-gray-50 transition-all duration-200">
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              {i + 1}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              {c.name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              {c.room.name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              {c.startDate}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              {c.endDate}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              {c.branch.name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 text-center">
              {c.branch.address}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
