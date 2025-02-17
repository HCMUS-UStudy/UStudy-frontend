"use client";
import React from "react";
import { Button } from "../../_common/Button";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

export default function CreateClassButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("/clerk/classes/create");
      }}
      type="button"
      className="relative group w-[180px] bg-primary transition-all duration-200"
    >
      <span className="-translate-x-0 group-hover:-translate-x-4 transition-all duration-300">
        Thêm lớp học
      </span>
      <PlusIcon className="size-8 absolute translate-x-14 opacity-0 rotate-45 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" />
    </Button>
  );
}
