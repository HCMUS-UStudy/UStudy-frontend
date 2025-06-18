"use client";

import { Input } from "../../_common/text-field/Input";
import { Button } from "../../_common/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../_common/Dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, updateSession } from "@/app/lib/services/session";
import { toast } from "react-toastify";
import { Session } from "@/app/types";

const CreateSessionSchema = z
  .object({
    name: z.string().min(1, "Đây là trường bắt buộc"),
    startTime: z.string().min(1, "Đây là trường bắt buộc"),
    endTime: z.string().min(1, "Đây là trường bắt buộc"),
  })
  .refine(
    (data) => {
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      return startTotalMinutes < endTotalMinutes;
    },
    {
      message: "Thời gian bắt đầu phải trước thời gian kết thúc",
      path: ["endTime"],
    },
  );

export type CreateSessionInputs = z.infer<typeof CreateSessionSchema>;

const SessionModal = ({
  isOpen,
  onClose,
  selectedSession,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedSession?: Session;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateSessionInputs>({
    resolver: zodResolver(CreateSessionSchema),
    defaultValues: {
      name: selectedSession?.name || "",
      startTime: selectedSession?.startTime || "",
      endTime: selectedSession?.endTime || "",
    },
  });
  const onSubmit = (data: CreateSessionInputs) => {
    if (selectedSession) {
      return useUpdateSessionMutation.mutate({
        id: selectedSession.id,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
      });
    }
    return useCreateSessionMutation.mutate(data);
  };
  const queryClient = useQueryClient();
  const useCreateSessionMutation = useMutation({
    mutationFn: (data: CreateSessionInputs) => createSession(data),
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries({ queryKey: ["Sessions"] });
      toast.success("Tạo ca học mới thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      onClose();
    },
    onError: () => {
      toast.error("Tạo ca học thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
  });
  const useUpdateSessionMutation = useMutation({
    mutationFn: (data: Session) => updateSession(data),
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries({ queryKey: ["Sessions"] });
      toast.success("Chỉnh sửa ca học mới thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      onClose();
    },
    onError: () => {
      toast.error("Chỉnh sửa ca học thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
  });
  return (
    <Dialog className="w-1/2 md:w-1/3" isOpen={isOpen} onClose={onClose}>
      <DialogHeader className="text-center">Tạo ca học mới</DialogHeader>
      <DialogContent>
        <form
          id="SessionForm"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            placeholder="Tên ca học"
            label="Tên ca học"
            isError={!!errors.name}
            errorMsg={errors.name?.message}
            {...register("name")}
          />
          <Input
            type="time"
            label="Thời gian bắt đầu"
            isError={!!errors.startTime}
            errorMsg={errors.startTime?.message}
            {...register("startTime")}
          />
          <Input
            type="time"
            label="Thời gian kết thúc"
            isError={!!errors.endTime}
            errorMsg={errors.endTime?.message}
            {...register("endTime")}
          />
        </form>
      </DialogContent>
      <DialogFooter>
        {selectedSession ? (
          <Button
            form="SessionForm"
            isPending={useUpdateSessionMutation.status === "pending"}
            className="w-full"
          >
            Cập nhật ca học
          </Button>
        ) : (
          <Button
            form="SessionForm"
            isPending={useCreateSessionMutation.status === "pending"}
            className="w-full"
          >
            Tạo ca học mới
          </Button>
        )}
      </DialogFooter>
    </Dialog>
    //   <div>
    //     <div
    //       onClick={handleCloseModal}
    //       className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
    //     >
    //       <div
    //         onClick={(e) => e.stopPropagation()}
    //         className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg"
    //       >
    //         <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
    //           Tạo chi nhánh mới
    //         </h3>
    //         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    //           <Input
    //             name="name"
    //             label="Tên ca học"
    //             placeholder="Tên ca học"
    //             value={session.name}
    //             onChange={handleInputChange}
    //             required
    //           />
    //           <Input
    //             name="startTime"
    //             label="Thời gian bắt đầu"
    //             placeholder="Thời gian bắt đầu"
    //             value={session.startTime}
    //             onChange={handleInputChange}
    //             required
    //           />
    //           <Input
    //             name="endTime"
    //             label="Thời gian kết thúc"
    //             placeholder="Thời gian kết thúc"
    //             value={session.endTime}
    //             onChange={handleInputChange}
    //             required
    //           />

    //           <div className="flex justify-end mt-2 gap-4">
    //             <Button
    //               type="button"
    //               className="bg-gray-200 hover:bg-gray-300 text-sm"
    //               onClick={handleCloseModal}
    //             >
    //               Hủy
    //             </Button>
    //             <Button type="submit" className="text-sm">
    //               Thêm
    //             </Button>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // );
  );
};

export default SessionModal;
