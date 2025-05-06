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
import { toast } from "react-toastify";

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
    .array(z.string().min(1, "Vui lòng chọn ít nhất 1 ca học cho chi nhánh"))
    .min(1, "Vui lòng chọn ít nhất 1 ca học cho chi nhánh"),
});

export type CreateBranchInputs = z.infer<typeof CreateBranchSchema>;

const CreateBranchModal = ({
  isOpen,
  onClose,
  // handleCloseModal,
  // handleModalInputChange,
  // handleSubmitModal,
  // newBranch,
  // setNewBranch, // Thêm prop để cập nhật newBranch
}: {
  isOpen: boolean;
  onClose: () => void;
  // handleCloseModal: () => void;
  // handleModalInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // handleSubmitModal: (e: React.FormEvent) => void;
  // newBranch: {
  //   name: string;
  //   address: string;
  //   contactNumber: string;
  //   rooms: string;
  //   sessions: Session[];
  // };
  // setNewBranch: React.Dispatch<
  //   React.SetStateAction<{
  //     name: string;
  //     address: string;
  //     contactNumber: string;
  //     rooms: string;
  //     sessions: Session[];
  //   }>
  // >;
}) => {
  // const [sessions, setSessions] = useState<Session[]>([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateBranchInputs>({
    resolver: zodResolver(CreateBranchSchema),
  });

  // useEffect(() => {
  //   const fetchSessions = async () => {
  //     try {
  //       const response = await getSession(0, 100);
  //       response.data.sort((a: Session, b: Session) =>
  //         a.startTime.localeCompare(b.startTime),
  //       );
  //       setSessions(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch sessions:", error);
  //     }
  //   };
  //   fetchSessions();
  // }, []);

  const { data: sessions, status } = useQuery({
    queryKey: ["Sessions"],
    queryFn: () => getSession(0, 100),
  });

  // Hàm xử lý khi chọn/bỏ chọn session
  // const handleSessionChange = (session: Session) => {
  //   const isSelected = newBranch.sessions.some((s) => s.id === session.id);

  //   if (isSelected) {
  //     // Bỏ chọn session
  //     setNewBranch((prev) => ({
  //       ...prev,
  //       sessions: prev.sessions.filter((s) => s.id !== session.id),
  //     }));
  //   } else {
  //     // Thêm session được chọn
  //     setNewBranch((prev) => ({
  //       ...prev,
  //       sessions: [...prev.sessions, session],
  //     }));
  //   }
  // };
  const onSubmit = (data: CreateBranchInputs) => {
    console.log(data);
    useCreateBranchMutation.mutate(data);
  };
  const queryClient = useQueryClient();
  const useCreateBranchMutation = useMutation({
    mutationFn: (data: CreateBranchInputs) => addBranch(data),
    onError: (error) => {
      console.log(error);
      toast.error("Tạo chi nhánh thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
      toast.success("Tạo chi nhánh thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
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
              <div className="flex gap-2 items-center ml-2 text-gray-700">
                Ca học {status === "pending" && <Loading className="size-5" />}
              </div>
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
              <span className="text-[13px] text-error">
                {errors.sessions?.message}
              </span>
            </div>

            <Button
              isPending={useCreateBranchMutation.status === "pending"}
              type="submit"
              className=""
            >
              Thêm ca học
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* <div
        onClick={handleCloseModal}
        className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg"
        >
          <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
            Tạo chi nhánh mới
          </h3>
          <form onSubmit={handleSubmitModal} className="flex flex-col gap-4">
            <Input
              name="name"
              label="Tên chi nhánh"
              placeholder="Tên chi nhánh"
              value={newBranch.name}
              onChange={handleModalInputChange}
              required
            />
            <Input
              name="address"
              label="Địa chỉ"
              placeholder="Địa chỉ"
              value={newBranch.address}
              onChange={handleModalInputChange}
              required
            />
            <Input
              name="contactNumber"
              label="Số điện thoại"
              placeholder="Số điện thoại"
              value={newBranch.contactNumber}
              onChange={handleModalInputChange}
              required
            />
            <Input
              name="rooms"
              label="Số phòng học"
              placeholder="Số phòng học"
              value={newBranch.rooms}
              onChange={handleModalInputChange}
              required
            />

            <div>
              <div className="ml-2 text-sm text-gray-700">Ca học</div>
              <div className="mt-2 flex flex-col gap-2 max-h-40 overflow-y-auto border p-2 rounded-lg">
                {sessions.map((session) => (
                  <label key={session.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newBranch.sessions.some(
                        (s) => s.id === session.id,
                      )}
                      onChange={() => handleSessionChange(session)}
                      className="h-3 w-3"
                    />
                    <span className="text-gray-700 text-[15px]">
                      {session.name} ({session.startTime.slice(0, 5)} -{" "}
                      {session.endTime.slice(0, 5)})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-2 gap-4">
              <Button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-sm"
                onClick={handleCloseModal}
              >
                Hủy
              </Button>
              <Button type="submit" className="text-sm">
                Thêm
              </Button>
            </div>
          </form>
        </div>
      </div> */}
    </div>
  );
};

export default CreateBranchModal;
