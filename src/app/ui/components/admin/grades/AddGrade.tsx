"use client";
import React, { useState } from "react";
import { Button } from "../../_common/Button";
import AddGradeModal from "./AddGradeModal";

export default function AddGrade() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto pl-6 pr-6"
      >
        Tạo khối học
      </Button>
      <AddGradeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
