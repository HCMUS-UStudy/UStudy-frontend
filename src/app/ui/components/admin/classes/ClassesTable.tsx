"use client";
import React, {
  useState,
  // useState
} from "react";
import { getAllClasses } from "@/app/lib/services/class";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { ClassData } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/store/store";
import Pagination from "../../_common/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClassesTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const params = useSearchParams();
  const query = params?.get("query") || "";
  const isAssigned = params?.get("type") === "isAssigned" ? true : false;
  const branchId =
    useAppSelector((state) => state.branch.selectedBranchId) || "";

  const {
    data: fetchClasses,
    status,
    error,
  } = useQuery<ClassData>({
    queryKey: ["Classes", query, currentPage, branchId, isAssigned],
    queryFn: () =>
      getAllClasses(query, currentPage - 1, 5, branchId, isAssigned, "", ""),
    // enabled: mounted, // Only run query after component is mounted
  });
  const totalPages = fetchClasses?.totalPages || 0;
  const router = useRouter();
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader
          columns={[
            "Tên lớp",
            "Môn học",
            "Khối",
            "Học phí",
            "Ngày bắt đầu",
            "Ngày kết thúc",
          ]}
        />
        <TableBody isLoading={status === "pending"}>
          {fetchClasses?.content.map((c, i) => (
            <TableRow
              key={i}
              className="cursor-pointer"
              onClick={() => {
                router.push(`/admin/classes/${c.id}`);
              }}
            >
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.course.name}</TableCell>
              <TableCell>{c.grade.name}</TableCell>
              <TableCell>{c.fee} VNĐ</TableCell>
              <TableCell>{c.startDate}</TableCell>
              <TableCell>{c.endDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={(page) => setCurrentPage(page)}
        handlePreviousPage={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        handleNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      />
    </div>
  );
}
