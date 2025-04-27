"use client";
import React, { memo, useState } from "react";
import { getAllClasses } from "@/app/lib/services/class";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { ArrowRight, Eye } from "lucide-react";
import { ClassData } from "@/app/types";
import ClassPagination from "./ClassPagination";
import ClassEnrollmentModal from "./enrollment/ClassEnrollmentModal";
import Tooltip from "../../_common/Tooltip";
import { useQuery } from "@tanstack/react-query";

const MemoizedClassPagination = memo(ClassPagination);

export default function ClassesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const {
    data: fetchClasses,
    status,
    error,
  } = useQuery<ClassData>({
    queryKey: ["classes", query, currentPage],
    queryFn: () => getAllClasses(query, currentPage - 1, 5),
    placeholderData: (prevData) => prevData,
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader
          columns={[
            "ID",
            "Tên lớp",
            "Môn học",
            "Khối",
            "Học phí",
            "Ngày bắt đầu",
            "Ngày kết thúc",
            "",
          ]}
          className="bg-gray-100"
        />
        <TableBody isLoading={status === "pending"}>
          {fetchClasses?.content.map((c, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="max-w-12">{c.name}</TableCell>
              <TableCell>{c.course.name}</TableCell>
              <TableCell>{c.grade.name}</TableCell>
              <TableCell>{c.fee} VNĐ</TableCell>
              <TableCell className="max-w-12">{c.startDate}</TableCell>
              <TableCell className="max-w-10">{c.endDate}</TableCell>
              <TableCell className="p-0 w-10 flex items-center justify-center gap-2 px-2 py-3">
                {/* Nút xem lớp */}
                <Tooltip
                  text="Xem lớp học"
                  // onClick={() =>
                  //   router.push(`/clerk/classes/${c.id}/class-management`)
                  // }
                >
                  <Eye className="size-8 text-primary-dark hover:text-primary-darkest cursor-pointer transition-all" />
                </Tooltip>
                {/* <ClassEnrollment classId={c.id} /> */}
                <Tooltip text="Duyệt tài khoản">
                  <div
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedId(c.id);
                    }}
                  >
                    <ArrowRight className="size-8 text-primary-dark hover:text-primary-darkest cursor-pointer transition-all" />
                  </div>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {status === "success" && (
        <MemoizedClassPagination
          currentPage={currentPage}
          totalPages={fetchClasses?.totalPages || 1}
        />
      )}
      <ClassEnrollmentModal
        classId={selectedId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
