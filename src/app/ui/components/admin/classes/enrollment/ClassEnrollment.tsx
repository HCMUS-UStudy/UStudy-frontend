import React, { useState } from "react";
import { Button } from "../../../_common/Button";
import { ArrowRightCircle } from "lucide-react";
import ClassEnrollmentModal from "./ClassEnrollmentModal";

export default function ClassEnrollment({ classId }: { classId: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        type="button"
        variant="outlined"
        className="p-2"
      >
        <ArrowRightCircle size={20} />
      </Button>
      <ClassEnrollmentModal
        classId={classId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
