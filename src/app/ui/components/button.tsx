import clsx from "clsx";
import React from "react";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  isPending?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type,
  className,
  disabled = false,
  isPending,
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
      )}>
      {children}
    </button>
  );
};

export default Button;
