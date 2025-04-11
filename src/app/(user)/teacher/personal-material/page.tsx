"use client";

import { useState, useEffect, useRef } from "react";
import { IoIosAdd } from "react-icons/io";
import { PiFolderPlus } from "react-icons/pi";
import {
  getMaterial,
  getPersonalMaterial,
  downloadPersonalMaterial,
} from "@/app/lib/services/personal-material";
import { MaterialItem } from "@/app/types/material";
import Loading from "@/app/ui/components/_common/loading/Loading";
import Tooltip from "@/app/ui/components/_common/Tooltip"; // Ensure this path is correct
import {
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypePdf,
  TbFileTypePpt,
  TbFileTypeTxt,
  TbFileTypeZip,
} from "react-icons/tb";

const fileTypeIcons = [
  {
    type: "pdf",
    icon: <TbFileTypePdf className="text-[25px] text-red-700 mr-2" />,
  },
  {
    type: "doc",
    icon: <TbFileTypeDoc className="text-[25px] text-blue-600 mr-2" />,
  },
  {
    type: "docx",
    icon: <TbFileTypeDocx className="text-[25px] text-blue-700 mr-2" />,
  },
  {
    type: "ppt",
    icon: <TbFileTypePpt className="text-[25px] text-red-800 mr-2" />,
  },
  {
    type: "pptx",
    icon: <TbFileTypePpt className="text-[25px] text-red-800 mr-2" />,
  },
  {
    type: "txt",
    icon: <TbFileTypeTxt className="text-[25px] text-gray-700 mr-2" />,
  },
  {
    type: "zip",
    icon: <TbFileTypeZip className="text-[25px] text-yellow-700 mr-2" />,
  },
];

export default function PersonalMaterial() {
  const [material, setMaterial] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const data = await getMaterial();
        setMaterial(
          data.content
            .filter((item: MaterialItem) => item.type == "FILE")
            .map((item: MaterialItem) => ({
              ...item,
              name: item.name.split("_").slice(1).join(" "),
            })),
        );
      } catch (error) {
        console.error("Error fetching material:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, []);

  const handleDownload = async (id: string, name: string) => {
    try {
      const blob = await downloadPersonalMaterial(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name; // Set the file name for download
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handlePreview = async (id: string) => {
    try {
      const blob = await getPersonalMaterial(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank"; // Open in new tab
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setActiveFile(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-4 p-3">
      <div className="flex items-center mb-4 gap-6">
        <div
          className="flex items-center justify-center flex-col gap-3 p-7 border cursor-pointer border-gray-300
          hover:bg-gray-100 shadow-sm rounded-2xl"
        >
          <IoIosAdd className="w-7 h-7" />
          <span className="hidden md:inline md:text-sm lg:text-[16px]">
            Tải tài liệu lên
          </span>
        </div>
        <div
          className="flex items-center justify-center flex-col gap-3 p-7 border cursor-pointer border-gray-300
          hover:bg-gray-100 shadow-sm rounded-2xl"
        >
          <PiFolderPlus className="w-7 h-7" />
          <span className="hidden md:inline md:text-sm lg:text-[16px]">
            Tạọ thư mục mới
          </span>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div>
          {material.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
              {material.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center py-4 pl-4 pr-3 border rounded-lg cursor-pointer
                    border-gray-200 shadow-sm hover:shadow-md 
                    ${activeFile === item.id ? "bg-slate-200 shadow-md" : ""}`}
                  onDoubleClick={() =>
                    item.name.endsWith(".pdf")
                      ? handlePreview(item.id)
                      : handleDownload(item.id, item.name)
                  }
                  onClick={() => setActiveFile(item.id)}
                >
                  {fileTypeIcons.map((icon, index) =>
                    item.name.endsWith(icon.type) ? (
                      <span key={`${item.id}-${index}`}>{icon.icon}</span>
                    ) : null,
                  )}
                  <span
                    className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap"
                    style={{ maxWidth: "100%" }}
                  >
                    {item.name}
                  </span>
                  <div className="ml-auto relative">
                    <Tooltip text="Tùy chọn">
                      <span className="py-1 px-3 rounded-full hover:bg-gray-200 text-lg">
                        ⋮
                      </span>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Không có tài liệu nào trong danh sách này.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
