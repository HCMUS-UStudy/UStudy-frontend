import clsx from "clsx";
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
      onClick={onClose}
      id="modal-create-class"
      className={clsx(
        {
          invisible: !isOpen,
          "visible bg-black/20": isOpen,
        },
        `fixed inset-0 flex justify-center items-center transition-colors duration-200`
      )}>
      <div
        onClick={(e: React.FormEvent) => {
          e.stopPropagation();
        }}
        id="main-content"
        className={`w-[30vw] h-fit bg-white rounded-xl scale-100 opacity-100 ${className}`}>
        {children}
      </div>
    </div>
  );
}
