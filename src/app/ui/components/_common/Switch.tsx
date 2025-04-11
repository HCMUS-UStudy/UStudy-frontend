import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`switch flex items-center p-1 rounded-full w-11 h-[22px] relative ${
        checked ? "bg-primary-dark" : "bg-gray-300"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <div
        className={`w-[16px] h-[16px] bg-white rounded-full absolute transform transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default Switch;
