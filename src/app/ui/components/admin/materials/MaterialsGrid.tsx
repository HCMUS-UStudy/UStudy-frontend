"use client";

import React, { useState, useEffect } from "react";
import {
  FaFolder,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import { MaterialItem } from "@/app/types";
import {
  downloadFile,
  getListSystemMaterial,
  getSystemMaterialByParent,
} from "@/app/lib/services/material";
import SearchField from "../../_common/text-field/SearchField";
import { Button } from "../../_common/Button";
import Image from "next/image";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import ConfirmModal from "../../_common/ConfirmModal";
import MaterialLoader from "./MaterialsLoader";

const MaterialsGrid: React.FC = () => {
  const [materialItem, setMaterialItem] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [folderHistory, setFolderHistory] = useState<
    { id: string; name: string }[]
  >([]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { addToast } = useCustomToast();

  const fetchRootMaterial = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getListSystemMaterial(0, 10);
      setMaterialItem(response.content);
      setCurrentFolderId(null); // Gốc không có folderId
    } catch (err) {
      console.error("Error fetching materials:", err);
      setError("Không thể tải thông tin tài liệu lớp học.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterial = async (parentId: string | null) => {
    if (!parentId) return;
    setLoading(true);
    setError("");
    try {
      const response = await getSystemMaterialByParent(parentId, 0, 10, "");
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
    fetchRootMaterial();
    return;
  }, []);

  const handleFolderClick = (folderId: string, folderName: string) => {
    setFolderHistory((prev) => [...prev, { id: folderId, name: folderName }]);
    setCurrentFolderId(folderId);
    fetchMaterial(folderId);
  };

  const handleDownloadFile = async (materialId: string, name: string) => {
    try {
      console.log(materialId);
      const response = await downloadFile(materialId);

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      addToast.error("Tải file thất bại!");
    }
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
          <FaFileWord className="text-primary-dark text-[25px] flex-shrink-0" />
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

  return (
    <div>
      <div className="mb-4 text-gray-700 flex items-center space-x-2">
        <span
          onClick={() => {
            setFolderHistory([]);
            setCurrentFolderId(null);
            fetchRootMaterial();
          }}
          className="cursor-pointer text-primary-dark hover:underline"
        >
          Gốc
        </span>
        {folderHistory.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <span className="text-gray-400">/</span>
            <span
              onClick={() => {
                const newHistory = folderHistory.slice(0, index);
                setFolderHistory(newHistory);
                setCurrentFolderId(folder.id);
                fetchMaterial(folder.id);
              }}
              className="cursor-pointer text-primary-dark hover:underline"
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

      <div className="flex items-center justify-between gap-14">
        <SearchField
          className="w-full bg-primary-lighter py-[2px] rounded-2xl"
          placeholder="Tìm kiếm tài liệu..."
        />
        <div className="flex">
          <Button
            onClick={() => setViewMode("grid")}
            className={`p-3 mx-1 rounded-lg transition ${
              viewMode === "grid"
                ? "bg-primary-dark hover:bg-hover-primary text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <FaThLarge size={15} />
          </Button>
          <Button
            onClick={() => setViewMode("list")}
            className={`p-3 mx-1 rounded-lg transition ${
              viewMode === "list"
                ? "bg-primary-dark hover:bg-hover-primary text-white"
                : "hover:bg-gray-200"
            }`}
          >
            <FaList size={15} />
          </Button>
        </div>
      </div>

      {loading ? (
        <MaterialLoader viewMode={viewMode} />
      ) : materialItem.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          Không có tài liệu hoặc thư mục nào.
        </div>
      ) : viewMode === "grid" ? (
        <div className="px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {materialItem.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => {
                if (item.type === "FOLDER") {
                  handleFolderClick(item.id, item.name);
                } else {
                  setSelectedFile({
                    id: item.id,
                    name: item.name,
                  }); // Lưu ID file cần tải
                  setIsConfirmOpen(true); // Hiển thị modal xác nhận
                }
              }}
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
                width={96}
                height={96}
                src={getThumbnail(item.name, item.type)}
                alt={item.name}
                className="object-cover rounded-lg mx-auto transition-transform duration-300 hover:scale-105"
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
              onClick={() => {
                if (item.type === "FOLDER") {
                  handleFolderClick(item.id, item.name);
                } else {
                  setSelectedFile({
                    id: item.id,
                    name: item.name,
                  }); // Lưu ID file cần tải
                  setIsConfirmOpen(true); // Hiển thị modal xác nhận
                }
              }}
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
                width={36}
                height={36}
                src={getThumbnail(item.name, item.type)}
                alt={item.name}
                className="object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (selectedFile) {
            handleDownloadFile(selectedFile.id, selectedFile.name);
          }
          setIsConfirmOpen(false);
        }}
        title="Xác nhận tải xuống"
        message="Bạn có chắc chắn muốn tải tài liệu này không?"
        type="confirm"
        confirmText="Tải xuống"
      />
    </div>
  );
};

export default MaterialsGrid;
