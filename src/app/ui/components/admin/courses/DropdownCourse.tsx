"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiFilter } from "react-icons/fi";
import { getAllCourses } from "@/app/lib/services/course";

interface DropdownCourseProps {
  label: string;
}

interface CourseItem {
  key: string;
  label: string;
}

interface FilteredItem {
  id: string;
  name: string;
}

export default function DropdownCourse({ label }: DropdownCourseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CourseItem[]>([]);
  const [selected, setSelected] = useState<string>("0"); // Mặc định chọn "All"
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await getAllCourses("", 100, 0);

        const filteredData = response.content.map((item: FilteredItem) => ({
          key: item.id,
          label: item.name,
        }));

        // Thêm "All" vào đầu danh sách
        const updatedItems = [{ key: "0", label: "All" }, ...filteredData];

        setItems(updatedItems);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
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

  // 🟡 Chọn môn học và cập nhật URL query params
  const handleSelect = (key: string, label: string) => {
    const params = new URLSearchParams(searchParams);
    if (key !== "0") {
      params.set("subject", label); // Thay vì key (id), dùng label (tên môn học)
    } else {
      params.delete("subject");
    }
    replace(`${pathname}?${params.toString()}`);
    setSelected(key);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-green-100 mr-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiFilter className="w-5 h-5 text-gray-600" />
        <span>{items.find((c) => c.key === selected)?.label || label}</span>
      </button>

      {isOpen && items.length > 0 && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 shadow-lg rounded-md w-40 z-10 max-h-60 overflow-y-auto">
          {items.map(({ key, label }) => (
            <button
              key={key}
              className={`block w-full text-left px-4 py-2 hover:bg-green-100 ${
                selected === key ? "bg-green-200" : ""
              }`}
              onClick={() => handleSelect(key, label)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
