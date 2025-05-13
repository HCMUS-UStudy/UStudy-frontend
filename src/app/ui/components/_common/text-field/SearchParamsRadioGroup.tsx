"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Represents a single radio option with a value and display label
 */
interface RadioOption {
  /** The value that will be added to the URL search params */
  value: string;
  /** The display text shown next to the radio button */
  label: string;
}

/**
 * Props for the SearchParamsRadioGroup component
 */
interface SearchParamsRadioGroupProps {
  /** The name of the parameter in the URL search params */
  queryKey: string;
  /** Array of radio options to display */
  options: RadioOption[];
  /** Optional label displayed above the radio group */
  label?: string;
  /** Optional default value if no search param is present */
  defaultValue?: string;
  /** Optional className for the container div */
  className?: string;
  /** Optional className for the radio group wrapper */
  radioGroupClassName?: string;
  /** Optional className for the label */
  labelClassName?: string;
}

/**
 * A radio group component that uses URL search params for state management.
 * Useful for filters and query parameters that should be reflected in the URL.
 *
 * @example
 * ```tsx
 * // Basic usage with search params
 * const options = [
 *   { value: "all", label: "Tất cả" },
 *   { value: "active", label: "Đang hoạt động" },
 *   { value: "inactive", label: "Không hoạt động" }
 * ];
 *
 * <SearchParamsRadioGroup
 *   queryKey="status"
 *   options={options}
 *   label="Trạng thái"
 *   defaultValue="all"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <SearchParamsRadioGroup
 *   queryKey="status"
 *   options={options}
 *   label="Trạng thái"
 *   className="bg-gray-100 p-4 rounded-lg"
 *   radioGroupClassName="flex-wrap"
 *   labelClassName="text-lg font-semibold"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With multiple radio groups
 * const statusOptions = [
 *   { value: "all", label: "Tất cả" },
 *   { value: "active", label: "Đang hoạt động" }
 * ];
 *
 * const typeOptions = [
 *   { value: "all", label: "Tất cả" },
 *   { value: "type1", label: "Loại 1" },
 *   { value: "type2", label: "Loại 2" }
 * ];
 *
 * <div className="flex gap-4">
 *   <SearchParamsRadioGroup
 *     queryKey="status"
 *     options={statusOptions}
 *     label="Trạng thái"
 *   />
 *   <SearchParamsRadioGroup
 *     queryKey="type"
 *     options={typeOptions}
 *     label="Loại"
 *   />
 * </div>
 * ```
 */
export const SearchParamsRadioGroup: React.FC<SearchParamsRadioGroupProps> = ({
  queryKey,
  options,
  label,
  defaultValue,
  className,
  radioGroupClassName,
  labelClassName,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentValue = searchParams?.get(queryKey) || defaultValue || "";

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    if (value === defaultValue) {
      params.delete(queryKey);
    } else {
      params.set(queryKey, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <h1 className={cn("text-gray-700", labelClassName)}>{label}</h1>
      )}
      <div className={cn("flex items-center gap-4", radioGroupClassName)}>
        {options.map((option) => {
          const inputId = `${queryKey}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center gap-2">
              <label
                htmlFor={inputId}
                className="cursor-pointer h-8 w-8 bg-background border-2 rounded-full flex justify-center items-center relative"
              >
                <input
                  type="radio"
                  id={inputId}
                  className="hidden peer"
                  value={option.value}
                  checked={currentValue === option.value}
                  onChange={(e) => handleValueChange(e.target.value)}
                />
                <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                <div className="w-4 h-4 bg-primary-darkest scale-0 peer-checked:scale-100 transition-transform rounded-full"></div>
              </label>
              <label htmlFor={inputId} className="cursor-pointer select-none">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
