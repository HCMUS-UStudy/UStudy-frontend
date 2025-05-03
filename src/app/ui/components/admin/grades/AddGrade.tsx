"use client";
import React, { useState } from "react";
import { Button } from "../../_common/Button";
import AddGradeModal from "./AddGradeModal";

export default function AddGrade() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="pl-6 pr-6">
        Tạo khối học
      </Button>
      {isOpen && (
        <AddGradeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
