"use client";

import React, { useEffect, useState } from "react";
import { ClassItem } from "@/app/types/type";
import { usePathname, useRouter } from "next/navigation";
import { getAllClasses } from "@/app/lib/services/class";
import { Button } from "@/app/ui/components/_common/Button";
import Pagination from "@/app/ui/components/_common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { ArrowRightCircle, Eye } from "lucide-react";
import ClassRegisterModal from "./ClassRegisterModal";

export default function ClassesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  // let displays: ClassItem[] = [];
  useEffect(() => {
    const fetchData = async () => {
      let filteredData: ClassItem[] = [];
      setIsLoading(true);
      try {
        const response = await getAllClasses(query, currentPage - 1, 5);
        filteredData = response.content.map((item) => ({
          id: item.id,
          name: item.name,
          course: {
            name: item.course.name,
          },
          room: {
            // name: item.room.name,
            name: "",
          },
          // fee: item.fee,
          fee: 0,
          grade: {
            name: item.grade.name,
          },
        }));
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setClasses(filteredData);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, query]);
  // console.log(classes);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      currentPage--;
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handlePageClick = (page: number) => {
    currentPage = page;
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleOpenModal = (id: string) => {
    setSelectedClassId(id);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Table>
        <TableHeader
          columns={["ID", "Tên lớp", "Môn học", "Khối", "Phòng", "Học phí", ""]}
          className="bg-gray-100"
        />
        <TableBody isLoading={isLoading}>
          {classes.map((c, i) => (
            <TableRow key={i}>
              <TableCell className="w-20">{i + 1}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.course.name}</TableCell>
              <TableCell>{c.grade.name}</TableCell>
              <TableCell>{c.room.name}</TableCell>
              <TableCell>{c.fee} VNĐ</TableCell>
              <TableCell className="p-0 w-5 flex items-center justify-center space-x-2 px-2 py-3">
                {/* Nút xem lớp */}
                <Button
                  onClick={() =>
                    router.push(`/clerk/classes/${c.id}/class-management`)
                  }
                  type="button"
                  variant="outlined"
                  className="p-2 "
                >
                  <Eye size={20} />
                </Button>

                {/* Nút duyệt thẳng vào lớp */}
                <Button
                  onClick={() => handleOpenModal(c.id)}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={(page) => handlePageClick(page)}
        handlePreviousPage={handlePrevClick}
        handleNextPage={handleNextClick}
      />
      {isModalOpen && (
        <ClassRegisterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          classId={selectedClassId}
        />
      )}
    </div>
  );
}
