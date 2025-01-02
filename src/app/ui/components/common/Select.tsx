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

interface SelectProps {
  children: ReactNode;
  className?: string;
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

interface SelectContextProps {
  selectedValue: string | number;
  selectedLabel: string;
  handleSetSelectedValue: (value: string | number, label: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  disabled?: boolean;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

const Select: React.FC<SelectProps> = ({
  children,
  className,
  defaultValue = "",
  onValueChange,
  name,
  disabled = false,
  required = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number>(
    defaultValue,
  );
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedValue);
    }
  }, [selectedValue, onValueChange]);

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
        selectedLabel,
        handleSetSelectedValue,
        isOpen,
        toggleOpen,
        disabled,
      }}
    >
      <div className={cn("relative", className)} ref={selectRef}>
        <input
          type="hidden"
          name={name}
          value={selectedValue}
          required={required}
        />
        {children}
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

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className,
}) => {
  const { selectedLabel, toggleOpen, disabled } = useSelectContext();

  return (
    <button
      className={cn(
        "w-full px-3 py-2 border border-control-border rounded-md flex items-center justify-between gap-2",
        className,
      )}
      onClick={toggleOpen}
      disabled={disabled}
    >
      {selectedLabel || children}
      <IoChevronDown size={18} />
    </button>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
}

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  const { isOpen } = useSelectContext();

  return isOpen ? (
    <div className="absolute mt-2 w-full bg-popover rounded-md shadow-lg z-[999] overflow-x-auto">
      {children}
    </div>
  ) : null;
};

interface SelectItemProps {
  value: string | number;
  children: React.ReactNode;
  className?: string;
}

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
        "px-3 py-2 cursor-pointer hover:bg-control-hover",
        {
          "bg-control-hover": selectedValue === value,
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

export { Select, SelectTrigger, SelectContent, SelectItem };
