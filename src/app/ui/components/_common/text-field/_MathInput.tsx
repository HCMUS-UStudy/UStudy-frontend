"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";
import { Label } from "@/app/ui/components/_common/Label";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  isError?: boolean;
  errorMsg?: string | null;
  label?: string;
  alwaysShowLabel?: boolean;
  customStyle?: {
    labelBg?: string;
  };
}

const MathInput: React.FC<Props> = ({
  className,
  isError = false,
  errorMsg,
  label,
  alwaysShowLabel = false,
  customStyle,
  value,
  onChange,
  ...props
}) => {
  const [renderedHtml, setRenderedHtml] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof value === "string" && value.trim() !== "") {
      try {
        const html = katex.renderToString(value, {
          throwOnError: true,
          displayMode: false,
        });
        setRenderedHtml(html);
        setError(null);
      } catch {
        setError("Lỗi khi nhập biểu thức toán học");
        setRenderedHtml("");
      }
    } else {
      setRenderedHtml("");
      setError(null);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative flex justify-between items-center rounded-md bg-transparent",
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
            "w-full rounded-md p-3 text-sm focus:ring-2 focus:ring-control-ring disabled:cursor-not-allowed disabled:bg-slate-100",
            className,
          )}
          value={value}
          onChange={onChange}
          {...props}
        />

        {label && (
          <Label
            className={cn({
              "absolute left-4 -top-2.5 visible text-primary-darker text-xs px-1 transition-all duration-75 peer-placeholder-shown:top-2 peer-placeholder-shown:invisible peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:visible":
                !alwaysShowLabel,
              "absolute left-4 -top-2.5 visible text-primary-darker text-xs px-1":
                alwaysShowLabel,
            })}
            style={{
              backgroundColor: customStyle?.labelBg
                ? customStyle.labelBg
                : "white",
            }}
          >
            {label}
          </Label>
        )}
      </div>

      {isError && errorMsg && (
        <span className="text-[13px] text-error">{errorMsg}</span>
      )}

      {error && (
        <div className="text-[13px] text-error font-semibold">{error}</div>
      )}

      {renderedHtml && (
        <div
          className="text-base p-2 border rounded bg-slate-50"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      )}
    </div>
  );
};

export default MathInput;
