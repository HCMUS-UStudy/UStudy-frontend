"use client";

import { useState, useEffect, useRef } from "react";
import { IoIosAdd } from "react-icons/io";
import { PiFolderPlus } from "react-icons/pi";
import {
  getListMaterial,
  getListMaterialByParent,
  createFolder,
  createFolderByParent,
  getPreview,
  uploadMaterial,
  uploadMaterialByParent,
} from "@/app/lib/services/personal-material";
import { MaterialItem } from "@/app/types/material";
import Loading from "@/app/ui/components/_common/loading/Loading";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import {
  TbFolders,
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypePdf,
  TbFileTypePpt,
  TbFileTypeTxt,
  TbFileTypeZip,
} from "react-icons/tb";
import { MdOutlineFileDownload, MdDriveFileMoveOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { LuTrash2 } from "react-icons/lu";
import { IoReturnUpBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";

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
  const fileListRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen); // lắng nghe thay đổi kích thước

    return () => window.removeEventListener("resize", checkScreen); // cleanup
  }, []);

  const fetchMaterial = async (folderId: string | null = null) => {
    try {
      setMaterial([]); // Clear trước khi fetch mới
      setLoading(true);
      const data = folderId
        ? await getListMaterialByParent(folderId)
        : await getListMaterial();
      setMaterial(
        data.content
          .map((item: MaterialItem) => ({
            ...item,
            name:
              item.type === "FOLDER"
                ? item.name
                : item.name.split("_").slice(1).join(" "),
          }))
          .sort((a, b) =>
            a.type === "FOLDER" && b.type !== "FOLDER" ? -1 : 0,
          ),
      );
    } catch (error) {
      console.error("Error fetching material:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterial(currentFolderId);
  }, [currentFolderId]);

  const handleClickFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleCreateFolder = () => {
    setCreatingFolder(true);
    setNewFolderName("");
  };

  const handleSubmitNewFolder = async () => {
    console.log("Creating folder:", newFolderName);
    if (!newFolderName.trim()) return;
    try {
      if (currentFolderId) {
        await createFolderByParent(newFolderName, currentFolderId || null);
      } else {
        await createFolder(newFolderName);
      }
      toast.success("Tạo thư mục thành công", {
        autoClose: 2500,
        pauseOnHover: false,
        closeOnClick: true,
      });
      fetchMaterial(currentFolderId);
    } catch (error) {
      toast.error("Tạo thư mục thất bại", {
        autoClose: 2500,
        pauseOnHover: false,
        closeOnClick: true,
      });
      console.error("Error creating folder:", error);
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleViewFile = async (id: string) => {
    try {
      const blob = await getPreview(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      const materialItem = material.find((item) => item.id === id);
      if (materialItem) {
        link.download = materialItem.name;
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    parentId: string | null = null,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("description", "Tài liệu mới");
    formData.append("file", file);
    if (parentId) {
      formData.append("parentId", parentId);
    }

    try {
      if (parentId) {
        await uploadMaterialByParent(formData, parentId || null);
      } else {
        await uploadMaterial(formData);
      }

      fetchMaterial(currentFolderId);
      toast.success("Tải tài liệu lên thành công", {
        autoClose: 2500,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error uploading material:", error);
      toast.error("Tải tài liệu lên thất bại", {
        autoClose: 2500,
        pauseOnHover: false,
      });
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (fileListRef.current && !fileListRef.current.contains(target)) {
      setActiveFile(null);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // const handleCreateFolder = async () => {
  //   setMaterial((prev) => [
  //     ...prev,
  //     {
  //       id: "new-folder",
  //       name: "Thư mục mới",
  //       uploadedBy: {
  //         id: "user-id",
  //         genId: "user-gen-id",
  //         email: "user-email",
  //         name: "user-name",
  //       },
  //       materialType: "PERSONAL",
  //       type: "FOLDER",
  //     },
  //   ]);
  //   try {
  //     const response = await createFolder("Thư mục mới");
  //     console.log("Thư mục mới đã được tạo:", response.data);
  //   } catch (error) {
  //     console.error("Error creating folder:", error);
  //   }
  // };
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-4 p-3">
        <div className="flex items-center mb-4 gap-4">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center flex-col gap-3 p-5 border cursor-pointer border-gray-300
          hover:bg-gray-100 shadow-sm rounded-2xl"
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => handleFileUpload(e, currentFolderId || null)}
            />
            {isMobile ? (
              <Tooltip text="Tải tài liệu lên">
                <IoIosAdd className="w-7 h-7" />
              </Tooltip>
            ) : (
              <IoIosAdd className="w-7 h-7" />
            )}
            <span className="hidden px-[7px] md:inline md:text-[13px] lg:text-[15px]">
              Tải tài liệu lên
            </span>
          </label>
          <div
            className="flex items-center justify-center flex-col gap-3 p-5 border cursor-pointer border-gray-300
          hover:bg-gray-100 shadow-sm rounded-2xl"
            onClick={handleCreateFolder}
          >
            {isMobile ? (
              <Tooltip text="Tạo thư mục mới">
                <PiFolderPlus className="w-7 h-7" />
              </Tooltip>
            ) : (
              <PiFolderPlus className="w-7 h-7" />
            )}
            <span className="hidden md:inline md:text-[13px] lg:text-[15px]">
              Tạọ thư mục mới
            </span>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div>
            {currentFolderId && (
              <button onClick={() => setCurrentFolderId(null)}>
                <IoReturnUpBack
                  className="text-[25px] text-primary-dark
                  hover:text-primary-darkest"
                />
              </button>
            )}

            {material.length > 0 ? (
              <div
                ref={fileListRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              >
                {creatingFolder && (
                  <div
                    className="flex w-full items-center py-3 pl-4 pr-3 border rounded-xl 
                    shadow-sm border-primary-light bg-primary-lighter"
                  >
                    <TbFolders className="w-7 h-7 text-primary-darker" />
                    <input
                      autoFocus
                      value={newFolderName}
                      placeholder="Tên thư mục"
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmitNewFolder();
                        else if (e.key === "Escape") setCreatingFolder(false);
                      }}
                      className="flex w-full mx-4 text-sm border-b border-primary-darker focus:outline-none bg-transparent"
                    />
                    <div className="flex items-center gap-2">
                      <FaCheck
                        className="cursor-pointer text-green-600 hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubmitNewFolder();
                        }}
                      />
                      <FaTimes
                        className="cursor-pointer text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCreatingFolder(false);
                        }}
                      />
                    </div>
                  </div>
                )}
                {material.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center py-3 pl-4 pr-3 border rounded-xl cursor-pointer border-gray-200  
                    ${activeFile === item.id ? "bg-slate-200 shadow-md hover:shadow-lg" : "shadow-sm hover:shadow-md"}`}
                    onDoubleClick={() => {
                      setActiveFile(null);
                      if (item.type === "FOLDER") {
                        handleClickFolder(item.id);
                      } else {
                        handleViewFile(item.id);
                      }
                    }}
                    onClick={() => setActiveFile(item.id)}
                  >
                    {item.type === "FOLDER" ? (
                      <TbFolders className="text-[25px] text-primary-darker mr-2" />
                    ) : (
                      fileTypeIcons.map((icon, index) =>
                        item.name.endsWith(icon.type) ? (
                          <span key={`${item.id}-${index}`}>{icon.icon}</span>
                        ) : null,
                      )
                    )}
                    <span
                      className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap"
                      style={{ maxWidth: "100%" }}
                    >
                      {item.name}
                    </span>
                    <div className="ml-auto relative">
                      <Tooltip text="Tùy chọn">
                        <span
                          className={`py-1 px-3 rounded-full hover:bg-gray-200 
                          text-lg ${activeFile === item.id ? "hover:bg-slate-300" : ""}`}
                        >
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
      {activeFile && (
        <div className="flex items-center gap-2 w-full py-1 px-2 bg-white border rounded-full shadow-sm">
          <div className="cursor-pointer p-1 rounded-full hover:bg-gray-200">
            <RxCross2 className="text-[20px] text-gray-700" />
          </div>
          <div className="cursor-pointer p-1 rounded-full hover:bg-gray-200">
            <MdOutlineFileDownload className="text-[20px] text-gray-700" />
          </div>
          <div className="cursor-pointer p-1 rounded-full hover:bg-gray-200">
            <MdDriveFileMoveOutline className="text-[20px] text-gray-700" />
          </div>
          <div className="cursor-pointer p-1 rounded-full hover:bg-gray-200">
            <LuTrash2 className="text-[20px] text-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
}
