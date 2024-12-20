"use client";
import * as React from "react";

import { cn } from "@/app/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "./label";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
  errorMsg?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, onChange, isError, errorMsg, ...props }, ref) => {
    const inputId = React.useId();
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputVal, setInputVal] = React.useState("");
    
    return (
      <div>
        <div className="relative">
          <input
            id={inputId}
            type={showPassword ? "text" : type}
            className={cn(
              {
                "border-input border-gray-400 border": !isError,
                "border-error border-2": isError,
                "placeholder-transparent bg-background": isFocused || inputVal,
                "placeholder-gray-400 bg-transparent": !isFocused && !inputVal,
              },
              "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            ref={ref}
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
              className={`absolute left-4 transition-all duration-200 hover:cursor-auto ${
                isFocused || inputVal
                  ? "-top-3 text-xs text-indigo-600 bg-[#D5E9F6] px-1"
                  : "top-1/2 transform -translate-y-1/2 text-transparent"
              }`}>
              {label}
            </Label>
          )}

          {type === "password" &&
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-2 absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none">
              {showPassword ? (
                <HiEyeOff className="text-gray-600" />
              ) : (
                <HiEye className="text-gray-600" />
              )}
            </button>
          }
        </div>

        {isError && errorMsg && (
          <span className="text-[13px] text-error">{errorMsg}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SearchProps {
  placeholder: string;
  className?: string;
}

const SearchField: React.FC<SearchProps> = ({ placeholder, className }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearchClasses = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <>
      <input
        onChange={(e) => {
          handleSearchClasses(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        placeholder={placeholder}
        className={`${className} flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
      />
    </>
  );
};

export { Input, SearchField };
