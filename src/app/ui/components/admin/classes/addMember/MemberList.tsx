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
import { getFreeUsers } from "@/app/lib/services";
import { AccountData } from "@/app/types";
import { addMembers } from "@/app/lib/services/class";
import { useParams } from "next/navigation";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { useCustomToast } from "@/app/lib/hooks/useToast";

export default function MemberList({
  onClose,
  role,
}: {
  onClose: () => void;
  role: string;
}) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [members, setMembers] = useState<AccountData[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const searchParams = useSearchParams();
  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToast } = useCustomToast();

  const { data: memberList, isLoading } = useQuery({
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
      console.log(memberList);
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
    selectedIds.includes(member.user.id),
  );

  const unselectedMembers = members.filter(
    (member) => !selectedIds.includes(member.user.id),
  );

  const filteredUnselectedMembers = unselectedMembers.filter(
    (member) =>
      member.user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      member.user.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const useAddMembersMutation = useMutation({
    mutationFn: (ids: string[]) =>
      addMembers(
        ids,
        classId,
        role as "STUDENT" | "PARENT" | "ADMIN" | "TEACHER",
      ),
    onSuccess: (res) => {
      console.log(res);
      if (res.data.failedCount > 0) {
        addToast.warning(res.message);
      } else {
        addToast.success(res.message);
      }
      queryClient.invalidateQueries({ queryKey: ["ListMembers"] });
      queryClient.invalidateQueries({ queryKey: ["ListMembersToAdd"] });
      onClose();
    },
    onError: () => {
      addToast.error("Thêm thất bại");
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
            isPending={useAddMembersMutation.status === "pending"}
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
            columns={["GenId", "Tên", "Email", "Trạng thái", "Chọn"]}
          />
          <TableBody isLoading={isLoading}>
            {[...selectedMembers, ...filteredUnselectedMembers].map(
              (member) => (
                <TableRow key={member.user.id}>
                  <TableCell>{member.user.genId}</TableCell>
                  <TableCell>
                    {member.user.name.length > 18 ? (
                      <button>
                        <Tooltip text={member.user.name}>
                          {member.user.name.slice(0, 18)}...
                        </Tooltip>
                      </button>
                    ) : (
                      member.user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {member.user.email.length > 25 ? (
                      <button>
                        <Tooltip text={member.user.email}>
                          {member.user.email.slice(0, 25)}...
                        </Tooltip>
                      </button>
                    ) : (
                      member.user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {member.isAvailable ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                        Chờ phân công
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                        Đã được phân công
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="pl-7">
                    <Checkbox
                      className="w-5 h-5"
                      disabled={member.isAvailable === false}
                      tickClassName="w-3 h-3"
                      checked={selectedIds.includes(member.user.id)}
                      onChange={() => handleSelection(member.user.id)}
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
