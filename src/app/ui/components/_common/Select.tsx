/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { IoChevronDown } from "react-icons/io5";
import { cn } from "@/app/lib/utils";
import { Label } from "@/app/ui/components/_common/Label";
import Loading from "./loading/Loading";
import { XIcon } from "lucide-react";

interface SelectProps {
  children: ReactNode;
  className?: string;
  defaultValue?: string | number;
  defaultLabel?: string;
  onValueChange?: (value: string | number) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  label?: string;
  isLoading?: boolean;
  showClearButton?: boolean;
  customStyle?: {
    labelBg?: string;
  };
  value?: string | number; // Add value prop for controlled mode
}

interface SelectContextProps {
  selectedValue: string | number;
  handleSetSelectedValue: (value: string | number, label: string) => void;
  toggleOpen: () => void;
  clearSelection: () => void;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

/**
 * Select component
 *
 * @param children - SelectItem components
 * @param className - Additional classes
 * @param defaultValue - Default value
 * @param defaultLabel - Default label to display
 * @param onValueChange - Callback function when value changes
 * @param name - Input name
 * @param disabled - Disabled state
 * @param required - Required state
 * @param id - Input id
 * @param label - Label text
 * @param customStyle - Custom style (label background color)
 *
 * @example
 * ```tsx
 * <Select
 *    defaultValue="1"
 *    defaultLabel="Select an option"
 *    onValueChange={(value) => console.log(value)}
 *    name="select"
 *    disabled={false}
 *    required={true}
 *    id="select"
 *    label="Select"
 *    customStyle={{ labelBg: "#000000" }}
 *  >
 *    <SelectItem value="1">Option 1</SelectItem>
 *    <SelectItem value="2">Option 2</SelectItem>
 *  </Select>
 * ```
 */
const Select: React.FC<SelectProps> = ({
  children,
  className,
  defaultValue = "",
  defaultLabel = "",
  onValueChange,
  name,
  disabled = false,
  required = false,
  id,
  label,
  customStyle,
  isLoading = false,
  showClearButton = true,
  value,
}) => {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | number>(
    defaultValue,
  );
  const [selectedLabel, setSelectedLabel] = useState<string>(defaultLabel);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Add this line to fix selectedValue errors
  const selectedValue = isControlled ? value : uncontrolledValue;

  // Flatten children to array for easier handling
  const options = React.Children.toArray(children).filter(Boolean);

  // Sync label with value (controlled or uncontrolled)
  useEffect(() => {
    const found = options.find(
      (child) =>
        React.isValidElement(child) &&
        (child as React.ReactElement<any>).props.value === selectedValue,
    );
    if (found && React.isValidElement(found)) {
      setSelectedLabel((found as React.ReactElement<any>).props.children);
    } else {
      setSelectedLabel(defaultLabel);
    }
  }, [selectedValue, children]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedValue);
    }
  }, [selectedValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Reset focus index when dropdown opens
    if (isOpen) {
      const idx = options.findIndex(
        (child: any) => child.props && child.props.value === selectedValue,
      );
      setFocusedIndex(idx >= 0 ? idx : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to focused option
    if (isOpen && focusedIndex >= 0 && optionsRefs.current[focusedIndex]) {
      optionsRefs.current[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex, isOpen]);

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSetSelectedValue = (val: string | number, label: string) => {
    if (!isControlled) setUncontrolledValue(val);
    setSelectedLabel(label);
    setIsOpen(false);
    setFocusedIndex(-1);
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const clearSelection = () => {
    setUncontrolledValue("");
    setSelectedLabel(defaultLabel);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "ArrowLeft",
          "ArrowRight",
          " ",
          "Enter",
        ].includes(e.key)
      ) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedIndex >= 0 && options[focusedIndex]) {
        const child: any = options[focusedIndex];
        if (child.props && child.props.value !== undefined) {
          handleSetSelectedValue(child.props.value, child.props.children);
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <SelectContext.Provider
      value={{
        selectedValue,
        handleSetSelectedValue,
        toggleOpen,
        clearSelection,
      }}
    >
      {isLoading ? (
        <div className="px-2 py-0.5 bg-primary-lighter w-full flex justify-start border-2 border-slate-300 rounded-md text-nowrap">
          <Loading
            text={defaultLabel || "Đang tải..."}
            customStyle={{ spinner: "size-8" }}
          />
        </div>
      ) : (
        <div
          id={id}
          className={cn("relative text-sm", className)}
          ref={selectRef}
        >
          <input
            type="hidden"
            name={name}
            defaultValue={selectedValue}
            required={required}
          />
          <button
            type="button"
            className={cn(
              "w-full px-3 py-2 text-xs md:text-sm border border-control-border rounded-md flex items-center justify-between gap-2 focus:ring-2 focus:ring-control-ring truncate transition-all",
              {
                "opacity-100 cursor-not-allowed bg-slate-100 hover:bg-slate-100":
                  disabled,
                "hover:bg-gray-50": !disabled,
              },
              className,
            )}
            onClick={(e) => {
              e.preventDefault();
              toggleOpen();
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            tabIndex={0}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={cn("truncate", { "text-slate-500": disabled })}>
              {selectedLabel}
            </span>
            {selectedValue && showClearButton && !disabled ? (
              <>
                <XIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="peer z-[1000] hover:text-primary-darkest transition-colors cursor-pointer"
                  size={20}
                />
                <div className="absolute bottom-10 right-0 bg-gray-700 z-[999] text-white text-[10px] md:text-[12px] py-1 px-2 rounded opacity-0 peer-hover:opacity-100 transition-all">
                  Xóa bộ lọc
                </div>
              </>
            ) : (
              <IoChevronDown
                size={18}
                className={cn({ "text-slate-700": disabled })}
              />
            )}
          </button>
          {label && (
            <Label
              className={cn(
                "absolute left-4 transition-all transform duration-150 text-xs font-medium -top-2.5 text-primary-darkest px-1 truncate",
              )}
              style={{
                backgroundColor: customStyle?.labelBg
                  ? customStyle.labelBg
                  : "white",
              }}
            >
              {label}
            </Label>
          )}
          {isOpen ? (
            <div
              className="absolute mt-1 w-full bg-popover rounded-md shadow-lg z-[999] overflow-x-auto border-2 border-slate-200 overflow-auto max-h-44 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
              style={{
                scrollbarWidth: "thin",
                // For Firefox
              }}
            >
              <style>
                {`
            /* For Chrome, Edge, and Safari */
            .scrollbar-thin::-webkit-scrollbar {
              width: 4px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 4px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
              background: transparent;
            }
          `}
              </style>
              {options.length === 0 ? (
                <div className="px-3 py-2 text-xs md:text-sm text-slate-500 text-center">
                  Không có dữ liệu
                </div>
              ) : (
                options.map((child, idx) =>
                  React.cloneElement(child as React.ReactElement<any>, {
                    ref: (el: HTMLDivElement) =>
                      (optionsRefs.current[idx] = el),
                    isFocused: focusedIndex === idx,
                    className: cn(
                      (child as React.ReactElement<any>).props.className,
                      {
                        "bg-primary-light":
                          selectedValue ===
                          (child as React.ReactElement<any>).props.value,
                      },
                    ),
                  }),
                )
              )}
            </div>
          ) : null}
        </div>
      )}
    </SelectContext.Provider>
  );
};

const useSelectContext = () => {
  const context = useContext<SelectContextProps | undefined>(SelectContext);
  if (!context) {
    throw new Error("useSelectContext must be used within a Select");
  }
  return context;
};

interface SelectItemProps {
  value: string | number;
  children: React.ReactNode;
  className?: string;
  isFocused?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * SelectItem component
 * @param value - Value of the item
 * @param children - Item label
 * @param className - Additional classes
 *
 * @example
 * ```tsx
 * <SelectItem value="1">Option 1</SelectItem>
 * ```
 */
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, className }, ref) => {
    const { handleSetSelectedValue, toggleOpen, selectedValue } =
      useSelectContext();

    return (
      <div
        ref={ref}
        className={cn(
          "px-3 py-2 cursor-pointer text-xs md:text-sm hover:bg-primary truncate transition-all",
          {
            "bg-primary": Number(selectedValue) === Number(value),
            // Remove focus ring
            // "ring-2 ring-primary-darkest": isFocused,
          },
          className,
        )}
        onClick={() => {
          handleSetSelectedValue(value, children as string);
          toggleOpen();
        }}
        tabIndex={-1}
        role="option"
        aria-selected={selectedValue === value}
      >
        {children}
      </div>
    );
  },
);
SelectItem.displayName = "SelectItem";

export { Select, SelectItem };
