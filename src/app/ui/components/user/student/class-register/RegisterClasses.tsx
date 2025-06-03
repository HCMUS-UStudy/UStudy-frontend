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
import { toast } from "react-toastify";
import {
  ClassToRegisterItem,
  RegisterClassResponse,
} from "@/app/types/register-class";
import { submitOrderPayment } from "@/app/lib/services/payment";

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
  const [registeringClassId, setRegisteringClassId] = useState<string | null>(
    null,
  );
  const [paymentPendingId, setPaymentPendingId] = useState<string | null>(null);

  const [registrationSuccess, setRegistrationSuccess] =
    useState<RegisterClassResponse>();

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

  const queryClient = useQueryClient();

  const registerClassMutation = useMutation({
    mutationFn: (classId: string) =>
      studentRegisterClass({
        classId,
      }),
    onError: () => {
      toast.error("Đăng ký lớp học thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      setRegisteringClassId(null);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Classes"] });
      setRegistrationSuccess(res);
      setConfirmRegsiter(true);
      setRegisteringClassId(null);
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
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      setPaymentPendingId(null);
    },
  });

  const handleRegisterClass = (selectedClass: ClassToRegisterItem) => {
    setRegisteringClassId(selectedClass.classDto.id);
    registerClassMutation.mutate(selectedClass.classDto.id);
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
            isPending={registeringClassId === item.classDto.id}
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
    </div>
  );
};

export default RegisterClasses;
