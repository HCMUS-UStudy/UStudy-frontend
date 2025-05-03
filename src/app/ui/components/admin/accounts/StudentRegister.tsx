"use client";
import React, { memo, useCallback, useEffect, useState } from "react";
import Pagination from "../../_common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../_common/Table";
import {
  confirmRegister,
  getRegister,
  rejectRegister,
} from "@/app/lib/services/register";
import { FaCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { Button } from "../../_common/Button";
import { getAllRolesByDefault } from "@/app/lib/services/role";
import { toast } from "react-toastify";
import Tooltip from "../../_common/Tooltip";
import SearchField from "../../_common/text-field/SearchField";
import { useSearchParams } from "next/navigation";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const MemoizedPagination = memo(Pagination);

export default function StudentRegister() {
  // const [loading, setLoading] = useState<boolean>(false);
  // const [registerStudents, setRegisterStudents] = useState<RegisterItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [totalPages, setTotalPages] = useState<number>(0);
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  // const [trigger, setTrigger] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [studentRoleId, setStudentRoleId] = useState<string>("");

  const { data: registerStudents, status: registerStudentsStatus } = useQuery({
    queryKey: [
      "RegisterStudents",
      currentPage - 1,
      searchParams.get("AccountName") ?? "",
    ],
    queryFn: () =>
      getRegister(
        "STUDENT",
        5,
        currentPage - 1,
        searchParams.get("AccountName") ?? "",
      ),
    placeholderData: keepPreviousData,
  });

  const { data: studentRoleIds } = useQuery({
    queryKey: ["StudentRoleId"],
    queryFn: () => getAllRolesByDefault("STUDENT"),
  });
  useEffect(() => {
    setStudentRoleId(studentRoleIds?.at(0)?.id || "");
  }, [studentRoleIds]);
  const nextPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);
  const prevPage = useCallback(() => {
    if (
      registerStudents?.totalPages &&
      currentPage < registerStudents.totalPages
    )
      setCurrentPage(currentPage + 1);
  }, [currentPage, registerStudents]);
  const pageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const handleApprove = async (userId?: string) => {
    useApproveMutation.mutate(userId);
  };
  const queryClient = useQueryClient();
  const useApproveMutation = useMutation({
    mutationFn: (userId?: string) =>
      confirmRegister(userId ? [userId] : selectedIds, studentRoleId),
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RegisterStudents"] });
      toast.success("Duyệt tài khoản thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
  });
  const handleReject = async (userId?: string) => {
    useRejectMutation.mutate(userId);
  };
  const useRejectMutation = useMutation({
    mutationFn: (userId?: string) =>
      rejectRegister(userId ? [userId] : selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RegisterStudents"] });
      toast.success("Từ chối tài khoản thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
    onError: () => {
      toast.error("Từ chối tài khoản thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
  });

  useEffect(() => {
    if (selectAll && registerStudents) {
      setSelectedIds(registerStudents?.content.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  }, [selectAll, registerStudents]);

  return (
    <div>
      <div className="flex justify-between mb-3">
        <div className="flex gap-3 w-1/3">
          <SearchField queryKey="AccountName" placeholder="Tìm tài khoản..." />
          {registerStudents?.content.length !== 0 && (
            <Button
              className="text-sm text-nowrap"
              onClick={() => setMultiSelect((prev) => !prev)}
            >
              {multiSelect ? "Chọn đơn lẻ" : "Chọn nhiều"}
            </Button>
          )}
        </div>
        {registerStudents?.content.length !== 0 && (
          <div className="flex gap-3 text-sm">
            <Button
              className={`transition-all ${multiSelect ? "opacity-100" : "opacity-0"}`}
              onClick={() => setSelectAll((prev) => !prev)}
            >
              Chọn tất cả {selectAll && <FaCheck className="ml-2" />}
            </Button>
            <Button
              className={`transition-all ${multiSelect ? "opacity-100" : "opacity-0"}`}
              onClick={() => handleApprove()}
            >
              Duyệt
            </Button>
          </div>
        )}
      </div>
      <Table>
        <TableHeader
          columns={[
            "Tên",
            "Email",
            "Địa chỉ",
            "Ngày sinh",
            "Số điện thoại",
            "Giới tính",
            "Hành động",
          ]}
        />
        <TableBody isLoading={registerStudentsStatus === "pending"}>
          {registerStudents?.content.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.address}</TableCell>
              <TableCell>
                {new Date(student.birthday).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell>{student.phone}</TableCell>
              <TableCell>{student.gender === "MALE" ? "Nam" : "Nữ"}</TableCell>
              {multiSelect ? (
                <TableCell className="flex justify-center">
                  <label className="relative w-5 h-5 border-2 rounded border-primary-darker flex items-center justify-center hover:cursor-pointer hover:bg-primary">
                    <input
                      className="hidden peer"
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => handleSelection(student.id)}
                    />
                    <FaCheck className="absolute size-3 text-primary-darkest opacity-0 peer-checked:opacity-100 transition-all" />
                  </label>
                </TableCell>
              ) : (
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <div>
                      <Tooltip text="Duyệt tài khoản">
                        <FaCheck
                          onClick={() => handleApprove(student.id)}
                          className="size-6 text-primary-dark hover:text-primary-darkest cursor-pointer transition-colors"
                        />
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip text="Từ chối tài khoản">
                        <FaTimes
                          onClick={() => handleReject(student.id)}
                          className="size-6 text-red-500 hover:text-red-800 cursor-pointer transition-colors"
                        />
                      </Tooltip>
                    </div>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MemoizedPagination
        currentPage={currentPage}
        totalPages={registerStudents?.totalPages ?? 1}
        handlePageClick={pageClick}
        handlePreviousPage={prevPage}
        handleNextPage={nextPage}
      />
    </div>
  );
}
