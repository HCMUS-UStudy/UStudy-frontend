"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../_common/Table";
import Pagination from "../../_common/Pagination";
import { usePathname, useRouter } from "next/navigation";
import { getListMembers } from "@/app/lib/services/class";
import { MemberItem } from "@/app/types";

export default function ClassMembers({
  classId,
  query,
  currentPage,
}: {
  classId: string;
  query: string;
  currentPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [totalPages, setTotalPages] = useState<number>(0);
  const nextPage = () => {
    if (currentPage < totalPages) {
      currentPage++;
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      currentPage--;
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
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await getListMembers(classId, query, 0, 10, "STUDENT");
        console.log(response);
        setMembers(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
    return;
  }, [classId, query]);
  return (
    <div>
      <Table>
        <TableHeader
          columns={["GenId", "Họ tên", "Email", "Giới tính", "Hành động"]}
        />
        <TableBody isLoading={loading}>
          {members.map((member, index) => (
            <TableRow key={index}>
              <TableCell>{member.genId}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                {member.gender === "FEMALE"
                  ? "Nữ"
                  : member.gender === "MALE"
                    ? "Nam"
                    : "Khác"}
              </TableCell>
              <TableCell>chat</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={nextPage}
        handlePreviousPage={prevPage}
        handlePageClick={(page) => handlePageClick(page)}
      />
    </div>
  );
}
