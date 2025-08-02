"use client";
import React from "react";
import {
  DatePicker as AntdDatepicker,
  DatePickerProps as AntdDatePickerProps,
  ConfigProvider,
} from "antd";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import viVN from "antd/locale/vi_VN";

type CustomDatePickerProps<T extends FieldValues> = AntdDatePickerProps & {
  label: string;
  name?: Path<T>;
  control?: Control<T>;
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
  placeholder = "dd/MM/yyyy",
  ...datePickerProps
}: CustomDatePickerProps<T>) => {
  return (
    <>
      {control && name ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#4ea677",
                    colorError: "#dc2626",
                    fontSize: 14,
                  },
                }}
                locale={viVN}
              >
                <AntdDatepicker
                  {...datePickerProps}
                  placeholder={placeholder}
                  id={name}
                  format="DD/MM/YYYY"
                  prefix={label}
                  status={isError ? "error" : ""}
                  className={`w-full px-3 py-2   rounded-lg cursor-pointer text-sm bg-transparent ${isError ? "border-2 border-error" : "border border-control-border"}`}
                  onChange={(dateValue) => {
                    const isoDate = dateValue
                      ? dateValue.format("YYYY-MM-DD")
                      : "";
                    field.onChange(isoDate);
                  }}
                />
              </ConfigProvider>
            );
          }}
        />
      ) : (
        <>
          <ConfigProvider
            theme={{
              token: { colorPrimary: "#4ea677" },
            }}
            locale={viVN}
          >
            <AntdDatepicker
              {...datePickerProps}
              placeholder={placeholder}
              id={name}
              format="DD/MM/YYYY"
              variant="borderless"
              className="w-full px-2 rounded outline-none border-none text-[14px] focus:outline-green-500  cursor-pointer text-sm bg-transparent"
            />
          </ConfigProvider>
        </>
      )}
      {isError && (
        <span className="text-[13px] text-error mt-2">{errorMsg}</span>
      )}
    </>
  );
};
