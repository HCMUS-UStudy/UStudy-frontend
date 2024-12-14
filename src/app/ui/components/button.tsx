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
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type,
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
      className={clsx(
        {
          "": !disabled,
          "cursor-progress": isPending,
          "cursor-pointer": !isPending,
        },
        `${className} flex items-center justify-center rounded-md px-3 py-2.5 transition duration-200 ease-in-out cursor-pointer text-blue-50 font-bold`
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
        `${className} w-[10vw] flex justify-between items-center text-sm  border-2 px-2.5 py-1.5 rounded-lg  transition-colors`
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
