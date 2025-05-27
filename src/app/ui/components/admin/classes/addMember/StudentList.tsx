"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/ui/components/_common/Table";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import Checkbox from "@/app/ui/components/_common/Checkbox";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { Button } from "@/app/ui/components/_common/Button";
import { getFreeUsers } from "@/app/lib/services/user";
import { AccountItem } from "@/app/types";
import { addMembers } from "@/app/lib/services/class";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function StudentList({ onClose }: { onClose: () => void }) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [students, setStudents] = useState<AccountItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const searchParams = useSearchParams();
  const { classId } = useParams();
  const queryClient = useQueryClient();

  const { data: studentList } = useQuery({
    queryKey: [
      "ListStudentsToAdd",
      currentPage,
      searchParams.get("AccountName") ?? "",
    ],
    refetchOnWindowFocus: false,
    queryFn: () => getFreeUsers(classId as string, 6, "STUDENT", currentPage),
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
      setCurrentPage((prev) => prev + 1);
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
      student.genId.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const useAddMembersMutation = useMutation({
    mutationFn: (ids: string[]) => addMembers(ids, classId, "STUDENT"),
    onSuccess: () => {
      toast.success("Thêm học viên thành công", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["ListMembers"] });
      queryClient.invalidateQueries({ queryKey: ["ListStudentsToAdd"] });
    },
    onError: () => {
      toast.error("Thêm học viên thất bại", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
    },
  });

  const handleAddMembers = () => {
    if (selectedIds.length > 0) {
      useAddMembersMutation.mutate(selectedIds);
    }
  };

  return (
    <div className="px-2">
      <div className="flex justify-between mb-3">
        <div className="flex gap-3 w-1/3">
          <SearchField
            queryKey="AccountName"
            placeholder="Tìm id hoặc tên học viên..."
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className={`${selectedIds.length > 0 ? "flex" : "hidden"}`}>
          <Button
            variant="primary"
            className="w-fit py-1"
            onClick={handleAddMembers}
          >
            Thêm
          </Button>
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto max-h-[420px]">
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
          <TableBody noDataMessage={false}>
            {[...selectedStudents, ...filteredUnselectedStudents].map(
              (student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.genId}</TableCell>
                  <TableCell>
                    {student.name.length > 18 ? (
                      <button>
                        <Tooltip text={student.name}>
                          {student.name.slice(0, 18)}...
                        </Tooltip>
                      </button>
                    ) : (
                      student.name
                    )}
                  </TableCell>
                  <TableCell>
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
                  <TableCell>
                    {student.address.length > 30 ? (
                      <button>
                        <Tooltip text={student.address}>
                          {student.address.slice(0, 30)}...
                        </Tooltip>
                      </button>
                    ) : (
                      student.address
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(student.birthday).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    {student.gender === "MALE" ? "Nam" : "Nữ"}
                  </TableCell>
                  <TableCell className="pl-7">
                    <Checkbox
                      className="w-5 h-5"
                      tickClassName="w-3 h-3"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => handleSelection(student.id)}
                    />
                  </TableCell>
                </TableRow>
              ),
            )}
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
