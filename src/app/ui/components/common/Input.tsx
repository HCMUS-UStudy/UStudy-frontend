"use client";
import * as React from "react";

import { cn } from "@/app/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "./Label";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  label?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
  errorMsg?: string | null;
  icon?: React.ReactNode;
  isIconLeft?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      disabled = false,
      onChange,
      isError,
      errorMsg,
      icon,
      isIconLeft = true,
      ...props
    },
    ref,
  ) => {
    const inputId = React.useId();
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputVal, setInputVal] = React.useState("");
    const parentRef = React.useRef<HTMLDivElement>(null);
    const [parentBgColor, setParentBgColor] = React.useState<string>("");

    // Get parent background color to set label background color
    useEffect(() => {
      if (parentRef.current) {
        let element = parentRef.current.parentElement;
        while (element) {
          const bgColor = window.getComputedStyle(element).backgroundColor;
          if (bgColor !== "transparent" && bgColor !== "rgba(0, 0, 0, 0)") {
            setParentBgColor(bgColor);
            break;
          }
          element = element.parentElement;
        }
      }
    }, []);

    return (
      <div ref={parentRef}>
        <div
          className={cn(
            "relative flex justify-between items-center",
            "bg-transparent",
            {
              "border-control-border border": !isError,
              "border-error border-2": isError,
              "cursor-not-allowed opacity-50": disabled,
            },
            "flex h-10 w-full rounded-md px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-control-ring",
            className,
          )}
        >
          {isIconLeft && icon && <div className="pr-3">{icon}</div>}
          <input
            id={inputId}
            type={showPassword ? "text" : type}
            className={cn(
              "w-full bg-transparent disabled:cursor-not-allowed file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none placeholder-control-placeholder",
              {
                "placeholder-transparent transition-colors duration-200":
                  label && (isFocused || inputVal),
              },
            )}
            ref={ref}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setInputVal(e.target.value);
              if (onChange) {
                onChange(e);
              }
            }}
            {...props}
          />

          {label && (
            <Label
              htmlFor={inputId}
              className={cn(
                "absolute left-4 transition-all duration-150",
                `${isFocused || inputVal ? `-top-2.5 text-xs text-blue-500 px-1` : "top-1/2 transform -translate-y-1/2 text-transparent"}`,
                {
                  "cursor-not-allowed": disabled,
                },
              )}
              style={{
                backgroundColor: (isFocused || inputVal) && parentBgColor,
              }}
            >
              {label}
            </Label>
          )}

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pl-3"
            >
              {showPassword ? (
                <HiEyeOff className="text-gray-600" />
              ) : (
                <HiEye className="text-gray-600" />
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

interface SearchProps {
  placeholder: string;
  className?: string;
  defaultValue?: string;
  onSearch?: (term: string) => void;
}

const SearchField: React.FC<SearchProps> = ({
  placeholder,
  className,
  defaultValue,
  onSearch,
}) => {
  // const searchParams = useSearchParams();
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch?.(term);
  }, 1000);
  return (
    <div
      className={cn(
        "flex items-center w-full rounded-md focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-control-ring focus-within:shadow-sm border-input border-gray-400 border",
        className,
      )}
    >
      <div className="pl-3">
        <IoSearchOutline size={20} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        className="w-full rounded-md px-3 py-2 text-sm text-ellipsis outline-none placeholder-gray-600 bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export { Input, SearchField };
