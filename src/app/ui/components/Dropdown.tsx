import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  id: string;
  triggerContent: React.ReactNode;
  dropdownItems: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ id, triggerContent, dropdownItems }) => {
  const [activeDropdown, setActiveDropdown] = useState<string>("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown("");
    } else {
      setActiveDropdown(id);
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      if (triggerRect) {
        setDropdownStyle({
          position: "absolute",
          top: triggerRect.bottom + window.scrollY,
          left: triggerRect.left + window.scrollX,
          zIndex: 9999,
        });
      }
    }
  };

  const closeDropdown = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !triggerRef.current?.contains(event.target as Node)
    ) {
      setActiveDropdown("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const dropdownContent = (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="bg-white border border-gray-200 rounded-md shadow-lg"
    >
      {dropdownItems.map((item, index) => (
        <button
          key={index}
          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => toggleDropdown(id)}
        className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all shadow-lg transform hover:scale-105"
      >
        {triggerContent}
      </button>

      {/* Dropdown Menu */}
      {activeDropdown === id && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default Dropdown;
