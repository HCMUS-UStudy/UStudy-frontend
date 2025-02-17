import { cn } from "@/app/lib/utils";
import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import Loading from "@/app/ui/components/_common/Loading";

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

/**
 * Button component
 *
 * @param onClick - Function to handle button click
 * @param children - Button children
 * @param type - Button type
 * @param variant - Button variant "basic" | "primary" | "outlined" (default: primary)
 * @param className - Button classes name
 * @param disabled - Disable the button
 * @param isPending - Button is pending or not - Show loading spinner (default: false)
 * @param props - Other button props
 *
 * @example
 * ```tsx
 *  <Button
 *    variant="outlined"
 *    type="button"
 *    onClick={() => console.log("Button clicked")}
 *    disabled={false}
 *    className="w-1/2"
 *    isPending={false}
 *  >
 *    Click me
 *  </Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type,
  variant = "primary",
  className,
  disabled = false,
  isPending,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        {
          "cursor-progress": isPending,
          "cursor-pointer": !isPending,
          "relative group bg-primary hover:bg-hover-primary transition-all duration-200 text-black disabled:from-disabled-dark disabled:to-disabled-dark disabled:text-disabled-light":
            variant === "primary",
          // "flex items-center justify-center transition duration-200 ease-in-out text-gray-400 hover:text-gray-600":
          "transition duration-200 ease-in-out text-button-primary hover:bg-button-primary/10 disabled:text-disabled-dark disabled:hover:bg-transparent":
            variant === "basic",
          "tracking-widest hover:shadow-lg border-[1.5px] border-button-primary bg-transparent hover:bg-button-primary/10 text-button-primary hover:shadow-button-primary/20 transition-all duration-200 disabled:border-disabled-dark disabled:text-disabled-dark disabled:hover:bg-transparent disabled:hover:shadow-none":
            variant === "outlined",
        },
        "flex items-center justify-center font-medium px-3 py-2 rounded-lg disabled:cursor-auto",
        className,
      )}
      {...props}
    >
      {isPending && (
        <Loading
          className="mr-2"
          customStyle={{
            spinner: "w-4 h-4 text-primary-darkest",
          }}
        />
      )}
      {children}
    </button>
  );
};

/**
 * SelectingButton component
 *
 * This component is used to create a dropdown button to open a modal for selecting items.
 *
 * @param onClick
 * @param placeholder
 * @param nameForInput
 * @param className
 * @param disabled
 * @param isError
 * @param errorMsg
 *
 * @example
 * ```tsx
 *  <SelectingButton
 *    onClick={() => console.log("Open selecting modal")}
 *    placeholder="Select"
 *    nameForInput="select"
 *    className="w-1/2"
 *    disabled={false}
 *    isError={false}
 *    errorMsg="Error message"
 *  >
 *    Click me
 *  </SelectingButton>
 *  ```
 */
const SelectingButton = ({
  onClick,
  placeholder,
  nameForInput,
  className,
  disabled,
  isError,
  errorMsg,
}: ButtonProps) => {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
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
