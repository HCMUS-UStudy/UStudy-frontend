"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

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

  const selectedItem = items.find((item) => item.key === selected);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-primary-light hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-md ${selectedItem ? "text-gray-900 font-medium" : "text-gray-500"}`}
        >
          {selectedItem?.label || label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${positionClasses} bg-white border border-gray-200 shadow-lg rounded-lg w-full z-10 max-h-60 overflow-y-auto`}
        >
          {items.map(({ key, label }) => (
            <button
              type="button"
              key={key}
              className={`block w-full text-left px-4 py-3 text-md hover:bg-primary-light hover:text-primary-dark transition-colors duration-150 ${
                selected === key
                  ? "bg-primary-lighter text-primary-dark font-medium"
                  : "text-gray-700"
              } ${key === "" ? "border-b border-gray-100" : ""}`}
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
