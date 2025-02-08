"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { FaDownload, FaEye, FaFilePdf, FaFileWord } from "react-icons/fa6";
import { Button } from "@/app/ui/components/_common/Button";
import Pagination from "@/app/ui/components/_common/Pagination";
import { MaterialItem } from "@/app/types/type";
import { getMaterialsByChapterId } from "@/app/lib/services/material";
import Loading from "@/app/ui/components/_common/Loading";
import SearchField from "../../_common/text-field/SearchField";
import { Select, SelectItem } from "../../_common/Select";

interface DocumentGridProps {
  courseId: string;
  chapterId: string;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ courseId, chapterId }) => {
  const [documents, setDocuments] = useState<MaterialItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchMaterials = async () => {
    let filteredData: MaterialItem[] = [];
    setLoading(true);
    if (!courseId) return;

    try {
      const response = await getMaterialsByChapterId(
        searchQuery,
        currentPage - 1,
        chapterId,
      );

      filteredData = response.content.map((item: MaterialItem) => ({
        id: item.id,
        fileName: item.fileName,
        filePath: item.filePath,
      }));

      setTotalPages(response.data?.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    } finally {
      setDocuments(filteredData);
      setLoading(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? "" : id);
  };

  const renderDropdown = (id: string) =>
    activeDropdown === id && (
      <div
        ref={dropdownRef}
        className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
      >
        <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
          Cut
        </button>
        <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
          Copy
        </button>
        <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
          Move to
        </button>
        <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
          Rename
        </button>
        <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
          Delete
        </button>
      </div>
    );

  const getFileType = (title: string) => {
    const extension = title.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) return "image";
    if (extension === "pdf") return "pdf";
    if (["doc", "docx"].includes(extension || "")) return "docx";
    return "other";
  };

  useEffect(() => {
    fetchMaterials();
  }, [chapterId, currentPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="flex justify-end items-center space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          <SearchField
            className="w-[200px]"
            placeholder="Tìm kiếm theo tên tài liệu..."
            value={searchQuery} // Bind the value to searchQuery state
            onChange={handleSearchChange} // Handle input changes
          />
          <Select className="w-[200px]" defaultLabel="Tất cả tài liệu">
            <SelectItem value="">Tất cả tài liệu</SelectItem>
            <SelectItem value="chapter-1">Tài liệu DOCX</SelectItem>
            <SelectItem value="chapter-2">Tài liệu PDF</SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button type="button" className="pl-6 pr-6">
          Thêm tài liệu
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <Loading text="Loading..." />
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className={`border p-4 rounded-lg shadow-md hover:shadow-lg transition`}
            >
              <div className="flex items-center space-x-4 mb-3">
                {getFileType(doc.fileName) === "image" ? (
                  <img
                    src={doc.filePath}
                    alt={doc.fileName}
                    className="w-9 h-9 object-cover rounded"
                  />
                ) : getFileType(doc.fileName) === "pdf" ? (
                  <FaFilePdf className="text-red-500 text-4xl" />
                ) : (
                  <FaFileWord className="text-blue-500 text-4xl" />
                )}
                <h3 className="font-semibold flex-1">{doc.fileName}</h3>
                <button
                  className="text-gray-600"
                  onClick={() => toggleDropdown(doc.id)}
                >
                  <FaEllipsisV />
                </button>
                {renderDropdown(doc.id)}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => window.open(doc.filePath, "_blank")}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition p-2"
                >
                  <FaEye className="text-white text-sm" />
                </Button>
                <Button
                  onClick={() => window.open(doc.filePath, "_blank")}
                  className="bg-green-500 text-white hover:bg-green-600 transition p-2"
                >
                  <FaDownload className="text-white text-sm" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={(page) => setCurrentPage(page)}
        handlePreviousPage={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        handleNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      />
    </div>
  );
};

export default DocumentGrid;
