"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiFilter } from "react-icons/fi";

interface DropdownProps {
  label: string;
  items: { key: string; label: string }[];
  selected?: string;
}

/**
 * Dropdown component with query preservation and FiFilter icon
 *
 * @param label - Button text
 * @param items - Array of dropdown options
 * @param selected - Currently selected key
 * @returns {React.JSX.Element}
 */
export default function Dropdown({ label, items, selected }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Chọn mặc định "All" nếu không có giá trị
  const defaultSelected = selected || items[0]?.key;

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
    const params = new URLSearchParams(searchParams);
    if (key) {
      params.set("role", key);
    } else {
      params.delete("role");
    }
    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-green-100 mr-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiFilter className="w-5 h-5 text-gray-600" />
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 shadow-lg rounded-md w-40 z-10 mr-4">
          {items.map(({ key, label }) => (
            <button
              key={key}
              className={`block w-full text-left px-4 py-2 hover:bg-green-100 ${
                defaultSelected === key ? "bg-green-200" : ""
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
