"use client";

import React from "react";
import RegisterClassesLoading from "../../../_common/loading/RegisterClassesLoading";
import EmptyListOrTable from "../../../_common/EmptyListOrTable";
import { ClassToRegisterItem, ClassToRegisterResponse } from "@/app/types";
import { SiGoogleclassroom } from "react-icons/si";
import { Button } from "../../../_common/Button";
import { CheckCircle, ChevronRight } from "lucide-react";
import { IoWarning } from "react-icons/io5";
// import { useMutation } from "@tanstack/react-query";
// import { submitOrderPayment } from "@/app/lib/services/payment";
// import { toast } from "react-toastify";

export interface Course {
  name?: string;
}

export interface Grade {
  name?: string;
}

export interface Teacher {
  name?: string;
}

export interface ClassListProps {
  status: "pending" | "success" | "error";
  classes?: ClassToRegisterResponse;
  onDetailClick?: (id: string) => void;
  renderAction?: (classItem: ClassToRegisterItem) => React.ReactNode;
  onPaymentClick?: (classItem: ClassToRegisterItem) => void;
  paymentPendingId: string | null;
}

const RegisterClassesGrid: React.FC<ClassListProps> = ({
  status,
  classes,
  renderAction,
  onPaymentClick,
  paymentPendingId,
}) => {
  // const handlePaymentMutation = useMutation({
  //   mutationFn: (paymentId: string) => submitOrderPayment(paymentId),
  //   onSuccess: (response) => {
  //     console.log(response);
  //     toast.success(response, {
  //       position: "bottom-right",
  //       autoClose: 3000,
  //       pauseOnHover: false,
  //     });
  //   },
  //   onError: (error) => {
  //     toast.error(error.message, {
  //       position: "bottom-right",
  //       autoClose: 3000,
  //       pauseOnHover: false,
  //     });
  //   },
  // });
  // const handlePayment = () => {
  //   handlePaymentMutation.mutate(selectedClass: ClassToReg);
  // };
  console.log(classes);
  if (status === "pending") {
    return <RegisterClassesLoading />;
  }

  if (classes?.totalElements && classes.totalElements > 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.content.map((classItem) => (
          <div
            key={classItem.classDto.id}
            className="relative overflow-hidden bg-white border-2 border-slate-200 flex flex-col justify-between gap-3 px-9 py-5 space-y-3 rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <div className="w-20 h-20 md:w-24 md:h-24 flex justify-center items-center bg-primary-dark rounded-full absolute -right-5 -top-7">
                <p className="absolute bottom-6 left-7 text-white text-base lg:text-2xl font-bold">
                  {classItem.classDto.grade.name.split(" ")[1] ?? "?"}
                </p>
              </div>
              {/* <div className="w-12 fill-primary-dark">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m24,6.928v13.072h-11.5v3h5v1H6.5v-1h5v-3H0V4.5c0-1.379,1.122-2.5,2.5-2.5h12.98c-.253.295-.54.631-.856,1H2.5c-.827,0-1.5.673-1.5,1.5v14.5h22v-10.993l1-1.079Zm-12.749,3.094C19.058.891,19.093.855,19.11.838c1.118-1.115,2.936-1.113,4.052.002,1.114,1.117,1.114,2.936,0,4.052l-8.185,8.828c-.116,1.826-1.623,3.281-3.478,3.281h-5.59l.097-.582c.043-.257,1.086-6.16,5.244-6.396Zm2.749,3.478c0-1.379-1.122-2.5-2.5-2.5-2.834,0-4.018,3.569-4.378,5h4.378c1.378,0,2.5-1.121,2.5-2.5Zm.814-1.073l2.066-2.229c-.332-1.186-1.371-2.057-2.606-2.172-.641.749-1.261,1.475-1.817,2.125,1.117.321,1.998,1.176,2.357,2.277Zm.208-5.276c1.162.313,2.125,1.134,2.617,2.229l4.803-5.18c.737-.741.737-1.925.012-2.653-.724-.725-1.908-.727-2.637,0-.069.08-2.435,2.846-4.795,5.606Z" />
                </svg>
              </div> */}
              <SiGoogleclassroom className="size-8 lg:size-12 text-primary-dark" />
              <h1 className="font-bold text-base lg:text-xl">
                {classItem.classDto.name} -{" "}
                {classItem.classDto.course?.name ?? "Không tên"} -{" "}
                {classItem.classDto.grade?.name ?? ""}
              </h1>
              <p className="text-sm text-zinc-500 leading-6 truncate">
                Lớp học thuộc khóa {classItem.classDto.course?.name}.{" "}
                {classItem.classDto.description}
              </p>
              {/* <p className="text-sm text-zinc-500 leading-6">
                {classItem.description}
              </p> */}
            </div>
            {/* {classItem.payment !== null ? (
              renderAction && renderAction(classItem)
            ) : classItem.payment.status === "PENDING" ? (
              <div className="flex flex-col gap-2">
                <Button
                  className="text-sm text-primary-darkest group relative overflow-hidden"
                  onClick={() => onPaymentClick?.(classItem)}
                  isPending={paymentPendingId === classItem.classDto.id}
                  variant="outlined"
                >
                  <div className="flex items-center gap-2">
                    <span className="absolute inset-0 flex items-center justify-center bg-white">
                      <p className="text-primary-darkest text-sm transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                        Thanh toán ngay
                      </p>
                    </span>
                    <span className="flex items-center gap-2">
                      <p className="text-primary-darkest text-sm transform translate-x-0 opacity-100 group-hover:-translate-x-full group-hover:opacity-0 transition-all duration-300 ease-in-out">
                        Đã đăng ký - Chờ thanh toán
                      </p>
                      <ChevronRight className="size-5 transform translate-x-0 group-hover:translate-x-5 transition-transform duration-300 ease-in-out" />
                    </span>
                  </div>
                </Button>
              </div>
            ) : classItem.payment.status === "COMPLETED" ? (
              <div className="flex gap-2 items-center text-green-600">
                <CheckCircle className="size-8" />
                <p className=" font-medium">Đã đăng ký thành công</p>
              </div>
            ) : classItem.payment.status === "OVERDUE" ? (
              <div className="flex gap-2 items-center text-error">
                <IoWarning className="size-8" />
                <p className=" font-medium">Quá hạn thanh toán</p>
              </div>
            ) : (
              renderAction && renderAction(classItem)
            )} */}
            {!classItem.payment ? (
              renderAction && renderAction(classItem)
            ) : classItem.payment.status === "PENDING" ? (
              <div className="flex flex-col gap-2">
                <Button
                  className="text-sm text-primary-darkest group relative overflow-hidden"
                  onClick={() => onPaymentClick?.(classItem)}
                  isPending={paymentPendingId === classItem.classDto.id}
                  variant="outlined"
                >
                  <div className="flex items-center gap-2">
                    <span className="absolute inset-0 flex items-center justify-center bg-white">
                      <p className="text-primary-darkest text-sm transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                        Thanh toán ngay
                      </p>
                    </span>
                    <span className="flex items-center gap-2">
                      <p className="text-primary-darkest text-sm transform translate-x-0 opacity-100 group-hover:-translate-x-full group-hover:opacity-0 transition-all duration-300 ease-in-out">
                        Đã đăng ký - Chờ thanh toán
                      </p>
                      <ChevronRight className="size-5 transform translate-x-0 group-hover:translate-x-5 transition-transform duration-300 ease-in-out" />
                    </span>
                  </div>
                </Button>
              </div>
            ) : classItem.payment.status === "COMPLETED" ? (
              <>
                <div className="flex gap-2 items-center text-green-600">
                  <CheckCircle className="size-8" />
                  <p className=" font-medium">Đã đăng ký thành công</p>
                </div>
              </>
            ) : (
              classItem.payment.status === "OVERDUE" && (
                <div className="flex gap-2 items-center text-error">
                  <IoWarning className="size-8" />
                  <p className=" font-medium">Quá hạn thanh toán</p>
                </div>
              )
            )}
            {/* {classItem.payment.status === "PENDING" ? (
              <div className="flex flex-col gap-2">
                <Button
                  className="text-sm text-primary-darkest group relative overflow-hidden"
                  onClick={() => onPaymentClick?.(classItem)}
                  isPending={paymentPendingId === classItem.classDto.id}
                  variant="outlined"
                >
                  <div className="flex items-center gap-2">
                    <span className="absolute inset-0 flex items-center justify-center bg-white">
                      <p className="text-primary-darkest text-sm transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                        Thanh toán ngay
                      </p>
                    </span>
                    <span className="flex items-center gap-2">
                      <p className="text-primary-darkest text-sm transform translate-x-0 opacity-100 group-hover:-translate-x-full group-hover:opacity-0 transition-all duration-300 ease-in-out">
                        Đã đăng ký - Chờ thanh toán
                      </p>
                      <ChevronRight className="size-5 transform translate-x-0 group-hover:translate-x-5 transition-transform duration-300 ease-in-out" />
                    </span>
                  </div>
                </Button>
              </div>
            ) : classItem.payment.status === "COMPLETED" ? (
              <div className="flex gap-2 items-center text-green-600">
                <CheckCircle className="size-8" />
                <p className=" font-medium">Đã đăng ký thành công</p>
              </div>
            ) : (
              classItem.payment.status === "OVERDUE" && (
                <div className="flex gap-2 items-center text-error">
                  <IoWarning className="size-8" />
                  <p className=" font-medium">Quá hạn thanh toán</p>
                </div>
              )
            )} */}
          </div>
        ))}
      </div>
    );
  }

  return <EmptyListOrTable message="Hiện đang không có lớp học" />;
};

export default RegisterClassesGrid;
