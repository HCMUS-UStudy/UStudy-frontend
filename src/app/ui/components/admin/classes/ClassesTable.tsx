"use client";
import React, {
  memo,
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
import ClassPagination from "./ClassPagination";
// import ClassEnrollmentModal from "./enrollment/ClassEnrollmentModal";
import Tooltip from "../../_common/Tooltip";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const MemoizedClassPagination = memo(ClassPagination);

export default function ClassesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: fetchClasses,
    status,
    error,
  } = useQuery<ClassData>({
    queryKey: ["Classes", query, currentPage],
    queryFn: () => getAllClasses(query, currentPage - 1, 5),
    placeholderData: (prevData) => prevData,
    enabled: mounted, // Only run query after component is mounted
  });

  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [selectedId, setSelectedId] = useState<string>("");

  if (!mounted) {
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
              "",
            ]}
          />
          <TableBody isLoading={true}>
            <TableRow>
              <TableCell colSpan={7}>
                <div className="bg-slate-200 h-3 my-1 rounded"></div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

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
            "",
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
              <TableCell className="p-0 w-10 flex items-center justify-center gap-2 px-2 py-3">
                {/* Nút xem lớp */}
                <div onClick={() => router.push(`/admin/classes/${c.id}`)}>
                  <Tooltip text="Xem lớp học">
                    <Eye className="size-6 text-primary-dark hover:text-primary-darkest cursor-pointer transition-all" />
                  </Tooltip>
                </div>
                {/* <ClassEnrollment classId={c.id} /> */}
                {/* <Tooltip text="Duyệt tài khoản">
                  <div
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedId(c.id);
                    }}
                  >
                    <ArrowRight className="size-6 text-primary-dark hover:text-primary-darkest cursor-pointer transition-all" />
                  </div>
                </Tooltip> */}
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
      {/* {isOpen && (
        <ClassEnrollmentModal
          classId={selectedId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )} */}
    </div>
  );
}
