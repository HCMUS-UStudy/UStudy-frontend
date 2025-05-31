"use client";
import * as React from "react";

import { cn } from "@/app/lib/utils";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Label } from "@/app/ui/components/_common/Label";

// import { useEffect } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  label?: string;
  alwaysShowLabel?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isError?: boolean;
  errorMsg?: string | null;
  icon?: React.ReactNode;
  isIconLeft?: boolean;
  customStyle?: {
    labelBg?: string;
    container?: string;
  };
}

/**
 * Input component
 *
 * @example
 * ```tsx
 * <Input
 *   className="w-full"
 *   type="text"
 *   label="Full name"
 *   alwaysShowLabel={true}
 *   placeholder="Enter your full name"
 *   onChange={(e) => console.log(e.target.value)}
 *   icon={<HiUser />}
 *   isError={false}
 *   errorMsg="This field is required"
 *   customStyle={{ labelBg: "#D5E9F6" }}
 *  />
 *  ```
 *
 * @param className - Input classes name
 * @param type - Input type
 * @param label - Input label
 * @param alwaysShowLabel - Always show label (default: false)
 * @param disabled - Disable the input
 * @param onChange - Function to handle input change
 * @param onEnter - Function to handle enter key press
 * @param isError - Input has error or not (default: false)
 * @param errorMsg - Error message
 * @param icon - Input icon
 * @param isIconLeft - Icon position (default: true - left)
 * @param customStyle - Custom style (label background color)
 * @param ref - Input ref
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Other input props
 *
 * @returns {React.forwardRef<HTMLInputElement, InputProps>}
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      alwaysShowLabel = false,
      disabled = false,
      onChange,
      onEnter,
      isError,
      errorMsg,
      icon,
      isIconLeft = true,
      customStyle,
      ...props
    }: InputProps,
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    // const inputId = React.useId();
    // const [isFocused, setIsFocused] = React.useState(false);
    // const [inputVal, setInputVal] = React.useState("");
    // const parentRef = React.useRef<HTMLDivElement>(null);
    // const [parentBgColor, setParentBgColor] = React.useState<string>("");

    // useEffect(() => {
    //   // Get parent background color to set label background color
    //   if (label && parentRef.current) {
    //     let element = parentRef.current.parentElement;
    //     while (element) {
    //       const bgColor = window.getComputedStyle(element).backgroundColor;
    //       if (bgColor !== "transparent" && bgColor !== "rgba(0, 0, 0, 0)") {
    //         setParentBgColor(bgColor);
    //         break;
    //       }
    //       element = element.parentElement;
    //     }
    //   }
    // }, []);
    //
    // useEffect(() => {
    //   // Get value of input and set it to inputVal
    //   const inputField = document.getElementById(inputId) as HTMLInputElement;
    //   if (inputField) {
    //     setInputVal(inputField.value);
    //   }
    // }, []);

    return (
      //ref={parentRef}
      <div className={customStyle?.container}>
        <div
          className={cn(
            "relative flex justify-between items-center rounded-md h-10",
            "bg-transparent",
            {
              "border-control-border border": !isError,
              "border-error border-2": isError,
              "cursor-not-allowed opacity-100 bg-slate-100": disabled,
            },
            "w-full rounded-md px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-control-ring",
          )}
        >
          {isIconLeft && icon && <div className="pr-3">{icon}</div>}
          <input
            // id={inputId}
            type={showPassword ? "text" : type}
            className={cn(
              "peer w-full bg-transparent text-gray-700 disabled:cursor-not-allowed file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none placeholder-control-placeholder",
              {
                "focus:placeholder-transparent focus:transition-colors focus:duration-200":
                  label,
              },
              className,
            )}
            ref={ref}
            disabled={disabled}
            // onFocus={() => setIsFocused(true)}
            // onBlur={() => setIsFocused(false)}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onEnter) {
                onEnter(e);
              }
            }}
            {...props}
          />

          {label && (
            <Label
              className={cn({
                "absolute left-4 -top-2.5 visible text-[#649c7f] text-xs px-1 transition-all duration-75 peer-placeholder-shown:top-2 peer-placeholder-shown:invisible peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:visible":
                  !alwaysShowLabel,
                "absolute left-4 -top-2.5 visible text-[#649c7f] text-xs px-1":
                  alwaysShowLabel,
              })}
              // style={{
              //   backgroundColor:
              //     type === "date" || alwaysShowLabel || isFocused || inputVal
              //       ? parentBgColor
              //       : "",
              // }}
              style={{
                backgroundColor: customStyle?.labelBg
                  ? customStyle.labelBg
                  : "white",
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
                <HiEyeOff className="text-gray-700" />
              ) : (
                <HiEye className="text-gray-700" />
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

export { Input };
