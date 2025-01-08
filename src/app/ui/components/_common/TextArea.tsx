import React from "react";
import { cn } from "@/app/lib/utils";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  isError?: boolean;
  errorMsg?: string | null;
  label?: string;
  alwaysShowLabel?: boolean;
  customStyle?: {
    labelBg?: string;
  };
}

const TextArea: React.FC<TextAreaProps> = ({
  className,
  isError,
  errorMsg,
  label,
  alwaysShowLabel,
  customStyle,
  ...props
}) => {
  return (
    <div>
      <div
        className={cn(
          "relative flex justify-between items-center rounded-md",
          "bg-transparent",
        )}
      >
        <textarea
          className={cn(
            "peer w-full bg-transparent disabled:cursor-not-allowed outline-none placeholder-control-placeholder",
            {
              "focus:placeholder-transparent focus:transition-colors focus:duration-200":
                label,
              "border-control-border border": !isError,
              "border-error border-2": isError,
            },
            "w-full rounded-md p-3 text-sm focus:ring-2 focus:ring-control-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />

        {label && (
          <label
            className={cn({
              "absolute left-4 -top-2.5 visible text-blue-500 text-xs px-1 transition-all duration-75 peer-placeholder-shown:top-2 peer-placeholder-shown:invisible peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:visible":
                !alwaysShowLabel,
              "absolute left-4 -top-2.5 visible text-blue-500 text-xs px-1":
                alwaysShowLabel,
            })}
            style={{
              backgroundColor: customStyle?.labelBg
                ? customStyle.labelBg
                : "white",
            }}
          >
            {label}
          </label>
        )}
      </div>

      {isError && errorMsg && (
        <span className="text-[13px] text-error">{errorMsg}</span>
      )}
    </div>
  );
};

export default TextArea;
