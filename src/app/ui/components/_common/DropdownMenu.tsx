"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";

interface DropdownContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextProps | undefined>(
  undefined,
);

const useDropdownContext = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdownContext error");
  }
  return context;
};

interface DropdownMenuProps {
  children: React.ReactNode;
}

/**
 * Dropdown menu component
 *
 * @param children - The children of the dropdown menu: DropdownMenuTrigger, DropdownMenuContent
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem>Item 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 *  </DropdownMenu>
 *  ```
 */
const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">{children}</div>
    </DropdownContext.Provider>
  );
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Dropdown menu trigger component
 *
 * The trigger of the dropdown menu
 *
 * @param children - The children of the trigger
 * @param className - The class name of the trigger
 *
 * @example
 * ```tsx
 * <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
 * ```
 */
const DropdownMenuTrigger = ({
  children,
  className,
}: DropdownMenuTriggerProps) => {
  const { isOpen, setIsOpen } = useDropdownContext();

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </div>
  );
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Dropdown menu content component
 *
 * The content of the dropdown menu - Use this component to wrap the dropdown menu items
 *
 * @param children - The children of the content (DropdownMenuItem, DropdownMenuSeparator)
 * @param className - The class name of the content
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuItem>Item 1</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem>Item 2</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
const DropdownMenuContent = ({
  children,
  className,
}: DropdownMenuContentProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useDropdownContext();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Close the menu
        setIsOpen(false);
      }
    },
    [setIsOpen],
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    isOpen && (
      <div
        ref={menuRef}
        className={cn(
          "absolute right-0 mt-2 w-48 bg-popover border border-control-border rounded-md shadow-lg overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    )
  );
};

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Dropdown menu item component
 *
 * The item of the dropdown menu
 *
 * @param children - The children of the item
 * @param onClick - The click event handler
 * @param className - The class name of the item
 *
 * @example
 * ```tsx
 * <DropdownMenuItem onClick={handleClick}>Item 1</DropdownMenuItem>
 * ```
 */
const DropdownMenuItem = ({
  children,
  onClick,
  className,
}: DropdownMenuItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-3 py-2 text-sm text-gray-700 hover:bg-primary-light cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * Dropdown menu separator component
 *
 * The separator of the dropdown menu
 *
 * @example
 * ```tsx
 *  <DropdownMenuSeparator />
 * ```
 */
const DropdownMenuSeparator: React.FC = () => {
  return <div className="border-t border-gray-300" />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
