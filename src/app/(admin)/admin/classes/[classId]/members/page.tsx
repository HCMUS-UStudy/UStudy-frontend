"use client";

import AddMember from "@/app/ui/components/admin/classes/addMember/AddMember";
import { getListMembers, removeMembers } from "@/app/lib/services/class";
import { useState, useEffect, useCallback } from "react";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/ui/components/_common/loading/Loading";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/ui/components/_common/Table";
import { useParams } from "next/navigation";
import Pagination from "@/app/ui/components/_common/Pagination";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import DeletePopup from "@/app/ui/components/_common/DeletePopup";

const MemberPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const searchParams = useSearchParams();
  const params = useParams();
  const classId = params?.classId as string;

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const memberQuery = useQuery({
    queryKey: ["ListMembers", currentPage],
    refetchOnWindowFocus: false,
    queryFn: () =>
      getListMembers(
        classId,
        searchParams?.get("AccountName") ?? "",
        currentPage,
        12,
      ),
  });

  const members = memberQuery.data;
  const isLoading = memberQuery.isLoading;
  const memberListWithRole = members?.content?.map((member) => ({
    ...member,
    role: member.genId.startsWith("0")
      ? "Giáo vụ"
      : member.genId.startsWith("1")
        ? "Giáo viên"
        : "Học sinh",
  }));

  useEffect(() => {
    if (members) {
      setTotalPages(members.totalPages);
    }
  }, [members]);

  const [deletePopup, setDeletePopup] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<{
    role: string;
    memberId: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const removeFunction = useMutation({
    mutationFn: async ({
      classId,
      memberRemove,
    }: {
      classId: string;
      memberRemove: string[];
    }) => {
      return removeMembers(classId, memberRemove);
    },
    onSuccess: () => {
      toast.success("Xóa thành viên thành công", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      queryClient.invalidateQueries({ queryKey: ["ListMembers", currentPage] });
    },
    onError: () => {
      toast.error("Xóa thành viên thất bại", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
    },
  });

  const handleRemoveMember = useCallback(
    (role: string, memberId: string) => {
      removeFunction.mutate({
        classId,
        memberRemove: [memberId],
      });
    },
    [classId, removeFunction],
  );

  return (
    <div className="flex flex-col gap-5 px-4 mt-4">
      <div className="flex justify-between gap-10">
        <div className="flex w-1/3">
          <SearchField
            queryKey="AccountName"
            placeholder="Tìm tên thành viên..."
          />
        </div>
        <AddMember buttonLabel="Thêm thành viên" />
      </div>

      {isLoading ? (
        <div className="mt-5">
          <Loading />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader
              columns={[
                "GenId",
                "Tên",
                ...(!isMobile ? ["Email"] : []),
                "Ngày sinh",
                "Giới tính",
                "Vai trò",
                "",
              ]}
            />
            <TableBody noDataMessage={false}>
              {memberListWithRole?.map((member) => (
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
                  {!isMobile && (
                    <TableCell>
                      {member.email?.length > 25 ? (
                        <button>
                          <Tooltip text={member.email}>
                            {member.email.slice(0, 25)}...
                          </Tooltip>
                        </button>
                      ) : (
                        member.email
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {new Date(member.birthday).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {member.gender === "MALE" ? "Nam" : "Nữ"}
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell className="flex items-center">
                    {member.role !== "Giáo vụ" && (
                      <Tooltip text="Xóa thành viên">
                        <RiDeleteBin6Line
                          size={18}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => {
                            setSelectedMember({
                              role: member.role,
                              memberId: member.id,
                            });
                            setDeletePopup(true);
                          }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-2">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                handlePageClick={(page) => setCurrentPage(page - 1)}
                handlePreviousPage={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 0))
                }
                handleNextPage={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
              />
            )}
          </div>
        </>
      )}
      {deletePopup && selectedMember && (
        <DeletePopup
          onDelete={() => {
            handleRemoveMember(selectedMember.role, selectedMember.memberId);
            setDeletePopup(false);
            setSelectedMember(null);
          }}
          onCancel={() => {
            setDeletePopup(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
};

export default MemberPage;
