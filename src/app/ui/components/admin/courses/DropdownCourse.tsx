"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiFilter } from "react-icons/fi";
import { getAllCourses } from "@/app/lib/services/course";
import { CourseItem } from "@/app/types/type";

interface DropdownCourseProps {
  label: string;
  onSelectCourse: (courseId: string | null) => void;
}

export default function DropdownCourse({
  label,
  onSelectCourse,
}: DropdownCourseProps) {
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

        const filteredData = response.content.map((item: CourseItem) => ({
          key: item.courseDto.id,
          label: item.courseDto.name,
        }));

        const updatedItems: CourseItem[] = [
          {
            totalGrades: 0, // Giá trị mặc định
            courseDto: {
              id: "0",
              name: "All",
              createdBy: {
                id: "",
                genId: "",
                email: "",
                name: "",
              },
            },
          },
          ...filteredData.map((item) => ({
            totalGrades: 0, // Hoặc giá trị phù hợp
            courseDto: {
              id: item.key,
              name: item.label,
              createdBy: {
                id: "",
                genId: "",
                email: "",
                name: "",
              },
            },
          })),
        ];

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

  const removeVietnameseAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleSelect = (key: string, label: string) => {
    const params = new URLSearchParams(searchParams);
    const normalizedLabel = removeVietnameseAccents(label); // Xóa dấu tiếng Việt

    if (key !== "0") {
      params.set("subject", normalizedLabel);
      onSelectCourse(normalizedLabel);
    } else {
      params.delete("subject");
      onSelectCourse("");
    }

    replace(`${pathname}?${params.toString()}`);
    setSelected(key);
    setIsOpen(false);
    onSelectCourse(key !== "0" ? normalizedLabel : null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white hover:bg-green-100 mr-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiFilter className="w-5 h-5 text-gray-600" />
        <span>
          {items.find((c) => c.courseDto.id === selected)?.courseDto.name ||
            label}
        </span>
      </button>

      {isOpen && items.length > 0 && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 shadow-lg rounded-md w-40 z-10 max-h-60 overflow-y-auto">
          {items.map(({ courseDto }) => (
            <button
              key={courseDto.id}
              className={`block w-full text-left px-4 py-2 hover:bg-green-100 ${
                selected === courseDto.id ? "bg-green-200" : ""
              }`}
              onClick={() => handleSelect(courseDto.id, courseDto.name)}
            >
              {courseDto.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
