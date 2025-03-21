"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaEllipsisV,
  FaFolder,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import Loading from "@/app/ui/components/_common/Loading";
import { MaterialItem } from "@/app/types/type";
import { getListSystemMaterial } from "@/app/lib/services/material";

const MaterialsGrid: React.FC = () => {
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await getListSystemMaterial(0, 10);
      setMaterialItems(response.content);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài liệu:", error);
    }
    setLoading(false);
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const getFileIcon = (name: string, type: string) => {
    if (type === "FOLDER")
      return <FaFolder className="text-yellow-500 text-[30px]" />;
    const extension = name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaFilePdf className="text-red-500 text-[30px] flex-shrink-0" />;
      case "doc":
      case "docx":
        return (
          <FaFileWord className="text-blue-500 text-[30px] flex-shrink-0" />
        );
      default:
        return (
          <FaFileAlt className="text-gray-500 text-[30px] flex-shrink-0" />
        );
    }
  };
  return (
    <div>
      {/* Thanh điều hướng chuyển đổi chế độ xem */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-3 mx-1 rounded-lg transition ${
              viewMode === "grid"
                ? "bg-primary-dark hover:bg-hover-primary text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <FaThLarge size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-3 mx-1 rounded-lg transition ${
              viewMode === "list"
                ? "bg-primary-dark hover:bg-hover-primary text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <FaList size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-2">
          {materialItems.map((item) => (
            <div
              key={item.id}
              className="relative bg-white p-5 rounded-xl transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center">
                {getFileIcon(item.name, item.type)}
                <div className="pl-3 flex-1">
                  <p
                    className="font-semibold text-gray-800 text-sm md:text-base truncate w-40"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.uploadedBy.name}
                  </p>
                </div>
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <FaEllipsisV className="text-gray-600" />
                </button>
              </div>
              {activeDropdown === item.id && (
                <div
                  ref={dropdownRef}
                  className="absolute top-12 right-4 w-40 bg-white border rounded-md z-10 animate-fade-in"
                >
                  <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                    Chỉnh sửa
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                    Sao chép
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-100">
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {materialItems.map((item) => (
            <div
              key={item.id}
              className="relative flex items-center justify-between bg-white p-5 rounded-xl transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                {getFileIcon(item.name, item.type)}
                <div>
                  <p
                    className="font-semibold text-gray-800 text-sm md:text-base truncate w-60"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.uploadedBy.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleDropdown(item.id)}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <FaEllipsisV className="text-gray-600" />
              </button>
              {activeDropdown === item.id && (
                <div
                  ref={dropdownRef}
                  className="absolute top-12 right-4 w-40 bg-white border rounded-md z-50 animate-fade-in"
                >
                  <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                    Chỉnh sửa
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                    Sao chép
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-100">
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsGrid;
