import React, { memo, useEffect, useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../_common/Dialog";
import { SearchField } from "../../_common/text-field";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession, updateSessions } from "@/app/lib/services";
import { Session } from "@/app/types";
import { Loading } from "../../_common/loading";
import SmallCheckbox from "../../_common/SmallCheckbox";
import { Button } from "../../_common/Button";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { usePathname } from "next/navigation";

type Props = {
  oldSessions: Session[];
};

function EditSessions({ oldSessions }: Props) {
  const pathname = usePathname();
  const branchId = pathname?.split("/")[3];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sessions, setSessions] = useState<
    (Session & { isSelected: boolean })[]
  >([]);

  const { addToast } = useCustomToast();

  const { data, status } = useQuery({
    queryKey: ["Sessions"],
    queryFn: () => getSession(0, 100),
    refetchOnWindowFocus: false,
    enabled: isOpen === true,
  });
  useEffect(() => {
    if (status === "success") {
      setSessions(
        data.content
          .filter(
            (item) => item.id && !oldSessions.some((old) => old.id === item.id),
          )
          .map((item) => ({ ...item, isSelected: false })),
      );
    } else {
      setSessions([]);
    }
  }, [data, status]);
  const filteredSessions = useMemo(() => {
    return sessions.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.startTime.includes(searchTerm.toLowerCase()) ||
        item.endTime.includes(searchTerm.toLowerCase()),
    );
  }, [sessions, searchTerm]);
  const onSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  const queryClient = useQueryClient();
  const handleUpdateSessionsMutation = useMutation({
    mutationFn: ({
      branchId,
      sessionIds,
    }: {
      branchId: string;
      sessionIds: string[];
    }) => updateSessions(branchId, sessionIds),
    onError: () => {
      addToast.error("Chỉnh sửa ca học thất bại");
    },
    onSuccess: () => {
      addToast.success("Chỉnh sửa ca học thành công");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["Sessions"] });
      queryClient.invalidateQueries({ queryKey: ["BranchDetail"] });
    },
  });

  return (
    <>
      <FaEdit
        className="text-primary-dark hover:text-primary-darker cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
      <Dialog
        className="w-1/3"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <DialogHeader>Chỉnh sửa ca học</DialogHeader>
        <DialogContent>
          <SearchField
            placeholder="Tìm kiếm ca học..."
            onSearch={(searchTerm) => onSearch(searchTerm)}
            debouncedTime={0}
            queryWithSearchParams={false}
          />

          <div className="mt-5">
            <div className="flex gap-2 items-center text-gray-700 text-sm font-bold">
              Các ca học hiện có{" "}
              {status === "pending" && <Loading className="size-6" />}
            </div>
            {sessions?.length === 0 && status === "success" ? (
              <div className="mt-5 px-2 py-1 text-center text-xs md:text-[13px] text-error border-error border rounded bg-error/10">
                Không có ca học nào có thể phân công
              </div>
            ) : (
              <>
                {status === "success" && (
                  <div className="flex flex-col gap-3 mt-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
                    {filteredSessions.length === 0 ? (
                      <div className="text-sm text-primary-darkest">
                        Không có dữ liệu
                      </div>
                    ) : (
                      <>
                        {filteredSessions?.map((item) => (
                          <SmallCheckbox
                            key={item.id}
                            type="checkbox"
                            value={item.id}
                            checked={item.isSelected}
                            className="truncate"
                            onChange={(val) => {
                              setSessions((prev) => {
                                return prev.map((item) => {
                                  const isSelected =
                                    item.id === val.target.value;
                                  if (isSelected) {
                                    return {
                                      ...item,
                                      isSelected: !item.isSelected,
                                    };
                                  } else {
                                    return item;
                                  }
                                });
                              });
                            }}
                            variant="icon"
                            labelText={`${item.name} - ${item.startTime} - ${item.endTime}`}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => {
              if (branchId) {
                const ids = sessions
                  .filter((item) => item.isSelected === true)
                  .map((item) => item.id);
                handleUpdateSessionsMutation.mutate({
                  branchId,
                  sessionIds: ids,
                });
              }
            }}
            isPending={handleUpdateSessionsMutation.status === "pending"}
          >
            Chỉnh sửa ca học
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default memo(EditSessions);
