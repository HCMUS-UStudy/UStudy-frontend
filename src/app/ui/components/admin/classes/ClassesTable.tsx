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
import {
  //  ArrowRight,
  Eye,
} from "lucide-react";
import { ClassData } from "@/app/types";
// import ClassEnrollmentModal from "./enrollment/ClassEnrollmentModal";
import Tooltip from "../../_common/Tooltip";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/store/store";
import Pagination from "../../_common/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClassesTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const params = useSearchParams();
  const query = params?.get("query") || "";
  const branchId =
    useAppSelector((state) => state.branch.selectedBranchId) || "";

  const {
    data: fetchClasses,
    status,
    error,
  } = useQuery<ClassData>({
    queryKey: ["Classes", query, currentPage, branchId],
    queryFn: () => getAllClasses(query, currentPage - 1, 5, branchId, "", ""),
    // enabled: mounted, // Only run query after component is mounted
  });
  const totalPages = fetchClasses?.totalPages || 0;
  const router = useRouter();

  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [selectedId, setSelectedId] = useState<string>("");

  // if (!mounted) {
  //   return (
  //     <div>
  //       <Table>
  //         <TableHeader
  //           columns={[
  //             "Tên lớp",
  //             "Môn học",
  //             "Khối",
  //             "Học phí",
  //             "Ngày bắt đầu",
  //             "Ngày kết thúc",
  //             "",
  //           ]}
  //         />
  //         <TableBody isLoading={true}>
  //           <TableRow>
  //             <TableCell colSpan={7}>
  //               <div className="bg-slate-200 h-3 my-1 rounded"></div>
  //             </TableCell>
  //           </TableRow>
  //         </TableBody>
  //       </Table>
  //     </div>
  //   );
  // }

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
            "Hành động",
          ]}
        />
        <TableBody isLoading={status === "pending"}>
          {fetchClasses?.content.map((c, i) => (
            <TableRow key={i}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.course.name}</TableCell>
              <TableCell>{c.grade.name}</TableCell>
              <TableCell>{c.fee} VNĐ</TableCell>
              <TableCell>{c.startDate}</TableCell>
              <TableCell>{c.endDate}</TableCell>
              <TableCell className="p-0 w-full flex items-center justify-start gap-2 px-10 py-3">
                <div
                  onClick={() => {
                    router.push(`/admin/classes/${c.id}`);
                  }}
                >
                  <Tooltip text="Xem lớp học">
                    <Eye className="size-6 text-primary-dark hover:text-primary-darkest cursor-pointer transition-all" />
                  </Tooltip>
                </div>
              </TableCell>
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
