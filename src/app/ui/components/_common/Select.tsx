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
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number>(
    defaultValue,
  );
  const [selectedLabel, setSelectedLabel] = useState<string>(defaultLabel);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSetSelectedValue = (value: string | number, label: string) => {
    setSelectedValue(value);
    setSelectedLabel(label);
  };

  const clearSelection = () => {
    setSelectedValue("");
    setSelectedLabel(defaultLabel);
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
            disabled={disabled}
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
            <div className="absolute mt-2 w-full bg-popover rounded-md shadow-lg z-[999] overflow-x-auto border-2 border-slate-200 overflow-auto max-h-32">
              {React.Children.count(children) === 0 ? (
                <div className="px-3 py-2 text-xs md:text-sm text-slate-500 text-center">
                  Không có dữ liệu
                </div>
              ) : (
                children
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
const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  className,
}) => {
  const { handleSetSelectedValue, toggleOpen, selectedValue } =
    useSelectContext();

  return (
    <div
      className={cn(
        "px-3 py-2 cursor-pointer text-xs md:text-sm hover:bg-primary truncate transition-all",
        {
          "bg-primary": selectedValue === value,
        },
        className,
      )}
      onClick={() => {
        handleSetSelectedValue(value, children as string);
        toggleOpen();
      }}
    >
      {children}
    </div>
  );
};

export { Select, SelectItem };
