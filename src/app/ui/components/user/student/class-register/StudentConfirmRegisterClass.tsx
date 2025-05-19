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

export default function StudentConfirmRegisterClass({
  isOpen,
  onClose,
  selectedClass,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedClass?: RegisterClassResponse;
}) {
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
          </div>
        </div>
      </DialogContent>
      <DialogFooter className="flex justify-end gap-3 text-sm">
        <Button variant="primary" onClick={onClose}>
          Thanh toán ngay
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
