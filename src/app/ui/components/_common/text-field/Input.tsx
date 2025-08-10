"use client";
import * as React from "react";

import { cn } from "@/app/lib/utils";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Label } from "@/app/ui/components/_common/Label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  label?: string;
  alwaysShowLabel?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isError?: boolean;
  errorMsg?: string | null;
  icon?: React.ReactNode;
  isIconLeft?: boolean;
  customStyle?: {
    labelBg?: string;
    container?: string;
  };
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      alwaysShowLabel = false,
      disabled = false,
      onChange,
      onEnter,
      isError,
      errorMsg,
      icon,
      isIconLeft = true,
      customStyle,
      required = false,
      placeholder,
      ...props
    }: InputProps,
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className={customStyle?.container}>
        <div
          className={cn(
            "relative flex justify-between items-center rounded-md h-10",
            "bg-transparent",
            {
              "border-control-border border": !isError,
              "border-error border-2": isError,
              "cursor-not-allowed opacity-100 bg-slate-100": disabled,
            },
            "w-full rounded-md px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-control-ring",
          )}
        >
          {isIconLeft && icon && <div className="pr-3">{icon}</div>}

          <input
            type={showPassword ? "text" : type}
            className={cn(
              "peer w-full bg-transparent text-gray-700 disabled:cursor-not-allowed file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none placeholder-control-placeholder",
              {
                "focus:placeholder-transparent focus:transition-colors focus:duration-200":
                  label,
              },
              className,
            )}
            ref={ref}
            disabled={disabled}
            placeholder={
              placeholder ? `${placeholder}${required ? " *" : ""}` : undefined
            }
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onEnter) {
                onEnter(e);
              }
            }}
            {...props}
          />

          {label && (
            <Label
              className={cn({
                "absolute left-4 -top-2.5 visible text-[#649c7f] text-xs px-1 transition-all duration-75 peer-placeholder-shown:top-2 peer-placeholder-shown:invisible peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:visible":
                  !alwaysShowLabel,
                "absolute left-4 -top-2.5 visible text-[#649c7f] text-xs px-1":
                  alwaysShowLabel,
              })}
              style={{
                backgroundColor: customStyle?.labelBg
                  ? customStyle.labelBg
                  : "white",
              }}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
          )}

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pl-3"
            >
              {showPassword ? (
                <HiEyeOff className="text-gray-700" />
              ) : (
                <HiEye className="text-gray-700" />
              )}
            </button>
          )}

          {icon && !isIconLeft && type !== "password" && (
            <div className="pl-3">{icon}</div>
          )}
        </div>

        {isError && errorMsg && (
          <span className="text-[13px] text-error">{errorMsg}</span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
