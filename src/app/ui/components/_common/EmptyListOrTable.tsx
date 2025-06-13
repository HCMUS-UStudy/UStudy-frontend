"use client";
import dynamic from "next/dynamic";
import React from "react";
import xIconAnimation from "@/app/ui/lotties/xIcon.json";

export interface EmptyListOrTableProps {
  /**
   * Nội dung văn bản hiển thị khi danh sách trống.
   * @default "Không có dữ liệu"
   */
  message?: string;
}

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/**
 * `EmptyListOrTable` hiển thị một thông báo trung tính khi danh sách hoặc bảng không có dữ liệu.
 *
 * @param {EmptyListOrTableProps} props - Các props tuỳ chỉnh hiển thị thông báo trống.
 * @returns {JSX.Element} Component hiển thị trạng thái danh sách trống.
 *
 * @example
 * ```tsx
 * <EmptyListOrTable message="Không có lớp học nào" />
 * ```
 */
export default function EmptyListOrTable({
  message = "Không có dữ liệu",
}: EmptyListOrTableProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-primary-lighter border border-dashed border-primary-darkest p-6 rounded-xl shadow-sm">
      <Lottie
        className="size-20 md:size-24"
        animationData={xIconAnimation}
        loop={false}
      />
      <p className="text-primary-darkest text-sm md:text-lg font-medium">
        {message}
      </p>
    </div>
  );
}
