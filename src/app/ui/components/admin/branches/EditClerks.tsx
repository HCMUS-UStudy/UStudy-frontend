import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../_common/Dialog";
import { SearchField } from "../../_common/text-field";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getListAvailableAdmins, updateAdmins } from "@/app/lib/services";
import { FaEdit } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Loading } from "../../_common/loading";
import SmallCheckbox from "../../_common/SmallCheckbox";
import { UserSummaryWithRole } from "@/app/types";
import { Button } from "../../_common/Button";
import { useCustomToast } from "@/app/lib/hooks/useToast";

function EditClerks() {
  const pathname = usePathname();
  const branchId = pathname?.split("/")[3] || "";
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [admins, setAdmins] = useState<
    (UserSummaryWithRole & { isSelected: boolean })[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { addToast } = useCustomToast();

  const filteredAdmins = useMemo(() => {
    return admins.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [admins, searchTerm]);

  const selectedAdmins = useMemo(() => {
    return admins.filter((item) => item.isSelected === true);
  }, [admins]);

  const { data, status } = useQuery({
    queryKey: ["AvailableAdmins", branchId],
    queryFn: () => getListAvailableAdmins(branchId),
    enabled: isOpen === true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (status === "success") {
      setAdmins(data.map((item) => ({ ...item, isSelected: false })));
    } else {
      setAdmins([]);
    }
  }, [data]);

  const onSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const queryClient = useQueryClient();

  const updateAdminsMutation = useMutation({
    mutationFn: ({
      branchId,
      clerkIds,
    }: {
      branchId: string;
      clerkIds: string[];
    }) => updateAdmins(branchId, clerkIds),
    onError: () => {
      addToast.error("Điều chỉnh giáo vụ thất bại");
    },
    onSuccess: () => {
      addToast.success("Điều chỉnh giáo vụ thành công");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["Admins"] });
      queryClient.invalidateQueries({ queryKey: ["AvailableAdmins"] });
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
        className="w-1/3 "
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <DialogHeader>Chỉnh sửa giáo vụ</DialogHeader>
        <DialogContent className="h-full">
          <SearchField
            placeholder="Tìm kiếm giáo vụ..."
            onSearch={(searchTerm) => onSearch(searchTerm)}
            debouncedTime={0}
            queryWithSearchParams={false}
          />

          <div className="mt-5">
            <div className="flex gap-2 items-center text-gray-700 text-sm font-bold">
              Các giáo vụ hiện có{" "}
              {status === "pending" && <Loading className="size-6" />}
            </div>
            {admins?.length === 0 && status === "success" ? (
              <div className="mt-5 px-2 py-1 text-center text-xs md:text-[13px] text-error border-error border rounded bg-error/10">
                Không có giáo vụ nào có thể phân công
              </div>
            ) : (
              <>
                {status === "success" && (
                  <div className="flex flex-col gap-2 mt-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
                    {filteredAdmins.length === 0 ? (
                      <div className="text-sm text-primary-darkest">
                        Không có dữ liệu
                      </div>
                    ) : (
                      <>
                        {filteredAdmins?.map((item) => (
                          <SmallCheckbox
                            key={item.id}
                            type="checkbox"
                            value={item.id}
                            checked={item.isSelected}
                            className="truncate"
                            onChange={(val) => {
                              setAdmins((prev) => {
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
                            labelText={`${item.name} - ${item.email}`}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {selectedAdmins.length !== 0 && (
            <div className="mt-5">
              <div className="flex gap-2 justify-between items-center text-gray-700 text-sm font-bold">
                <div>Các giáo vụ được chọn </div>
                <div
                  className="text-red-600 bg-red-100 hover:bg-red-200 text-xs p-1 rounded-lg border border-red-200 font-normal cursor-pointer transition-all"
                  onClick={() => {
                    setAdmins((prev) =>
                      prev.map((item) => ({
                        ...item,
                        isSelected: false,
                      })),
                    );
                  }}
                >
                  Bỏ chọn tất cả
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAdmins.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-slate-700 bg-slate-100 border-2 border-slate-200 p-1 rounded-lg hover:line-through transition-all cursor-pointer"
                    onClick={() => {
                      setAdmins((prev) =>
                        prev.map((admin) =>
                          admin.id === item.id
                            ? { ...admin, isSelected: false }
                            : admin,
                        ),
                      );
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogFooter className="flex">
          <Button
            className="w-full"
            onClick={() => {
              updateAdminsMutation.mutate({
                branchId,
                clerkIds: selectedAdmins.map((item) => item.id),
              });
            }}
            isPending={updateAdminsMutation.status === "pending"}
            disabled={selectedAdmins.length === 0}
          >
            Thêm giáo vụ
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default memo(EditClerks);
