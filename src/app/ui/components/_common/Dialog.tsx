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

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  className,
  enableClickOutside = true,
  displayCloseButton = true,
}) => {
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

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
}) => {
  const { onClose, displayCloseButton } = useDialogContext();

  return (
    <div
      className={clsx(
        "sticky top-0 left-0 z-10 p-4 border-b bg-white font-bold text-xl",
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

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className,
}) => {
  return <div className={clsx("p-4 border-t", className)}>{children}</div>;
};
