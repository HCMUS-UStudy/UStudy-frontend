import React from "react";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type,
  className,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${className} flex items-center justify-center rounded-md px-3 py-2.5 bg-button_primary hover:bg-sky-900 transition duration-200 ease-in-out cursor-pointer text-white font-bold`}>
      {children}
    </button>
  );
};

// export default dynamic(() => Promise.resolve(Button), { ssr: false });
export default Button;
