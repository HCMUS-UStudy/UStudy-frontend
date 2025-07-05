"use client";

import React, { useState } from "react";
import Pagination from "@/app/ui/components/_common/Pagination";
import { getListClassToRegister } from "@/app/lib/services/class";
import { useSearchParams } from "next/navigation";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import RegisterClassesGrid from "../classes/RegisterClassesGrid";
import { Button } from "../../../_common/Button";
import StudentConfirmRegisterClass from "./StudentConfirmRegisterClass";
import { studentRegisterClass } from "@/app/lib/services/register-class";
import {
  ClassToRegisterItem,
  RegisterClassResponse,
} from "@/app/types/register-class";
import { submitOrderPayment } from "@/app/lib/services/payment";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "../../../_common/Dialog";
import { useCustomToast } from "@/app/lib/hooks/useToast";

interface ClassRegisterProps {
  searchQuery: string;
  classQuery?: string;
}

const RegisterClasses: React.FC<ClassRegisterProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const gradeQuery = searchParams?.get("gradeQuery") || "";
  const courseQuery = searchParams?.get("courseQuery") || "";
  const statusQuery = searchParams?.get("statusQuery") as
    | ""
    | "COMPLETED"
    | "PENDING"
    | "OVERDUE";
  const [confirmRegister, setConfirmRegsiter] = useState<boolean>(false);
  // const [registeringClassId, setRegisteringClassId] = useState<string | null>(
  //   null,
  // );
  const [paymentPendingId, setPaymentPendingId] = useState<string | null>(null);
  const [onConfirm, setOnConfirm] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<ClassToRegisterItem>();

  const [registrationSuccess, setRegistrationSuccess] =
    useState<RegisterClassResponse>();
  const queryClient = useQueryClient();
  const { addToast } = useCustomToast();

  const { data: classes, status } = useQuery({
    queryKey: [
      "Classes",
      currentPage - 1,
      searchQuery,
      courseQuery,
      gradeQuery,
      statusQuery,
    ],
    queryFn: () =>
      getListClassToRegister(
        searchQuery,
        currentPage - 1,
        6,
        courseQuery,
        gradeQuery,
        statusQuery,
      ),
    placeholderData: keepPreviousData,
  });

  // console.log(classes?.content);

  const registerClassMutation = useMutation({
    mutationFn: (classId: string) =>
      studentRegisterClass({
        classId,
      }),
    onError: () => {
      addToast.error("Đăng ký lớp học thất bại");
      // setRegisteringClassId(null);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Classes"] });
      setRegistrationSuccess(res);
      setConfirmRegsiter(true);
      // setRegisteringClassId(null);
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (paymentId: string) => submitOrderPayment(paymentId),
    onSuccess: (response) => {
      // Mở link thanh toán trong tab mới
      window.open(response, "_blank");
      queryClient.invalidateQueries({ queryKey: ["Classes"] });
      setPaymentPendingId(null);
    },
    onError: (error) => {
      addToast.error(error.message);
      setPaymentPendingId(null);
    },
  });

  const handleRegisterClass = (selectedClass: ClassToRegisterItem) => {
    // setRegisteringClassId(selectedClass.classDto.id);
    setSelectedClass(selectedClass);
    setOnConfirm(true);
    // registerClassMutation.mutate(selectedClass.classDto.id);
  };

  const handlePayment = (classItem: ClassToRegisterItem) => {
    console.log(classItem);
    setPaymentPendingId(classItem.classDto.id);
    paymentMutation.mutate(classItem.payment.id);
  };

  return (
    <div>
      <RegisterClassesGrid
        status={status}
        classes={classes}
        renderAction={(item) => (
          <Button
            onClick={() => handleRegisterClass(item)}
            // isPending={registeringClassId === item.classDto.id}
          >
            Đăng ký học
          </Button>
        )}
        onPaymentClick={handlePayment}
        paymentPendingId={paymentPendingId}
      />
      {classes?.totalElements !== 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={classes?.totalPages || 1}
          handlePageClick={(page) => setCurrentPage(page)}
          handlePreviousPage={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          handleNextPage={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, classes?.totalPages || 1),
            )
          }
        />
      )}
      <StudentConfirmRegisterClass
        isOpen={confirmRegister}
        onClose={() => {
          setConfirmRegsiter(false);
          setRegistrationSuccess(undefined);
        }}
        selectedClass={registrationSuccess}
      />
      <Dialog isOpen={onConfirm} onClose={() => setOnConfirm(false)}>
        <DialogHeader>Xác nhận đăng ký lớp học</DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-primary-darkest">
              Bạn có chắc chắn muốn đăng ký lớp học này không?
            </p>
            {selectedClass && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">
                  {selectedClass.classDto.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Mô tả: {selectedClass.classDto.description}
                </p>
                <p className="text-sm text-gray-600">
                  Khóa học: {selectedClass.classDto.course.name}
                </p>
                <p className="text-sm text-gray-600">
                  Khối: {selectedClass.classDto.grade.name}
                </p>
                <p className="text-sm text-gray-600">
                  Thời gian:{" "}
                  {new Date(
                    selectedClass.classDto.startDate,
                  ).toLocaleDateString("vi-VN")}{" "}
                  -{" "}
                  {new Date(selectedClass.classDto.endDate).toLocaleDateString(
                    "vi-VN",
                  )}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogFooter>
          <div className="flex justify-end gap-3">
            <Button variant="basic" onClick={() => setOnConfirm(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (selectedClass) {
                  registerClassMutation.mutate(selectedClass.classDto.id);
                  setOnConfirm(false);
                }
              }}
              isPending={registerClassMutation.isPending}
            >
              Xác nhận
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default RegisterClasses;
