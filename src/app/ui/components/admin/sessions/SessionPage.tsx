"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteSession, getSession } from "@/app/lib/services/session";
import { Button } from "@/app/ui/components/_common/Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import SessionModal from "@/app/ui/components/admin/branches/SessionModal";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { useSearchParams } from "next/navigation";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import Pagination from "@/app/ui/components/_common/Pagination";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { Session } from "@/app/types";

const SessionManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(
    undefined,
  );

  const sessionFilter = useSearchParams()?.get("SessionFilter") ?? "";

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedSession(undefined);
    }
  }, [isModalOpen]);

  const { data: _sessions, status } = useQuery({
    queryKey: ["Sessions", currentPage - 1, sessionFilter],
    queryFn: () => getSession(currentPage - 1, 5, sessionFilter),
    placeholderData: keepPreviousData,
  });

  const sessions = useMemo(() => {
    return _sessions?.content
      ?.slice()
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [_sessions]);

  const handleDeleteSession = (sessionId: string) => {
    useDeleteSessionMutation.mutate(sessionId);
  };
  const queryClient = useQueryClient();
  const { addToast } = useCustomToast();
  const useDeleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => deleteSession(sessionId),
    onError: () => {
      addToast.error("Xóa ca học thất bại");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Sessions"] });
      addToast.success("Xóa ca học thành công");
    },
  });

  const handleUpdateSession = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg md:text-xl font-semibold">
            Tổng số ca học ({sessions?.length})
          </div>
          <Button className="" onClick={() => setIsModalOpen(true)}>
            Thêm ca học
          </Button>
        </div>
        <SearchField
          className="w-full"
          placeholder="Tìm ca học..."
          queryKey="SessionFilter"
        />
        <div className="overflow-x-auto rounded-lg mt-6">
          <Table>
            <TableHeader
              columns={[
                "Tên ca học",
                "Giờ bắt đầu",
                "Giờ kết thúc",
                "Hành động",
              ]}
            />
            <TableBody isLoading={status === "pending"}>
              {sessions?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.startTime.slice(0, 5)}</TableCell>
                  <TableCell>{item.endTime.slice(0, 5)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Tooltip text="Chỉnh sửa ca học">
                      <button
                        onClick={() => handleUpdateSession(item)}
                        className="text-blue-600 hover:text-blue-800 transition-all"
                      >
                        <FaEdit className="size-4 md:size-5" />
                      </button>
                    </Tooltip>
                    <Tooltip text="Xóa ca học">
                      <button
                        onClick={() => handleDeleteSession(item.id)}
                        className="text-red-600 hover:text-red-800 transition-all"
                      >
                        <FaTrashAlt className="size-4 md:size-5" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={_sessions?.totalPages || 1}
            handlePageClick={(page) => setCurrentPage(page)}
            handlePreviousPage={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            handleNextPage={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, _sessions?.totalPages || 1),
              )
            }
          />
        </div>
      </div>
      <SessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSession={selectedSession ?? undefined}
      />
    </>
  );
};

export default SessionManagement;
