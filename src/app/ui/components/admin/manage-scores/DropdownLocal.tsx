"use client";
import React from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownLocalProps {
  label: string;
  items: { key: string; label: string; description?: string }[];
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
  const dropdownListRef = React.useRef<HTMLDivElement>(null);

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

  // Auto-scroll to selected item when dropdown opens
  React.useEffect(() => {
    if (isOpen && selected && dropdownListRef.current) {
      const selectedElement = dropdownListRef.current.querySelector(
        `[data-key="${selected}"]`,
      ) as HTMLElement;

      if (selectedElement) {
        // Add a small delay to ensure the dropdown is fully rendered
        setTimeout(() => {
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  }, [isOpen, selected]);

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
        className="flex items-center justify-between w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-primary-light hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-darker focus:border-transparent transition-all duration-200"
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
          ref={dropdownListRef}
          className={`absolute ${positionClasses} bg-white border border-gray-200 shadow-lg rounded-lg w-full z-10 max-h-60 overflow-y-auto`}
        >
          {items.map(({ key, label, description }) => (
            <button
              type="button"
              key={key}
              data-key={key}
              className={`block w-full text-left px-4 py-3 text-md hover:bg-primary-light hover:text-primary-dark transition-colors duration-150 ${
                selected === key
                  ? "bg-primary-lighter text-primary-dark font-medium border-l-4 border-primary"
                  : "text-gray-700"
              } ${key === "" ? "border-b border-gray-100" : ""}`}
              onClick={() => handleSelect(key)}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col flex-1">
                  <span className="font-medium">{label}</span>
                  {description && (
                    <span className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {description}
                    </span>
                  )}
                </div>
                {selected === key && (
                  <Check className="w-4 h-4 text-primary ml-2 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
