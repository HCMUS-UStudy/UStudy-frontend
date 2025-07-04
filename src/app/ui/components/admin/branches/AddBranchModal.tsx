"use client";

import { Input } from "../../_common/text-field/Input";
import { Button } from "../../_common/Button";
import { getSession } from "@/app/lib/services/session";
import { Dialog, DialogContent, DialogHeader } from "../../_common/Dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SmallCheckbox from "../../_common/SmallCheckbox";
import Loading from "../../_common/loading/Loading";
import { addBranch } from "@/app/lib/services/branch";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const CreateBranchSchema = z.object({
  name: z.string().min(1, "Đây là trường bắt buộc"),
  address: z.string().min(1, "Đây là trường bắt buộc"),
  contactNumber: z
    .string({ message: "Đây là trường bắt buộc" })
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(9, "Số điện thoại từ 9 - 12 ký tự số")
    .max(12, "Số điện thoại từ 9 - 12 ký tự số"),
  rooms: z
    .number({ invalid_type_error: "Đây là trường bắt buộc" })
    .int("Đây là trường bắt buộc")
    .positive("Phải có ít nhất một phòng học"),
  sessions: z
    .array(
      z
        .string({ message: "Vui lòng chọn ít nhất 1 ca học" })
        .min(1, "Vui lòng chọn ít nhất 1 ca học"),
      { message: "Vui lòng chọn ít nhất 1 ca học" },
    )
    .min(1, "Vui lòng chọn ít nhất 1 ca học"),
});

export type CreateBranchInputs = z.infer<typeof CreateBranchSchema>;

const CreateBranchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateBranchInputs>({
    resolver: zodResolver(CreateBranchSchema),
  });

  const { addToast } = useCustomToast();

  const { data: sessions, status } = useQuery({
    queryKey: ["Sessions"],
    queryFn: () => getSession(0, 100),
  });
  console.log(sessions);

  const onSubmit = (data: CreateBranchInputs) => {
    console.log("here");
    if (sessions?.content.length === 0) {
      console.log("here");
      addToast.error("Chưa có ca học nào");
      return;
    }
    useCreateBranchMutation.mutate(data);
  };
  const queryClient = useQueryClient();
  const useCreateBranchMutation = useMutation({
    mutationFn: (data: CreateBranchInputs) => addBranch(data),
    onError: (error) => {
      console.log(error);
      addToast.error("Tạo chi nhánh thất bại");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
      addToast.success("Tạo chi nhánh thành công");
      onClose();
    },
  });

  return (
    <div>
      <Dialog isOpen={isOpen} onClose={onClose}>
        <DialogHeader className="text-center">Tạo chi nhánh mới</DialogHeader>
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              label="Tên chi nhánh"
              placeholder="Tên chi nhánh"
              isError={!!errors.name}
              errorMsg={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Địa chỉ"
              placeholder="Địa chỉ"
              isError={!!errors.address}
              errorMsg={errors.address?.message}
              {...register("address")}
            />
            <Input
              label="Số điện thoại"
              placeholder="Số điện thoại"
              isError={!!errors.contactNumber}
              errorMsg={errors.contactNumber?.message}
              {...register("contactNumber")}
            />
            <Input
              label="Số phòng học"
              placeholder="Số phòng học"
              type="number"
              isError={!!errors.rooms}
              errorMsg={errors.rooms?.message}
              {...register("rooms", {
                valueAsNumber: true,
              })}
            />
            {/* Phần chọn Ca học với checkbox */}
            <div>
              <div className="flex gap-2 items-center text-gray-700">
                Ca học {status === "pending" && <Loading className="size-6" />}
              </div>
              {sessions?.content.length === 0 ? (
                <div className="px-2 py-1 text-center text-xs md:text-[13px] text-error border-error border rounded bg-error/10">
                  Chưa có ca học nào
                </div>
              ) : (
                <>
                  {status === "success" && (
                    <div className="mt-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
                      {sessions.content.map((item) => (
                        <SmallCheckbox
                          key={item.id}
                          type="checkbox"
                          value={item.id}
                          className="truncate"
                          variant="label"
                          labelText={`${item.name} - ${item.startTime} - ${item.endTime}`}
                          {...register("sessions")}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <span className="text-[13px] text-error">
              {errors.sessions?.message}
            </span>

            <Button
              isPending={useCreateBranchMutation.status === "pending"}
              type="submit"
              className=""
            >
              Thêm chi nhánh
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBranchModal;
