// "use client";
//
// import * as React from "react";
// import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
// import { Check, ChevronRight, Circle } from "lucide-react";
//
// import { cn } from "@/app/lib/utils";
//
// // Khởi tạo gốc
// const DropdownMenu = DropdownMenuPrimitive.Root;
//
// // Khởi tạo nút kích hoạt
// const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
//
// // Nhóm mục lục
// const DropdownMenuGroup = DropdownMenuPrimitive.Group;
//
// // Portal giúp menu hiển thị phía trên giao diện khác
// const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
//
// // Nhóm menu con
// const DropdownMenuSub = DropdownMenuPrimitive.Sub;
//
// const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
//
// const DropdownMenuSubTrigger = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
//     inset?: boolean; // Tùy chọn ra hay lùi
//   }
// >(({ className, inset, children, ...props }, ref) => (
//   <DropdownMenuPrimitive.SubTrigger
//     ref={ref}
//     className={cn(
//       "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
//       inset && "pl-8",
//       className,
//     )}
//     {...props}
//   >
//     {children}
//     <ChevronRight className="ml-auto h-4 w-4" />
//   </DropdownMenuPrimitive.SubTrigger>
// ));
// DropdownMenuSubTrigger.displayName =
//   DropdownMenuPrimitive.SubTrigger.displayName;
//
// // Nội dung menu con
// const DropdownMenuSubContent = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
// >(({ className, ...props }, ref) => (
//   <DropdownMenuPrimitive.SubContent
//     ref={ref}
//     className={cn(
//       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//       className,
//     )}
//     {...props}
//   />
// ));
// DropdownMenuSubContent.displayName =
//   DropdownMenuPrimitive.SubContent.displayName;
//
// const DropdownMenuContent = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
// >(({ className, sideOffset = 4, ...props }, ref) => (
//   <DropdownMenuPrimitive.Portal>
//     <DropdownMenuPrimitive.Content
//       ref={ref}
//       sideOffset={sideOffset} // Khoảng cách của menu đến icon
//       className={cn(
//         "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//         className,
//       )}
//       {...props}
//     />
//   </DropdownMenuPrimitive.Portal>
// ));
// DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
//
// const DropdownMenuItem = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.Item>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
//     inset?: boolean;
//   }
// >(({ className, inset, ...props }, ref) => (
//   <DropdownMenuPrimitive.Item
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-control-hover",
//       inset && "pl-8",
//       className,
//     )}
//     {...props}
//   />
// ));
// DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
//
// const DropdownMenuCheckboxItem = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
// >(({ className, children, checked, ...props }, ref) => (
//   <DropdownMenuPrimitive.CheckboxItem
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className,
//     )}
//     checked={checked} //trạng thái của checkbox
//     {...props}
//   >
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <DropdownMenuPrimitive.ItemIndicator>
//         <Check className="h-4 w-4" />
//       </DropdownMenuPrimitive.ItemIndicator>
//     </span>
//     {children}
//   </DropdownMenuPrimitive.CheckboxItem>
// ));
// DropdownMenuCheckboxItem.displayName =
//   DropdownMenuPrimitive.CheckboxItem.displayName;
//
// const DropdownMenuRadioItem = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
// >(({ className, children, ...props }, ref) => (
//   <DropdownMenuPrimitive.RadioItem
//     ref={ref}
//     className={cn(
//       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className,
//     )}
//     {...props}
//   >
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <DropdownMenuPrimitive.ItemIndicator>
//         <Circle className="h-2 w-2 fill-current" />
//       </DropdownMenuPrimitive.ItemIndicator>
//     </span>
//     {children}
//   </DropdownMenuPrimitive.RadioItem>
// ));
// DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
//
// const DropdownMenuLabel = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.Label>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
//     inset?: boolean;
//   }
// >(({ className, inset, ...props }, ref) => (
//   <DropdownMenuPrimitive.Label
//     ref={ref}
//     className={cn(
//       "px-2 py-1.5 text-sm font-semibold",
//       inset && "pl-8",
//       className,
//     )}
//     {...props}
//   />
// ));
// DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
//
// //tạo một đường phân cách (dòng ngang) giữa các mục trong menu.
// const DropdownMenuSeparator = React.forwardRef<
//   React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
//   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
// >(({ className, ...props }, ref) => (
//   <DropdownMenuPrimitive.Separator
//     ref={ref}
//     className={cn("-mx-1 my-1 h-px bg-muted", className)}
//     {...props}
//   />
// ));
// DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
//
// //hiển thị các phím tắt
// const DropdownMenuShortcut = ({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLSpanElement>) => {
//   return (
//     <span
//       className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
//       {...props}
//     />
//   );
// };
// DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//
// export {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuCheckboxItem,
//   DropdownMenuRadioItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuGroup,
//   DropdownMenuPortal,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuRadioGroup,
// };

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
