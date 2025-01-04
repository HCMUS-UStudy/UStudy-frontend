import { cn } from "@/app/lib/utils";
import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import Loading from "@/app/ui/components/common/Loading";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  isPending?: boolean;
  placeholder?: string;
  nameForInput?: string;
  dataToSend?: string;
  isError?: boolean;
  errorMsg?: string | null;
  variant?: "basic" | "primary" | "outlined";
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
          "cursor-progress": isPending,
          "cursor-pointer": !isPending,
          "relative group bg-gradient-to-tr from-button-primary-dark via-button-primary to-button-primary-dark bg-[length:200%] bg-[0%_100%] hover:bg-[100%_0%] transition-all duration-200 text-white disabled:from-disabled-dark disabled:to-disabled-dark disabled:text-disabled-light":
            variant === "primary",
          // "flex items-center justify-center transition duration-200 ease-in-out text-gray-400 hover:text-gray-600":
          "transition duration-200 ease-in-out text-button-primary hover:bg-button-primary/10 disabled:text-disabled-dark disabled:hover:bg-transparent":
            variant === "basic",
          "tracking-widest hover:shadow-lg border-[1.5px] border-button-primary bg-transparent hover:bg-button-primary/10 text-button-primary hover:shadow-button-primary/20 transition-all duration-200 disabled:border-disabled-dark disabled:text-disabled-dark disabled:hover:bg-transparent disabled:hover:shadow-none":
            variant === "outlined",
        },
        "flex items-center justify-center w-fit font-bold px-3 py-2 rounded-md disabled:cursor-auto",
        className,
      )}
      {...props}
    >
      {isPending && (
        <Loading
          className="mr-2"
          customStyle={{
            spinner: "w-4 h-4 text-disabled-light",
          }}
        />
      )}
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
  errorMsg,
}) => {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        // className={clsx(
        //   {
        //     "bg-gray-400 cursor-not-allowed": disabled,
        //     "bg-white hover:bg-gray-200": !disabled,
        //   },
        //   {
        //     "border-error": isError,
        //     "border-gray-400": !isError,
        //   },
        //   `${className} w-[10vw] flex justify-between items-center text-sm  border-2 px-2.5 py-1.5 rounded-lg transition-colors`,
        // )}
        className={cn(
          "bg-transparent",
          {
            "border-control-border border": !isError,
            "border-error border-2": isError,
          },
          "flex justify-between items-center gap-2 w-full transition-colors rounded-md px-3 py-2 text-sm active:ring-2 active:ring-control-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0",
          className,
        )}
      >
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

      {isError && errorMsg && (
        <span className="text-[13px] text-error mt-2">{errorMsg}</span>
      )}
    </div>
  );
};

export { Button, SelectingButton };
