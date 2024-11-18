import clsx from "clsx";
import React from "react";
import { FaChevronDown } from "react-icons/fa6";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  isPending?: boolean;
  placeholder?: string;
  nameForInput?: string;
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
          "hover:bg-sky-900": !disabled,
          "bg-sky-900 cursor-progress": isPending,
          "bg-button_primary cursor-pointer": !isPending,
        },
        `${className} flex items-center justify-center rounded-md px-3 py-2.5 bg-button_primary transition duration-200 ease-in-out cursor-pointer text-white font-bold`
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
        `${className} w-[10vw] flex justify-between items-center text-sm border-gray-400 border-2 px-2.5 py-1.5 rounded-lg  transition-colors`
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
