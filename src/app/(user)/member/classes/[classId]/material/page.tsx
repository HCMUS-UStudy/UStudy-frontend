"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  getListMaterial,
  getPreview,
  downloadMaterial,
} from "@/app/lib/services/class-material";
import { ClassMaterialItem, UserData } from "@/app/types";
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
  TbFileTypePng,
  TbFileTypeJpg,
} from "react-icons/tb";
import { FiEdit3 } from "react-icons/fi";

import {
  MdOutlineFileDownload,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { GrView } from "react-icons/gr";

import { RxCross2 } from "react-icons/rx";
import { LuTrash2 } from "react-icons/lu";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { getUserDataFromCookies } from "@/app/lib/action";
const fileTypeIcons = [
  {
    type: "pdf",
    icon: <TbFileTypePdf className="text-[25px] text-red-700" />,
  },
  {
    type: "doc",
    icon: <TbFileTypeDoc className="text-[25px] text-blue-600" />,
  },
  {
    type: "docx",
    icon: <TbFileTypeDocx className="text-[25px] text-blue-700" />,
  },
  {
    type: "ppt",
    icon: <TbFileTypePpt className="text-[25px] text-red-800" />,
  },
  {
    type: "pptx",
    icon: <TbFileTypePpt className="text-[25px] text-red-800" />,
  },
  {
    type: "txt",
    icon: <TbFileTypeTxt className="text-[25px] text-gray-700" />,
  },
  {
    type: "zip",
    icon: <TbFileTypeZip className="text-[25px] text-yellow-700" />,
  },
  {
    type: "jpg",
    icon: <TbFileTypeJpg className="text-[25px] text-slate-700" />,
  },
  {
    type: "jpeg",
    icon: <TbFileTypeJpg className="text-[25px] text-slate-700" />,
  },
  {
    type: "png",
    icon: <TbFileTypePng className="text-[25px] text-slate-700" />,
  },
];

export default function PersonalMaterial() {
  const [material, setMaterial] = useState<ClassMaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFile, setActiveFile] = useState<ClassMaterialItem | null>(null);
  const activeFileRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<(HTMLDivElement | null)[]>([]);
  const createFolderRef = useRef<HTMLDivElement>(null);
  const popUpFolderRef = useRef<HTMLDivElement>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [openOptionsId, setOpenOptionsId] = useState<string | null>(null);
  const buttonRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const { classId } = useParams() as { classId: string };

  const [user, setUser] = useState<UserData | null>(null);
  const { addToast } = useCustomToast();

  // Hiệu ứng double click
  const [doubleClickedId, setDoubleClickedId] = useState<string | null>(null);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserDataFromCookies();
      setUser(userInfo);
    };
    fetchData();
  }, []);

  const fetchMaterial = useCallback(async () => {
    try {
      setMaterial([]);
      setLoading(true);
      const data = await getListMaterial(classId, currentFolderId || null);
      const sortedData = data.content.sort(
        (a: ClassMaterialItem, b: ClassMaterialItem) => {
          if (a.material.type === "FOLDER" && b.material.type !== "FOLDER")
            return -1;
          if (a.material.type !== "FOLDER" && b.material.type === "FOLDER")
            return 1;
          return a.material.name.localeCompare(b.material.name);
        },
      );
      setMaterial(sortedData);
    } catch (error) {
      console.error("Error fetching material:", error);
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, classId]);

  useEffect(() => {
    fetchMaterial();
  }, [fetchMaterial]);

  const handleClickFolder = useCallback(
    (folderId: string, folderName: string) => {
      setCurrentFolderId(folderId);
      setBreadcrumb((prev) => [...prev, { id: folderId, name: folderName }]);
    },
    [],
  );

  const handleViewFile = useCallback(
    async (id: string, canViewFile: boolean = false) => {
      try {
        const blob = await getPreview(id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        if (canViewFile) {
          link.target = "_blank";
        } else {
          const materialItem = material.find((item) => item.id === id);
          if (materialItem) {
            link.download = materialItem.material.name;
          }
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    },
    [material],
  );

  const handleDownload = useCallback(
    async (id: string) => {
      try {
        const blob = await downloadMaterial(id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const materialItem = material.find((item) => item.id === id);
        if (materialItem) {
          link.download = materialItem.material.name;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        addToast.error("Tải xuống thất bại");
      }
    },
    [material, addToast],
  );

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    const clickedOutsideFileList = fileRef.current.every(
      (file) => file && !file.contains(target),
    );
    const clickedOutsideActiveFile =
      activeFileRef.current && !activeFileRef.current.contains(target);

    if (clickedOutsideFileList && clickedOutsideActiveFile) {
      setActiveFile(null);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutsidePopUp = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        openOptionsId &&
        popUpFolderRef.current &&
        !popUpFolderRef.current.contains(target)
      ) {
        setOpenOptionsId(null);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutsidePopUp);
      return () => {
        document.removeEventListener("mousedown", handleClickOutsidePopUp);
      };
    }
  }, [openOptionsId]);

  useEffect(() => {
    const handleClickOutsideCreateFolder = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        creatingFolder &&
        createFolderRef.current &&
        !createFolderRef.current.contains(target)
      ) {
        setCreatingFolder(false);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutsideCreateFolder);
      return () => {
        document.removeEventListener(
          "mousedown",
          handleClickOutsideCreateFolder,
        );
      };
    }
  }, [creatingFolder]);

  const [popUpLeft, setPopUpLeft] = useState(false);
  const toggleOptions = useCallback((id: string, index: number) => {
    if (buttonRefs.current) {
      const rect = buttonRefs.current[index]?.getBoundingClientRect();
      const popupWidth = 150;
      const screenWidth = window.innerWidth;
      if (rect) {
        setPopUpLeft(rect.right + popupWidth > screenWidth);
      }
    }
    setOpenOptionsId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="flex flex-col h-full justify-between px-2">
      <div className="flex flex-col gap-1 p-3">
        {activeFile ? (
          <div
            className="flex justify-between items-center w-full px-2 py-1 bg-white border
                rounded-full shadow-sm mb-2"
            ref={activeFileRef}
          >
            <div className={`flex items-center gap-5 `}>
              <Tooltip text="Hủy chọn">
                <div
                  className="cursor-pointer p-1 rounded-full hover:bg-gray-200"
                  onClick={() => setActiveFile(null)}
                >
                  <RxCross2 className="text-[20px] text-gray-700" />
                </div>
              </Tooltip>
              <div className="flex items-center gap-[6px]">
                <Tooltip text="Xem">
                  <div
                    className="cursor-pointer p-1 rounded-full hover:bg-gray-200"
                    onClick={() => {
                      setActiveFile(null);
                      if (activeFile.material.type === "FOLDER") {
                        handleClickFolder(
                          activeFile.id,
                          activeFile.material.name,
                        );
                      } else {
                        handleViewFile(
                          activeFile.material.id,
                          activeFile.material.name.endsWith("pdf"),
                        );
                      }
                    }}
                  >
                    <GrView className="text-[20px] text-gray-700" />
                  </div>
                </Tooltip>
                {activeFile.material.type !== "FOLDER" && (
                  <Tooltip text="Tải xuống">
                    <div
                      className="cursor-pointer p-1 rounded-full hover:bg-gray-200"
                      onClick={() => {
                        handleDownload(activeFile.material.id);
                        setActiveFile(null);
                      }}
                    >
                      <MdOutlineFileDownload className="text-[20px] text-gray-700" />
                    </div>
                  </Tooltip>
                )}
                {activeFile.material.uploadedBy.genId === user?.genId && (
                  <Tooltip text="Đổi tên">
                    <div className="cursor-pointer p-1 rounded-full hover:bg-gray-200">
                      <FiEdit3 className="text-[20px] text-gray-700" />
                    </div>
                  </Tooltip>
                )}
                {activeFile.material.uploadedBy.genId === user?.genId && (
                  <Tooltip text="Xóa">
                    <div className="cursor-pointer p-1 rounded-full hover:bg-gray-200">
                      <LuTrash2 className="text-[20px] text-gray-700" />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mr-2">
              <div className="items-center gap-2 hidden md:inline text-[14px]">
                <span className="hidden lg:inline"> Sửa đổi gần nhất </span>
                <span className="text-primary-darker">
                  {new Date(activeFile.material.uploadDate).toLocaleString(
                    "vi-VN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
              <div className="items-center gap-2 hidden md:inline text-[14px]">
                <span className="hidden lg:inline"> Đăng tải bởi </span>
                <span className="text-primary-darker">
                  {activeFile.material.uploadedBy.name}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 mb-2">
            {breadcrumb.length > 0 ? (
              <div className="flex items-center gap-2 px-1 flex-wrap text-[17px]">
                <span
                  className="cursor-pointer hover:bg-primary-lighter rounded-xl px-2"
                  onClick={() => {
                    setBreadcrumb([]);
                    setCurrentFolderId(null);
                  }}
                >
                  Tất cả tài liệu
                </span>
                {breadcrumb.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <MdOutlineArrowForwardIos className="text-gray-500" />
                    <span
                      className={`px-2 text-[17px] ${
                        index === breadcrumb.length - 1
                          ? "text-gray-700 font-semibold"
                          : "cursor-pointer hover:bg-primary-lighter rounded-xl"
                      }`}
                      onClick={() => {
                        const newBreadcrumb = breadcrumb.slice(0, index + 1);
                        setBreadcrumb(newBreadcrumb);
                        setCurrentFolderId(item.id);
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2 text-[17px]">
                <span className="text-gray-700 font-semibold">
                  Tất cả tài liệu
                </span>
              </div>
            )}
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {material.length > 0
                ? material.map((item, index) => (
                    <div
                      ref={(el) => {
                        fileRef.current[index] = el;
                      }}
                      key={item.id}
                      className={`flex items-center py-3 pl-4 pr-3 border rounded-xl cursor-pointer border-gray-200 
                        ${
                          doubleClickedId === item.id
                            ? "bg-primary-light scale-[1.03] shadow-xl transition-all duration-300"
                            : activeFile?.id === item.id
                              ? `bg-primary-lighter shadow-md ${openOptionsId === item.id ? "" : "hover:shadow-lg"}`
                              : `${openOptionsId === item.id ? "shadow-md" : "shadow-sm hover:shadow-md"}`
                        }`}
                      onClick={() => {
                        // Debounce single/double click
                        if (clickTimeout.current) {
                          clearTimeout(clickTimeout.current);
                          clickTimeout.current = null;
                        }
                        clickTimeout.current = setTimeout(() => {
                          setActiveFile(item);
                        }, 220);
                      }}
                      onDoubleClick={() => {
                        if (clickTimeout.current) {
                          clearTimeout(clickTimeout.current);
                          clickTimeout.current = null;
                        }
                        setDoubleClickedId(item.id);
                        setTimeout(() => setDoubleClickedId(null), 400);
                        setActiveFile(null);
                        if (item.material.type === "FOLDER") {
                          handleClickFolder(item.id, item.material.name);
                        } else {
                          handleViewFile(
                            item.material.id,
                            item.material.name.endsWith("pdf"),
                          );
                        }
                      }}
                    >
                      {item.material.type === "FOLDER" ? (
                        <TbFolders className="text-[25px] text-primary-darker mr-2" />
                      ) : (
                        fileTypeIcons.map((icon, index) =>
                          item.material.name.endsWith(icon.type) ? (
                            <span key={`${item.id}-${index}`} className="mr-2">
                              {icon.icon}
                            </span>
                          ) : null,
                        )
                      )}
                      <span
                        className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap"
                        style={{ maxWidth: "100%" }}
                      >
                        {item.material.name}
                      </span>
                      {item.material.type !== "FOLDER" && (
                        <div className="ml-auto relative">
                          <Tooltip text="Tùy chọn">
                            <span
                              ref={(el) => {
                                buttonRefs.current[index] = el;
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOptions(item.id, index);
                                if (activeFile?.id !== item.id) {
                                  setActiveFile(null);
                                }
                              }}
                              className={`py-1 px-3 rounded-full hover:bg-gray-200 
                            text-lg ${activeFile?.id === item.id ? "hover:bg-primary-light" : ""}`}
                            >
                              ⋮
                            </span>
                          </Tooltip>

                          {openOptionsId === item.id && (
                            <div
                              className={`absolute ${popUpLeft ? "right-0" : "left-0"} top-7 z-10 bg-white border
                              shadow-lg rounded-lg py-2 w-36`}
                              ref={popUpFolderRef}
                            >
                              <button
                                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                onClick={() => {
                                  handleDownload(item.material.id);
                                  setOpenOptionsId(null);
                                }}
                              >
                                <MdOutlineFileDownload className="w-4 h-4 text-gray-700" />
                                Tải xuống
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                : !creatingFolder && (
                    <div className="col-span-5 flex h-64 items-center justify-center text-gray-700 select-none">
                      Không có tài liệu nào.
                    </div>
                  )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
