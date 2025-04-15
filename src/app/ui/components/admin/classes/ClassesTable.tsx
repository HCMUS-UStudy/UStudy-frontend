"use client";
import React, { memo, useEffect, useState } from "react";
import { getAllClasses } from "@/app/lib/services/class";
import { Button } from "@/app/ui/components/_common/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { ArrowRightCircle, Eye } from "lucide-react";
import { IoWarningOutline } from "react-icons/io5";
import { ClassItem } from "@/app/types";
import ClassPagination from "./ClassPagination";
import ClassEnrollmentModal from "./enrollment/ClassEnrollmentModal";

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
        const response = await getAllClasses("", currentPage - 1, 5);
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

  if (classes.length === 0 && isLoading === false) {
    return (
      <div className="flex flex-col items-center py-4 w-full self-center text-primary-dark border-2 border-dashed rounded border-primary-dark">
        <IoWarningOutline className="size-24" />
        <div className="text-xl">Chưa có lớp học</div>
      </div>
    );
  } else {
    return (
      <div>
        <Table>
          <TableHeader
            columns={["ID", "Tên lớp", "Môn học", "Khối", "Học phí", ""]}
            className="bg-gray-100"
          />
          <TableBody isLoading={isLoading}>
            {classes.map((c, i) => (
              <TableRow key={i}>
                <TableCell className="w-20">{i + 1}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.course.name}</TableCell>
                <TableCell>{c.grade.name}</TableCell>
                <TableCell>{c.fee} VNĐ</TableCell>
                <TableCell className="p-0 w-5 flex items-center justify-center gap-2 px-2 py-3">
                  {/* Nút xem lớp */}
                  <Button
                    // onClick={() =>
                    //   router.push(`/clerk/classes/${c.id}/class-management`)
                    // }
                    type="button"
                    variant="outlined"
                    className="p-2 "
                  >
                    <Eye size={20} />
                  </Button>
                  {/* <ClassEnrollment classId={c.id} /> */}
                  <Button
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedId(c.id);
                    }}
                    type="button"
                    variant="outlined"
                    className="p-2"
                  >
                    <ArrowRightCircle size={20} />
                  </Button>
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
}
