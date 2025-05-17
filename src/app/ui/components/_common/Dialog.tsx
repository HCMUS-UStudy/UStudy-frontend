import React, { createContext, useContext, ReactNode } from "react";
import clsx from "clsx";
import { LiaTimesSolid } from "react-icons/lia";

interface DialogContextProps {
  isOpen: boolean;
  onClose: () => void;
  displayCloseButton: boolean;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
};

interface DialogProviderProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  displayCloseButton: boolean;
}

const DialogProvider: React.FC<DialogProviderProps> = ({
  isOpen,
  onClose,
  children,
  displayCloseButton,
}) => {
  return (
    <DialogContext.Provider value={{ isOpen, onClose, displayCloseButton }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  enableClickOutside?: boolean;
  displayCloseButton?: boolean;
}

/**
 * Dialog component
 *
 * @param isOpen - Whether the dialog is open
 * @param onClose - Function to close the dialog
 * @param children - DialogHeader, DialogContent, DialogFooter
 * @param className - Additional classes for the dialog
 * @param enableClickOutside - Whether clicking outside the dialog should close it
 * @param displayCloseButton - Whether to display the close button in the header
 *
 * @example
 * ```tsx
 *  <Dialog isOpen={isOpen} onClose={onClose}>
 *    <DialogHeader>Dialog Title</DialogHeader>
 *    <DialogContent>Dialog Content</DialogContent>
 *    <DialogFooter>Dialog Footer</DialogFooter>
 *  </Dialog>
 *  ```
 */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  className,
  enableClickOutside = true,
  displayCloseButton = true,
}: DialogProps) => {
  if (!isOpen) return null;
  return (
    <DialogProvider
      isOpen={isOpen}
      onClose={onClose}
      displayCloseButton={displayCloseButton}
    >
      <div
        className={clsx(
          "fixed inset-0 flex justify-center items-center transition-colors duration-200 bg-black/20 z-10",
        )}
        onClick={enableClickOutside ? onClose : undefined}
      >
        <div
          className={clsx(
            "bg-white rounded-xl max-h-[calc(100vh-2rem)] overflow-auto",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </DialogProvider>
  );
};

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * DialogHeader component
 *
 * Use inside a Dialog component to display the header
 *
 * @param children - Dialog header content
 * @param className - Additional classes for the header
 *
 * @example
 * ```tsx
 * <DialogHeader>Dialog Title</DialogHeader>
 * ```
 */
export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
}) => {
  const { onClose, displayCloseButton } = useDialogContext();

  return (
    <div
      className={clsx(
        "sticky top-0 left-0 z-10 py-4 px-8 border-b-2 bg-white font-bold text-xl",
        className,
      )}
    >
      {children}

      {displayCloseButton && (
        <button
          className="hover:text-black hover:bg-gray-200 p-1 rounded-lg absolute top-[calc(50%-14px)] right-4"
          onClick={onClose}
        >
          <LiaTimesSolid size={20} />
        </button>
      )}
    </div>
  );
};

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * DialogContent component
 *
 * Use inside a Dialog component to display the body content
 *
 * @param children - Dialog content
 * @param className - Additional classes for the content
 *
 * @example
 * ```tsx
 *  <DialogContent>Dialog Content</DialogContent>
 *  ```
 */
export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
}) => {
  return <div className={clsx("p-4", className)}>{children}</div>;
};

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * DialogFooter component
 *
 * Use inside a Dialog component to display the footer
 *
 * @param children - Dialog footer content
 * @param className - Additional classes for the footer
 *
 * @example
 * ```tsx
 * <DialogFooter>Dialog Footer</DialogFooter>
 * ```
 */
export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className,
}) => {
  return <div className={clsx("p-4 border-t-2", className)}>{children}</div>;
};
