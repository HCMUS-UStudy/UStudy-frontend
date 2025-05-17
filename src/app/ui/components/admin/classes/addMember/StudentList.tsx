"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../../_common/Table";
import SearchField from "../../../_common/text-field/SearchField";
import Checkbox from "../../../_common/Checkbox";
import Tooltip from "../../../_common/Tooltip";
import { Button } from "../../../_common/Button";
import { getAllAccount } from "@/app/lib/services/user";
import { AccountItem } from "@/app/types";

export default function StudentList() {
  const [currentPage, setCurrentPage] = useState<number>(0); // Bắt đầu từ trang 0
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [students, setStudents] = useState<AccountItem[]>([]); // Danh sách học sinh
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Trạng thái tải thêm
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // Từ khóa tìm kiếm
  const searchParams = useSearchParams();

  const { data: studentList } = useQuery({
    queryKey: [
      "ListStudents",
      currentPage,
      searchParams.get("AccountName") ?? "",
    ],
    refetchOnWindowFocus: false,
    queryFn: () =>
      getAllAccount(
        searchParams.get("AccountName") ?? "",
        5,
        "STUDENT",
        currentPage,
      ),
  });

  useEffect(() => {
    if (studentList) {
      if (currentPage === 0) {
        setStudents(studentList.content); // Nếu là trang đầu tiên, thay thế danh sách
      } else {
        setStudents((prev) => [...prev, ...studentList.content]); // Nếu không, thêm vào danh sách hiện tại
      }
    }
  }, [studentList, currentPage]);

  const handleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const loadMore = async () => {
    if (studentList?.totalPages && currentPage < studentList.totalPages - 1) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1); // Tăng trang hiện tại
      setIsLoadingMore(false);
    }
  };

  const selectedStudents = students.filter((student) =>
    selectedIds.includes(student.id),
  );

  const unselectedStudents = students.filter(
    (student) => !selectedIds.includes(student.id),
  );

  const filteredUnselectedStudents = unselectedStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      student.email.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  return (
    <div className="px-2">
      <div className="flex justify-between mb-3">
        <div className="flex gap-3 w-1/3">
          <SearchField
            queryKey="AccountName"
            placeholder="Tìm tài khoản..."
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className={`${selectedIds.length > 0 ? "flex" : "hidden"}`}>
          <Button variant="primary" className="w-fit py-1">
            Thêm
          </Button>
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto max-h-[400px]">
        <Table>
          <TableHeader
            columns={[
              "GenId",
              "Tên",
              "Email",
              "Địa chỉ",
              "Ngày sinh",
              "Số điện thoại",
              "Giới tính",
              "Chọn",
            ]}
          />
          {selectedStudents && selectedStudents.length > 0 && (
            <TableBody>
              {selectedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="text-left pl-4 py-4">
                    {student.genId}
                  </TableCell>
                  <TableCell className="text-left pl-2 py-4">
                    {student.name.length > 20 ? (
                      <button>
                        <Tooltip text={student.name}>
                          {student.name.slice(0, 20)}...
                        </Tooltip>
                      </button>
                    ) : (
                      student.name
                    )}
                  </TableCell>
                  <TableCell className="text-left pl-2 py-4">
                    {student.email.length > 25 ? (
                      <button>
                        <Tooltip text={student.email}>
                          {student.email.slice(0, 25)}...
                        </Tooltip>
                      </button>
                    ) : (
                      student.email
                    )}
                  </TableCell>
                  <TableCell className="text-left pl-2 py-4">
                    {student.address.length > 40 ? (
                      <button>
                        <Tooltip text={student.address}>
                          {student.address.slice(0, 40)}...
                        </Tooltip>
                      </button>
                    ) : (
                      student.address
                    )}
                  </TableCell>
                  <TableCell className="text-left pl-2 py-4">
                    {new Date(student.birthday).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-left pl-2 py-4">
                    {student.phone}
                  </TableCell>
                  <TableCell className="text-left pl-[20px] py-4">
                    {student.gender === "MALE" ? "Nam" : "Nữ"}
                  </TableCell>
                  <TableCell className="flex py-4 justify-center items-center">
                    <Checkbox
                      className="w-5 h-5"
                      tickClassName="w-3 h-3"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => handleSelection(student.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}

          <TableBody noDataMessage={false}>
            {filteredUnselectedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="text-left pl-4 py-4">
                  {student.genId}
                </TableCell>
                <TableCell className="text-left pl-2 py-4">
                  {student.name.length > 20 ? (
                    <button>
                      <Tooltip text={student.name}>
                        {student.name.slice(0, 20)}...
                      </Tooltip>
                    </button>
                  ) : (
                    student.name
                  )}
                </TableCell>
                <TableCell className="text-left pl-2 py-4">
                  {student.email.length > 25 ? (
                    <button>
                      <Tooltip text={student.email}>
                        {student.email.slice(0, 25)}...
                      </Tooltip>
                    </button>
                  ) : (
                    student.email
                  )}
                </TableCell>
                <TableCell className="text-left pl-2 py-4">
                  {student.address.length > 40 ? (
                    <button>
                      <Tooltip text={student.address}>
                        {student.address.slice(0, 40)}...
                      </Tooltip>
                    </button>
                  ) : (
                    student.address
                  )}
                </TableCell>
                <TableCell className="text-left pl-2 py-4">
                  {new Date(student.birthday).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-left pl-2 py-4">
                  {student.phone}
                </TableCell>
                <TableCell className="text-left pl-[20px] py-4">
                  {student.gender === "MALE" ? "Nam" : "Nữ"}
                </TableCell>
                <TableCell className="pl-4 py-4">
                  <Checkbox
                    className="w-5 h-5"
                    tickClassName="w-3 h-3"
                    checked={selectedIds.includes(student.id)}
                    onChange={() => handleSelection(student.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {studentList?.totalPages &&
          currentPage < studentList.totalPages - 1 && (
            <div className="flex justify-center mt-4">
              <button
                className="text-[16px] text-primary-darker hover:text-primary-darkest underline"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Đang tải..." : "Hiển thị thêm"}
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
