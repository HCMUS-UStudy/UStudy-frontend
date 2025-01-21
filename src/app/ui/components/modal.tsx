import clsx from "clsx";
import { XIcon } from "lucide-react";
import React from "react";

interface ModalCreateClassProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  modalName?: string;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: ModalCreateClassProps) {
  return (
    <div
      // onClick={onClose}
      id="modal-create-class"
      className={clsx(
        {
          'opacity-0 scale-0': !isOpen,
          "opacity-100 scale-100": isOpen,
        },
        `fixed inset-0 flex justify-center items-center transition-colors duration-200  bg-black/20`
      )}>
      <div
        onClick={(e: React.FormEvent) => {
          e.stopPropagation();
        }}
        id="main-content"
        className={`relative bg-white rounded-xl scale-100 opacity-100 ${className}`}>
        {children}
        <XIcon className="size-8 absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" onClick={onClose} />
      </div>
    </div>
  );
}
