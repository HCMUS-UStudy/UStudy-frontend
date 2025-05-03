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
      )}
      onClick={handleToggle}
    >
      <div
        className={classNames(
          "w-4 h-4 border-2 flex items-center justify-center rounded-2xl transition-all",
          {
            "border-gray-400 bg-gray-200 cursor-not-allowed": disabled,
            "border-primary-dark bg-primary-dark": checked && !disabled, // Màu primary khi checked
            "border-gray-400 bg-transparent": !checked && !disabled,
          },
          className,
        )}
      >
        {checked && <FaCheck className="w-2 h-2 text-white" />}
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;
