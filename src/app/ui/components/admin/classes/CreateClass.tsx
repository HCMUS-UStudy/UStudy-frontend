"use client";
import React, { useState } from "react";
import { Button } from "../../_common/Button";
import { PlusIcon } from "lucide-react";
import Modal from "../../modal";
import CreateClassContent from "../../ClassManagement/CreateClass/createClassContent";

export default function CreateClass() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpenModal(true);
        }}
        type="button"
        className="relative group w-[180px] bg-primary transition-all duration-200"
      >
        <span className="-translate-x-0 group-hover:-translate-x-4 transition-all duration-300">
          Thêm lớp học
        </span>
        <PlusIcon className="size-8 absolute translate-x-14 opacity-0 rotate-45 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" />
      </Button>
      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        modalName="Tạo lớp học"
        className="w-[65vw] h-[62vh] p-6"
      >
        <div className="h-full">
          <h1 className="text-center font-bold text-lg mt-3">
            Tạo lớp học mới
          </h1>
          <div className="h-fit mt-3">
            <CreateClassContent />
          </div>
        </div>
      </Modal>
    </>
  );
}
