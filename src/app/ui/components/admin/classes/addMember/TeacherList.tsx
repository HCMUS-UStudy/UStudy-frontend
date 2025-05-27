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

export default function TeacherList({ onClose }: { onClose: () => void }) {
  const [currentPage, setCurrentPage] = useState<number>(0); // Bắt đầu từ trang 0
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<AccountItem[]>([]); // Danh sách giáo viên
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Trạng thái tải thêm
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // Từ khóa tìm kiếm
  const searchParams = useSearchParams();
  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;
  const queryClient = useQueryClient();

  const { data: teacherList } = useQuery({
    queryKey: [
      "ListTeachersToAdd",
      currentPage,
      searchParams?.get("AccountName") ?? "",
    ],
    refetchOnWindowFocus: false,
    queryFn: () => getFreeUsers(classId as string, 6, "TEACHER", currentPage),
  });

  useEffect(() => {
    if (teacherList) {
      if (currentPage === 0) {
        setTeachers(teacherList.content); // Nếu là trang đầu tiên, thay thế danh sách
      } else {
        setTeachers((prev) => [...prev, ...teacherList.content]); // Nếu không, thêm vào danh sách hiện tại
      }
    }
  }, [teacherList, currentPage]);

  const handleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const loadMore = async () => {
    if (teacherList?.totalPages && currentPage < teacherList.totalPages - 1) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1); // Tăng trang hiện tại
      setIsLoadingMore(false);
    }
  };

  const selectedTeachers = teachers.filter((teacher) =>
    selectedIds.includes(teacher.id),
  );

  const unselectedTeachers = teachers.filter(
    (teacher) => !selectedIds.includes(teacher.id),
  );

  const filteredUnselectedTeachers = unselectedTeachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      teacher.genId.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const useAddMembersMutation = useMutation({
    mutationFn: (ids: string[]) => addMembers(ids, classId, "TEACHER"),
    onSuccess: () => {
      toast.success("Thêm giáo viên thành công", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["ListMembers"] });
      queryClient.invalidateQueries({ queryKey: ["ListTeachersToAdd"] });
    },
    onError: () => {
      toast.error("Thêm giáo viên thất bại", {
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
            placeholder="Tìm id hoặc tên giáo viên..."
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
            {[...selectedTeachers, ...filteredUnselectedTeachers].map(
              (teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.genId}</TableCell>
                  <TableCell>
                    {teacher.name.length > 18 ? (
                      <button>
                        <Tooltip text={teacher.name}>
                          {teacher.name.slice(0, 18)}...
                        </Tooltip>
                      </button>
                    ) : (
                      teacher.name
                    )}
                  </TableCell>
                  <TableCell>
                    {teacher.email.length > 25 ? (
                      <button>
                        <Tooltip text={teacher.email}>
                          {teacher.email.slice(0, 25)}...
                        </Tooltip>
                      </button>
                    ) : (
                      teacher.email
                    )}
                  </TableCell>
                  <TableCell>
                    {teacher.address.length > 30 ? (
                      <button>
                        <Tooltip text={teacher.address}>
                          {teacher.address.slice(0, 30)}...
                        </Tooltip>
                      </button>
                    ) : (
                      teacher.address
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(teacher.birthday).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>
                    {teacher.gender === "MALE" ? "Nam" : "Nữ"}
                  </TableCell>
                  <TableCell className="pl-7">
                    <Checkbox
                      className="w-5 h-5"
                      tickClassName="w-3 h-3"
                      checked={selectedIds.includes(teacher.id)}
                      onChange={() => handleSelection(teacher.id)}
                    />
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
        {teacherList?.totalPages &&
          currentPage < teacherList.totalPages - 1 && (
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
