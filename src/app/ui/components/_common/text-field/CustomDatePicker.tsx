"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  errorMsg?: string;
}

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
  errorMsg = "",
  placeholder = "dd/mm/yyyy",
}: DatePickerProps<T>) => {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="w-full">
      <div className="flex gap-2 items-center w-full">
        <label
          htmlFor="startDate"
          className="after:content-['*'] after:text-red-500"
        >
          {label}
        </label>
        <div className="flex-1 w-full">
          <div className="w-full">
            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                return (
                  <DatePicker
                    placeholderText={placeholder}
                    id="startDate"
                    dateFormat="dd/MM/yyyy"
                    className="border w-full border-control-border px-2 py-2 rounded outline-none cursor-pointer text-sm"
                    selected={date}
                    onChange={(date) => {
                      setDate(date);
                      field.onChange(
                        date ? new Date(date).toISOString().split("T")[0] : "",
                      );
                    }}
                  />
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="text-[13px] text-error mt-2">{errorMsg}</div>
    </div>
  );
};
