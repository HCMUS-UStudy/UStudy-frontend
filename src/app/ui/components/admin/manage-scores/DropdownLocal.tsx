"use client";
import React from "react";

interface DropdownLocalProps {
  label: string;
  items: { key: string; label: string }[];
  selected?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  onSelect?: (key: string) => void;
}

export default function DropdownLocal({
  label,
  items,
  selected,
  position,
  onSelect,
}: DropdownLocalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key: string) => {
    if (onSelect) onSelect(key);
    setIsOpen(false);
  };

  const positionClasses = {
    "top-left": "bottom-full left-0 mb-2",
    "top-right": "bottom-full right-0 mb-2",
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2",
  }[position || "bottom-left"];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-primary-lighter transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-nowrap text-xs md:text-base">
          {items.find((item) => item.key === selected)?.label || label}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute ${positionClasses} bg-white border border-gray-300 shadow-lg rounded-md w-40 z-10`}
        >
          {items.map(({ key, label }) => (
            <button
              type="button"
              key={key}
              className={`block w-full text-left text-xs md:text-base px-4 py-2 hover:bg-primary transition-colors ${
                selected === key ? "bg-primary-lighter" : ""
              }`}
              onClick={() => handleSelect(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
