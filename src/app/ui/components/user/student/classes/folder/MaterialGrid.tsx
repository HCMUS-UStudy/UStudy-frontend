"use client";

import { getMaterialsByParent } from "@/app/lib/services/material";
import { MaterialItem } from "@/app/types/type";
import Loading from "@/app/ui/components/_common/Loading";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  FaFolder,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaThLarge,
} from "react-icons/fa";
import { FaList } from "react-icons/fa6";

interface MaterialGridProps {
  classId: string;
  folderId: string;
}

const MaterialGrid: React.FC<MaterialGridProps> = ({ classId, folderId }) => {
  const [materialItem, setMaterialItem] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(
    Array.isArray(folderId) ? folderId[0] : folderId || null,
  );

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [folderHistory, setFolderHistory] = useState<
    { id: string; name: string }[]
  >([]);

  const fetchMaterial = async (parentId: string | null) => {
    if (!parentId) return;
    setLoading(true);
    setError("");
    try {
      const response = await getMaterialsByParent(
        0,
        10,
        classId as string,
        parentId,
      );
      setMaterialItem(response.content);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải thông tin tài liệu.");
    } finally {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId && currentFolderId) {
      fetchMaterial(currentFolderId);
    }
  }, [classId, currentFolderId]);

  const handleFolderClick = (folderId: string, folderName: string) => {
    setFolderHistory((prev) => [
      ...prev,
      { id: currentFolderId!, name: folderName },
    ]);
    setCurrentFolderId(folderId);
  };

  const getFileIcon = (name: string, type: string) => {
    if (type === "FOLDER")
      return <FaFolder className="text-yellow-500 text-[25px]" />;
    const extension = name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaFilePdf className="text-red-500 text-[25px] flex-shrink-0" />;
      case "doc":
      case "docx":
        return (
          <FaFileWord className="text-blue-500 text-[25px] flex-shrink-0" />
        );
      default:
        return (
          <FaFileAlt className="text-gray-500 text-[25px] flex-shrink-0" />
        );
    }
  };

  const getThumbnail = (name: string, type: string) => {
    const extension = name.split(".").pop()?.toLowerCase();
    if (type === "FOLDER") return "/images/folder-thumbnail.png";
    if (["pdf"].includes(extension || "")) return "/images/pdf-thumbnail.png";
    if (["doc", "docx"].includes(extension || ""))
      return "/images/doc-thumbnail.png";
    if (["jpg", "jpeg", "png"].includes(extension || ""))
      return `/uploads/${name}`;
    return "/images/file-thumbnail.png";
  };

  if (!currentFolderId) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy thông tin tài liệu.
      </div>
    );
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-2">
      <div className="mb-4 text-gray-700 flex items-center space-x-2">
        {folderHistory.length > 0 && (
          <span
            onClick={() => {
              setFolderHistory([]);
              setCurrentFolderId(
                Array.isArray(folderId) ? folderId[0] : folderId || null,
              );
            }}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            Gốc
          </span>
        )}
        {folderHistory.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <span className="text-gray-400">/</span>
            <span
              onClick={() => {
                setCurrentFolderId(folder.id);
                setFolderHistory(folderHistory.slice(0, index));
              }}
              className="cursor-pointer text-blue-500 hover:underline"
            >
              {folder.name}
            </span>
          </React.Fragment>
        ))}
        {currentFolderId && (
          <>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">Hiện tại</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold">Tài liệu lớp học</h2>
      </div>

      <div className="flex items-center justify-between mt-2 gap-14 ml-4">
        <SearchField
          className="w-full bg-primary-lighter py-[2px] rounded-2xl"
          placeholder="Tìm kiếm tài liệu..."
        />
        <div className="flex items-center gap-6 px-4">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-600"
            }`}
          >
            <FaThLarge />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-600"
            }`}
          >
            <FaList />
          </button>
        </div>
      </div>

      {materialItem.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          Không có tài liệu hoặc thư mục nào.
        </div>
      ) : viewMode === "grid" ? (
        <div className="px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {materialItem.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() =>
                item.type === "FOLDER"
                  ? handleFolderClick(item.id, item.name)
                  : null
              }
            >
              <div className="flex items-center justify-start mb-3">
                {getFileIcon(item.name, item.type)}
                <span
                  className="text-sm text-gray-700 truncate max-w-[150px] ml-3"
                  title={item.name}
                >
                  {item.name}
                </span>
              </div>
              <Image
                src={getThumbnail(item.name, item.type)}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg mx-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 space-y-4">
          {materialItem.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all"
              onClick={() =>
                item.type === "FOLDER"
                  ? handleFolderClick(item.id, item.name)
                  : null
              }
            >
              {getFileIcon(item.name, item.type)}
              <div className="flex-1">
                <span
                  className="text-sm text-gray-700 truncate block"
                  title={item.name}
                >
                  {item.name}
                </span>
              </div>
              <Image
                src={getThumbnail(item.name, item.type)}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialGrid;
