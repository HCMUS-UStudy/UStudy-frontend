import React from "react";
import { ConfigProvider, TimePicker } from "antd";
import type { TimePickerProps } from "antd";
import viVN from "antd/locale/vi_VN";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import dayjs from "dayjs";

type Props<T extends FieldValues> = TimePickerProps & {
  isError?: boolean;
  errorMsg?: string;
  control?: Control<T>;
  name?: Path<T>;
};

const CustomTimePicker = <T extends FieldValues>({
  control,
  name,
  isError = false,
  errorMsg = "Đây là trường bắt buộc",
  ...props
}: Props<T>) => {
  if (control && name) {
    return (
      <>
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
                <div className="flex flex-col gap-1">
                  <TimePicker
                    {...props}
                    value={
                      field.value
                        ? dayjs(
                            field.value,
                            props.format ? "HH:mm" : "HH:mm:ss",
                          )
                        : null
                    }
                    status={isError ? "error" : ""}
                    prefix={props.prefix || ""}
                    format={props.format || ""}
                    className="border-control-border text-[14px] text-gray-700 font-semibold px-3 py-2 focus:border-none focus:outline-none"
                    onChange={(timeValue) => {
                      const formattedTime = timeValue?.format("HH:mm") || "";
                      field.onChange(formattedTime);
                    }}
                  />
                  {isError && (
                    <span className="text-[13px] text-error">{errorMsg}</span>
                  )}
                </div>
              </ConfigProvider>
            );
          }}
        ></Controller>
      </>
    );
  } else {
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
        <div className="flex flex-col gap-1">
          <TimePicker
            {...props}
            status={isError ? "error" : ""}
            prefix={props.prefix || ""}
            format={props.format || ""}
            className="border-control-border text-[14px] text-gray-700 font-semibold px-3 py-2 focus:border-none focus:outline-none"
          />
          {isError && (
            <span className="text-[13px] text-error">{errorMsg}</span>
          )}
        </div>
      </ConfigProvider>
    );
  }
};

export default CustomTimePicker;
