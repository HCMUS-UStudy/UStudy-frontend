import { cn } from "@/app/lib/utils";
import clsx from "clsx";
import React from "react";
import { FaChevronDown } from "react-icons/fa6";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  isPending?: boolean;
  placeholder?: string;
  nameForInput?: string;
  dataToSend?: string;
  isError?: boolean;
  variant?: "basic" | "primary";
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type,
  variant = "primary",
  className,
  disabled = false,
  isPending,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        {
          "": !disabled,
          "cursor-progress": isPending,
          "cursor-pointer": !isPending,
        },
        variant === "primary" && `${className} relative flex items-center justify-center group px-8 py-2.5 bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-800 bg-[length:200%] bg-[0%_100%] hover:bg-[100%_0%] transition-all duration-200 text-blue-50 font-bold rounded-xl`,
        "disabled:opacity-50",
        // variant === "basic" && `${className} flex items-center justify-center rounded-md px-3 py-2.5 transition duration-200 ease-in-out cursor-pointer text-blue-50 font-bold bg-blue-600 hover:bg-blue-800`,
      )}
      {...props}>
      {children}
    </button>
  );
};

const SelectingButton: React.FC<ButtonProps> = ({
  onClick,
  placeholder,
  nameForInput,
  className,
  disabled,
  isError,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        {
          "bg-gray-400 cursor-not-allowed": disabled,
          "bg-white hover:bg-gray-200": !disabled,
        },
        {
          "border-error": isError,
          "border-gray-400": !isError,
        },
        `${className} w-[10vw] flex justify-between items-center text-sm  border-2 px-2.5 py-1.5 rounded-lg transition-colors`
      )}>
      <span className="">{placeholder}</span>
      {!disabled && <FaChevronDown />}
      <input
        type="text"
        name={nameForInput}
        value={placeholder}
        readOnly
        className="hidden"
      />
    </button>
  );
};

export { Button, SelectingButton };
