"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import React from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaChalkboard, FaPenNib } from "react-icons/fa6";
// import { TableProps } from "@/app/ui/components/Table";

export default function ClerkDashboard() {
  // const classTableContent: TableProps = {
  //   tableName: "Các lớp học nổi bật",
  //   colNames: ["ID", "Tên lớp học", "Số học viên"],
  //   content: [
  //     {
  //       colName: "ID",
  //       rowContent: ["1", "2", "3", "4", "5"],
  //     },
  //     {
  //       colName: "Tên lớp học",
  //       rowContent: [
  //         "Toán nâng cao lớp 9",
  //         "Tiếng Anh giao tiếp cơ bản",
  //         "Văn học hiện đại lớp 12",
  //         "Luyện thi đại học môn Hóa",
  //         "Lịch sử thế giới lớp 10",
  //       ],
  //     },
  //     {
  //       colName: "Số lượng học viên",
  //       rowContent: ["30", "25", "20", "35", "28"],
  //     },
  //   ],
  // };
  return (
    <div>
      <div className="flex gap-4">
        <Card className="w-1/3 flex flex-col justify-between md:block rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-base font-semibold text-gray-800">
              Số lượng lớp
            </CardTitle>
            <FaChalkboard className="h-5 w-5 text-black hidden md:block" />{" "}
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              3000
            </div>
          </CardContent>
        </Card>
        <Card className="w-1/3 flex flex-col justify-between md:block rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-base font-semibold text-gray-800">
              Số lượng giáo viên
            </CardTitle>
            <FaChalkboardTeacher className="h-5 w-5 text-black hidden md:block" />{" "}
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              3000
            </div>
          </CardContent>
        </Card>
        <Card className="w-1/3 flex flex-col justify-between md:block rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-base font-semibold text-gray-800">
              Số lượng học viên
            </CardTitle>
            <FaPenNib className="h-5 w-5 text-black hidden md:block" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              3000
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row mt-3 gap-4 ">
        {/* <Table
          tableName={classTableContent.tableName}
          colNames={classTableContent.colNames}
          content={classTableContent.content}
        />
        <Table
          tableName={classTableContent.tableName}
          colNames={classTableContent.colNames}
          content={classTableContent.content}
        /> */}
      </div>
    </div>
  );
}
