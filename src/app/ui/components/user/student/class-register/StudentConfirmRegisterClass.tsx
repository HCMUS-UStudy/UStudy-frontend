import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../../_common/Dialog";
import { Button } from "../../../_common/Button";
import { RegisterClassResponse } from "@/app/types/register-class";
import { CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitOrderPayment } from "@/app/lib/services/payment";
import { useCustomToast } from "@/app/lib/hooks/useToast";

export default function StudentConfirmRegisterClass({
  isOpen,
  onClose,
  selectedClass,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedClass?: RegisterClassResponse;
}) {
  const { addToast } = useCustomToast();
  const handlePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => submitOrderPayment(paymentId),
    onSuccess: (response) => {
      console.log(response);
      window.open(response, "_blank");
      // toast.success(response, {
      //   position: "bottom-right",
      //   autoClose: 3000,
      //   pauseOnHover: false,
      // });
      onClose();
    },
    onError: (error) => {
      addToast.error(error.message);
    },
  });
  const handlePayment = () => {
    if (selectedClass?.payment.id) {
      handlePaymentMutation.mutate(selectedClass?.payment.id);
    }
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>Thông tin đăng ký lớp học</DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Đăng ký thành công!</h3>
          </div>
          <div className="space-y-3 text-base text-zinc-700">
            <p>
              <strong>Học sinh:</strong> {selectedClass?.user.name}
            </p>
            <p>
              <strong>Tên lớp:</strong> {selectedClass?.aclass.name}
            </p>
            <p>
              <strong>Mô tả:</strong>{" "}
              {selectedClass?.aclass.description || "Không có"}
            </p>
            <p>
              <strong>Thời gian học:</strong>{" "}
              {new Date(
                selectedClass?.aclass.startDate ?? "",
              ).toLocaleDateString("vi-VN")}{" "}
              →{" "}
              {new Date(selectedClass?.aclass.endDate ?? "").toLocaleDateString(
                "vi-VN",
              )}
            </p>
            <p>
              <strong>Khối lớp:</strong> {selectedClass?.aclass.grade.name}
            </p>
            <p>
              <strong>Khóa học:</strong> {selectedClass?.aclass.course.name}
            </p>
            <p>
              <strong>Giáo viên:</strong>{" "}
              {selectedClass?.aclass.teacher?.length &&
              selectedClass?.aclass.teacher.length > 0
                ? selectedClass?.aclass.teacher
                    .map(
                      (t) =>
                        `${t.name} (${t.gender === "MALE" ? "Nam" : "Nữ"})`,
                    )
                    .join(", ")
                : "Chưa có giáo viên"}
            </p>
            <p className="text-sm text-primary-darkest">
              * Bạn có thể thanh toán sau
            </p>
          </div>
        </div>
      </DialogContent>
      <DialogFooter className="flex justify-end items-center gap-3 text-sm">
        <Button
          className="w-full"
          onClick={handlePayment}
          isPending={handlePaymentMutation.status === "pending"}
          variant="primary"
        >
          Thanh toán ngay
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
