"use client";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

/**
 * Represents a single radio option with a value and display label
 */
interface RadioOption {
  /** The value that will be stored in the form data */
  value: string;
  /** The display text shown next to the radio button */
  label: string;
}

/**
 * Props for the CustomRadioGroup component
 * @template T - The type of the form values
 */
interface CustomRadioGroupProps<T extends FieldValues> {
  /** The name of the field in the form data */
  name: Path<T>;
  /** The react-hook-form control object */
  control: Control<T>;
  /** Optional label displayed above the radio group */
  label?: string;
  /** Array of radio options to display */
  options: RadioOption[];
  /** Optional error message to display below the radio group */
  error?: string;
  /** Optional className for the container div */
  className?: string;
  /** Optional className for the radio group wrapper */
  radioGroupClassName?: string;
  /** Optional className for the label */
  labelClassName?: string;
}

/**
 * A customizable radio group component that integrates with react-hook-form
 *
 * @example
 * ```tsx
 * // Basic usage with react-hook-form
 * const { control } = useForm<FormData>();
 *
 * const options = [
 *   { value: "MALE", label: "Nam" },
 *   { value: "FEMALE", label: "Nữ" }
 * ];
 *
 * <CustomRadioGroup
 *   name="gender"
 *   control={control}
 *   label="Giới tính"
 *   options={options}
 *   error={errors.gender?.message}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <CustomRadioGroup
 *   name="gender"
 *   control={control}
 *   label="Giới tính"
 *   options={options}
 *   className="bg-gray-100 p-4 rounded-lg"
 *   radioGroupClassName="flex-wrap"
 *   labelClassName="text-lg font-semibold"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With form validation
 * const { control, formState: { errors } } = useForm<FormData>({
 *   defaultValues: {
 *     gender: "MALE"
 *   }
 * });
 *
 * const options = [
 *   { value: "MALE", label: "Nam" },
 *   { value: "FEMALE", label: "Nữ" }
 * ];
 *
 * <CustomRadioGroup
 *   name="gender"
 *   control={control}
 *   label="Giới tính"
 *   options={options}
 *   error={errors.gender?.message}
 * />
 * ```
 */
export const CustomRadioGroup = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  error,
  className,
  radioGroupClassName,
  labelClassName,
}: CustomRadioGroupProps<T>) => {
  return (
    <div className={cn("flex gap-2 items-center h-[40px]", className)}>
      {label && (
        <h1 className={cn("text-gray-700", labelClassName)}>{label}</h1>
      )}
      <div className={cn("flex items-center gap-4", radioGroupClassName)}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              {options.map((option) => {
                const inputId = `${name}-${option.value}`;
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
                        checked={field.value === option.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                      <div className="w-4 h-4 bg-primary-darkest scale-0 peer-checked:scale-100 transition-transform rounded-full"></div>
                    </label>
                    <label
                      htmlFor={inputId}
                      className="cursor-pointer select-none"
                    >
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </>
          )}
        />
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
