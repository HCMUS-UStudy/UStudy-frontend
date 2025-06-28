"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/ui/components/_common/Table";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import Checkbox from "@/app/ui/components/_common/Checkbox";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { Button } from "@/app/ui/components/_common/Button";
import { getFreeUsers } from "@/app/lib/services/user";
import { AccountItem } from "@/app/types";
import { addMembers } from "@/app/lib/services/class";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "@/app/ui/components/_common/loading/Loading";

export default function MemberList({
  onClose,
  role,
}: {
  onClose: () => void;
  role: string;
}) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [members, setMembers] = useState<AccountItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const searchParams = useSearchParams();
  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: memberList } = useQuery({
    queryKey: [
      "ListMembersToAdd",
      role,
      currentPage,
      searchParams?.get("AccountName") ?? "",
    ],
    refetchOnWindowFocus: false,
    queryFn: () => getFreeUsers(classId as string, 10, role, currentPage),
  });

  useEffect(() => {
    if (memberList) {
      if (currentPage === 0) {
        setMembers(memberList.content); // Nếu là trang đầu tiên, thay thế danh sách
      } else {
        setMembers((prev) => [...prev, ...memberList.content]); // Nếu không, thêm vào danh sách hiện tại
      }
    }
  }, [memberList, currentPage]);

  const handleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Infinite scroll: load more when scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el || isLoadingMore) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        if (memberList?.totalPages && currentPage < memberList.totalPages - 1) {
          setIsLoadingMore(true);
          setCurrentPage((prev) => prev + 1);
          setIsLoadingMore(false);
        }
      }
    };
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [memberList, currentPage, isLoadingMore]);

  const selectedMembers = members.filter((member) =>
    selectedIds.includes(member.id),
  );

  const unselectedMembers = members.filter(
    (member) => !selectedIds.includes(member.id),
  );

  const filteredUnselectedMembers = unselectedMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      member.genId.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const useAddMembersMutation = useMutation({
    mutationFn: (ids: string[]) => addMembers(ids, classId, "STUDENT"),
    onSuccess: () => {
      toast.success("Thêm thành công", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["ListMembers", currentPage] });
      queryClient.invalidateQueries({ queryKey: ["ListMembersToAdd"] });
    },
    onError: () => {
      toast.error("Thêm thất bại", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
    },
  });

  const handleAddMembers = () => {
    if (selectedIds.length > 0) {
      useAddMembersMutation.mutate(selectedIds);
    }
  };

  return (
    <div className="px-2">
      <div className="flex justify-between mb-3">
        <div className="flex gap-3 w-1/3">
          <SearchField
            queryKey="AccountName"
            placeholder="Tìm id hoặc tên..."
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className={`${selectedIds.length > 0 ? "flex" : "hidden"}`}>
          <Button
            variant="primary"
            className="w-fit py-1"
            onClick={handleAddMembers}
          >
            Thêm
          </Button>
        </div>
      </div>

      <div
        className="flex flex-col overflow-y-scroll max-h-[420px] min-h-[200px] border border-gray-200 rounded-md bg-white"
        ref={scrollRef}
        style={{ scrollbarGutter: "stable" }}
      >
        <Table>
          <TableHeader
            columns={[
              "GenId",
              "Tên",
              "Email",
              "Địa chỉ",
              "Ngày sinh",
              "Số điện thoại",
              "Giới tính",
              "Chọn",
            ]}
          />
          <TableBody noDataMessage={false}>
            {[...selectedMembers, ...filteredUnselectedMembers].map(
              (member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.genId}</TableCell>
                  <TableCell>
                    {member.name.length > 18 ? (
                      <button>
                        <Tooltip text={member.name}>
                          {member.name.slice(0, 18)}...
                        </Tooltip>
                      </button>
                    ) : (
                      member.name
                    )}
                  </TableCell>
                  <TableCell>
                    {member.email.length > 25 ? (
                      <button>
                        <Tooltip text={member.email}>
                          {member.email.slice(0, 25)}...
                        </Tooltip>
                      </button>
                    ) : (
                      member.email
                    )}
                  </TableCell>
                  <TableCell>
                    {member.address.length > 30 ? (
                      <button>
                        <Tooltip text={member.address}>
                          {member.address.slice(0, 30)}...
                        </Tooltip>
                      </button>
                    ) : (
                      member.address
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(member.birthday).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    {member.gender === "MALE" ? "Nam" : "Nữ"}
                  </TableCell>
                  <TableCell className="pl-7">
                    <Checkbox
                      className="w-5 h-5"
                      tickClassName="w-3 h-3"
                      checked={selectedIds.includes(member.id)}
                      onChange={() => handleSelection(member.id)}
                    />
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <Loading customStyle={{ spinner: "w-6 h-6" }} />
          </div>
        )}
      </div>
    </div>
  );
}
