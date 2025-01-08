"use client";
import * as React from "react";

import { cn } from "@/app/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
// import { useEffect } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  label?: string;
  alwaysShowLabel?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
 * @component
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
 * @param {string} className - Input classes name
 * @param {string} type - Input type
 * @param {string} label - Input label
 * @param {boolean} alwaysShowLabel - Always show label (default: false)
 * @param {boolean} disabled - Disable the input
 * @param {Function} onChange - Function to handle input change
 * @param {boolean} isError - Input has error or not (default: false)
 * @param {string} errorMsg - Error message
 * @param {React.ReactNode} icon - Input icon
 * @param {boolean} isIconLeft - Icon position (default: true - left)
 * @param {{labelBg: string}} customStyle - Custom style (label background color)
 * @param {React.Ref<HTMLInputElement>} ref - Input ref
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
      isError,
      errorMsg,
      icon,
      isIconLeft = true,
      customStyle,
      ...props
    },
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
              "cursor-not-allowed opacity-50": disabled,
            },
            "w-full rounded-md px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-control-ring",
          )}
        >
          {isIconLeft && icon && <div className="pr-3">{icon}</div>}
          <input
            // id={inputId}
            type={showPassword ? "text" : type}
            className={cn(
              "peer w-full bg-transparent disabled:cursor-not-allowed file:border-0 file:bg-transparent file:text-sm file:font-medium outline-none placeholder-control-placeholder",
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
            </label>
          )}

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pl-3"
            >
              {showPassword ? (
                <HiEyeOff className="text-gray-600" />
              ) : (
                <HiEye className="text-gray-600" />
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

interface SearchProps {
  placeholder: string;
  className?: string;
  defaultValue?: string;
  onSearch?: (term: string) => void;
}

const SearchField: React.FC<SearchProps> = ({
  placeholder,
  className,
  defaultValue,
  onSearch,
}) => {
  // const searchParams = useSearchParams();
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch?.(term);
  }, 1000);
  return (
    <div
      className={cn(
        "flex items-center w-full rounded-md focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-control-ring focus-within:shadow-sm border-input border-gray-400 border",
        className,
      )}
    >
      <div className="pl-3">
        <IoSearchOutline size={20} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        className="w-full rounded-md px-3 py-2 text-sm text-ellipsis outline-none placeholder-gray-600 bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export { Input, SearchField };
