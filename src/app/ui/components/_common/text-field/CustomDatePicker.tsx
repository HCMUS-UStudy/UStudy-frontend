"use client";
import React, { useState } from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";
import { FaCalendar } from "react-icons/fa6";

type CustomDatePickerProps<T extends FieldValues> = DatePickerProps & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  isError?: boolean;
  errorMsg?: string;
} & {
  selectsRange?: never;
  selectsMultiple?: never;
};
// type CustomDatePickerProps<T extends FieldValues> = Omit<
//   DatePickerProps,
//   "onChange" | "name" | "selectsMultiple"
// > & {
//   name: Path<T>;
//   control: Control<T>;
//   label: string;
//   placeholder?: string;
//   isError?: boolean;
//   errorMsg?: string;
// };

/**
 * A reusable DatePicker component integrated with React Hook Form.
 *
 * This component renders a `react-datepicker` input and manages form state via `Controller`.
 * The selected date is displayed in the format `dd/MM/yyyy` and stored in ISO format (`yyyy-MM-dd`).
 *
 * @template T - The form schema/interface extending FieldValues.
 *
 * @param {Path<T>} name - The field name in the form.
 * @param {Control<T>} control - The control object from useForm or useFormContext.
 * @param {string} [label] - Optional label to display next to the input.
 * @param {string} [placeholder="DD/MM/YYYY"] - Placeholder text for the input.
 *
 * @returns {JSX.Element} A date picker integrated with React Hook Form.
 *
 * @example
 * ```tsx
 * interface FormValues {
 *   startDate: string;
 * }
 *
 * const { control, handleSubmit } = useForm<FormValues>();
 *
 * return (
 *   <form onSubmit={handleSubmit(console.log)}>
 *     <CustomDatePicker
 *       name="startDate"
 *       control={control}
 *       label="Start Date"
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * );
 * ```
 */
export const CustomDatePicker = <T extends FieldValues>({
  name,
  control,
  label,
  isError = false,
  errorMsg = "",
  placeholder = "dd/mm/yyyy",
  ...datePickerProps
}: CustomDatePickerProps<T>) => {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="w-full text-sm">
      <label
        htmlFor={name}
        className={clsx(
          `flex gap-2 items-center w-full px-3 h-[40px] rounded-md cursor-pointer`,
          {
            "border border-control-border": !isError,
            "border-2 border-error": isError,
          },
        )}
      >
        <div className="text-gray-700 flex items-center">
          {label}
          <div className="flex-1 w-full">
            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                return (
                  <DatePicker
                    {...datePickerProps}
                    placeholderText={placeholder}
                    id={name}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-2  rounded outline-none cursor-pointer text-sm"
                    selected={date}
                    icon={<FaCalendar className="text-gray-500" />}
                    showIcon
                    onChange={(dateValue) => {
                      setDate(dateValue);
                      const isoDate = dateValue
                        ? new Date(
                            Date.UTC(
                              dateValue.getFullYear(),
                              dateValue.getMonth(),
                              dateValue.getDate(),
                            ),
                          )
                            .toISOString()
                            .split("T")[0]
                        : "";
                      field.onChange(isoDate);
                    }}
                  />
                );
              }}
            />
          </div>
        </div>
      </label>
      <span className="text-[13px] text-error mt-2">{errorMsg}</span>
    </div>
  );
};
