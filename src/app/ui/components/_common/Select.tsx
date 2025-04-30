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
  customStyle?: {
    labelBg?: string;
  };
}

interface SelectContextProps {
  selectedValue: string | number;
  handleSetSelectedValue: (value: string | number, label: string) => void;
  toggleOpen: () => void;
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
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number>(
    defaultValue,
  );
  const [selectedLabel, setSelectedLabel] = useState<string>(defaultLabel);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);
  // const [parentBgColor, setParentBgColor] = React.useState<string>("");

  useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedValue);
    }
  }, [selectedValue]);

  // Get parent background color to set label background color
  // useEffect(() => {
  //   if (selectRef.current) {
  //     let element = selectRef.current.parentElement;
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

  return (
    <SelectContext.Provider
      value={{
        selectedValue,
        handleSetSelectedValue,
        toggleOpen,
      }}
    >
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
            "w-full px-3 py-2 border border-control-border rounded-md flex items-center justify-between gap-2 focus:ring-2 focus:ring-control-ring",
            className,
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleOpen();
          }}
          disabled={disabled}
        >
          {selectedLabel}
          <IoChevronDown size={18} />
        </button>
        {label && (
          <Label
            className={cn(
              "absolute left-4 transition-all transform duration-150 text-xs font-medium -top-2.5 text-primary-darkest px-1",
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
          <div className="absolute mt-2 w-full bg-popover rounded-md shadow-lg z-[999] overflow-x-auto border-2 border-slate-200 overflow-auto max-h-[300px]">
            {children}
          </div>
        ) : null}
      </div>
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
        "px-3 py-2 cursor-pointer hover:bg-primary",
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
