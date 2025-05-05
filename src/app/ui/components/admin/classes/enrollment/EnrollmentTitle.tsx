import { ClassDetail } from "@/app/types";
import { ArrowRightCircle } from "lucide-react";
import React from "react";

export default function EnrollmentTitle({
  classDetail,
}: {
  classDetail?: ClassDetail;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border shadow bg-white">
      <div className="flex-shrink-0">
        <ArrowRightCircle size={30} className="text-primary-darker" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          {classDetail?.name || "Không có dữ liệu"} -{" "}
          {classDetail?.description || "Không có dữ liệu"}
        </h2>
      </div>
    </div>
  );
}
