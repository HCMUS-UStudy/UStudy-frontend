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
import { RegisterItem } from "@/app/types";
import { FaCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { Button } from "../../_common/Button";
import { getAllRolesByDefault } from "@/app/lib/services/role";
import { toast } from "react-toastify";
import Tooltip from "../../_common/Tooltip";
import SearchField from "../../_common/text-field/SearchField";
import { useSearchParams } from "next/navigation";

const MemoizedPagination = memo(Pagination);

export default function TeacherRegister() {
  const [loading, setLoading] = useState<boolean>(false);
  const [registerStudents, setRegisterStudents] = useState<RegisterItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const nextPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);
  const prevPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);
  const pageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  const handleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const handleApprove = async (userId?: string) => {
    try {
      setLoading(true);
      const roleId = (await getAllRolesByDefault("TEACHER")).at(0)?.id;
      if (!roleId) {
        throw new Error("Không tìm thấy role id");
      }
      const response = await confirmRegister(
        userId ? [userId] : selectedIds,
        roleId,
      );
      setTrigger((prev) => !prev);
      if (response.statusCode === "OK") {
        toast.success("Duyệt tài khoản thành công", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: false,
        });
      } else {
        toast.error("Duyệt tài khoản thất bại", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Duyệt tài khoản thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleReject = async (userId?: string) => {
    try {
      setLoading(true);
      const response = await rejectRegister(userId ? [userId] : selectedIds);
      setTrigger((prev) => !prev);
      if (response.statusCode === "OK") {
        toast.success("Từ chối tài khoản thành công", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: false,
        });
      } else {
        toast.error("Từ chối tài khoản thất bại", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Từ chối tài khoản thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRegister(
        "TEACHER",
        5,
        currentPage - 1,
        searchParams?.get("AccountName") ?? "",
      );
      setRegisterStudents(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchParams]);

  useEffect(() => {
    if (selectAll) {
      setSelectedIds(registerStudents.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  }, [selectAll, registerStudents]);
  useEffect(() => {
    fetchData();
  }, [trigger, fetchData, searchParams]);

  return (
    <div>
      <div className="flex justify-between mb-3">
        <div className="flex gap-3 w-1/3">
          <SearchField queryKey="AccountName" placeholder="Tìm tài khoản..." />
          {registerStudents.length !== 0 && (
            <Button
              className="text-sm text-nowrap"
              onClick={() => setMultiSelect((prev) => !prev)}
            >
              {multiSelect ? "Chọn đơn lẻ" : "Chọn nhiều"}
            </Button>
          )}
        </div>
        {registerStudents.length !== 0 && (
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
        <TableBody isLoading={loading}>
          {registerStudents.map((student) => (
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
        totalPages={totalPages}
        handlePageClick={pageClick}
        handlePreviousPage={prevPage}
        handleNextPage={nextPage}
      />
    </div>
  );
}
