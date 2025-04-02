import React from "react";
import classNames from "classnames";
import { FaCheck } from "react-icons/fa6";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      className={classNames(
        "flex gap-2 items-center cursor-pointer select-none",
        {
          "cursor-not-allowed text-gray-200": disabled,
          "text-primary": !disabled,
        },
        className,
      )}
      onClick={handleToggle}
    >
      <div
        className={classNames(
          "w-5 h-5 border-2 flex items-center justify-center rounded transition-all",
          {
            "border-gray-300 bg-gray-300 cursor-not-allowed": disabled,
            "border-hover-primary bg-hover-primary": checked && !disabled, // Màu primary khi checked
            "border-gray-400 bg-transparent": !checked && !disabled,
          },
        )}
      >
        {checked && (
          <FaCheck className="w-3 h-3 text-white" /> // Biểu tượng checkmark
        )}
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;
