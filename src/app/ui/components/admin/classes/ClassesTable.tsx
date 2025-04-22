"use client";
import React, { memo, useEffect, useState } from "react";
import { getAllClasses } from "@/app/lib/services/class";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { ArrowRight, Eye } from "lucide-react";
import { ClassItem } from "@/app/types";
import ClassPagination from "./ClassPagination";
import ClassEnrollmentModal from "./enrollment/ClassEnrollmentModal";
import Tooltip from "../../_common/Tooltip";

const MemoizedClassPagination = memo(ClassPagination);

export default function ClassesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const response = await getAllClasses(query, currentPage - 1, 5);
        console.log(response.content);
        setClasses(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
    return;
  }, [query, currentPage]);

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
        <TableBody isLoading={isLoading}>
          {classes.map((c, i) => (
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
      <MemoizedClassPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
      <ClassEnrollmentModal
        classId={selectedId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
