"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IoIosAdd } from "react-icons/io";
import { PiFolderPlus } from "react-icons/pi";
import { useParams } from "next/navigation";
import {
  getListMaterial,
  createFolder,
  getPreview,
  downloadMaterial,
  uploadMaterial,
  deleteMaterial,
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
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";
import UploadModal from "@/app/ui/components/user/teacher/UploadModal";
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
  const [isMobile, setIsMobile] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [openOptionsId, setOpenOptionsId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const buttonRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [deleteItem, setShowDeleteModal] = useState<string | null>(null);

  const { classId } = useParams() as { classId: string };

  const [user, setUser] = useState<UserData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserDataFromCookies();
      setUser(userInfo);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
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

  const handleCreateFolder = useCallback(() => {
    setCreatingFolder(true);
    setNewFolderName("");
  }, []);

  const handleSubmitNewFolder = useCallback(async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder(classId, newFolderName, currentFolderId || null);
      toast.success("Tạo thư mục thành công", {
        autoClose: 2500,
        pauseOnHover: false,
        closeOnClick: true,
      });
      fetchMaterial();
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
  }, [newFolderName, currentFolderId, fetchMaterial, classId]);

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
        toast.error("Tải xuống thất bại", {
          autoClose: 2500,
          pauseOnHover: false,
          closeOnClick: true,
        });
      }
    },
    [material],
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return;
      const formData = new FormData();
      formData.append("description", "Tài liệu mới");
      formData.append("file", file);
      if (currentFolderId) {
        formData.append("parentId", currentFolderId);
      }
      try {
        await uploadMaterial(classId, formData);
        fetchMaterial();
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
    },
    [currentFolderId, fetchMaterial, classId],
  );

  const handleDelete = useCallback(async () => {
    try {
      await deleteMaterial(classId, deleteItem || "");
      fetchMaterial();
      toast.success("Xóa tài liệu thành công", {
        autoClose: 2500,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Xóa tài liệu thất bại", {
        autoClose: 2500,
        pauseOnHover: false,
      });
    }
  }, [fetchMaterial, deleteItem, classId]);

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
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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

    document.addEventListener("mousedown", handleClickOutsidePopUp);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopUp);
    };
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

    document.addEventListener("mousedown", handleClickOutsideCreateFolder);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCreateFolder);
    };
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
        {currentFolderId && (
          <div className="flex items-center gap-4 mb-2">
            <div
              onClick={() => {
                setShowUploadModal(true);
              }}
              className="flex items-center justify-center flex-col gap-3 p-4 border cursor-pointer border-gray-200
            hover:bg-primary-lighter shadow-sm rounded-2xl select-none"
            >
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
            </div>
            <div
              className="flex items-center justify-center flex-col gap-3 p-4 border cursor-pointer border-gray-200
            hover:bg-primary-lighter shadow-sm rounded-2xl select-none"
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
                Tạo thư mục mới
              </span>
            </div>
          </div>
        )}

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
                        handleDownload(activeFile.id);
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
              {creatingFolder && (
                <div
                  className="flex w-full items-center py-3 pl-4 pr-3 border rounded-xl 
                  shadow-md border-primary-light bg-primary-lighter"
                  ref={createFolderRef}
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
                    className="flex w-full mx-4 text-sm border-b border-primary-darker
                      focus:outline-none bg-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <Tooltip text="Xác nhận">
                      <FaCheck
                        className="cursor-pointer text-green-600 hover:text-green-700"
                        onClick={() => {
                          handleSubmitNewFolder();
                        }}
                      />
                    </Tooltip>
                    <Tooltip text="Hủy">
                      <FaTimes
                        className="cursor-pointer text-red-600 hover:text-red-700"
                        onClick={() => {
                          setCreatingFolder(false);
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              )}
              {material.length > 0
                ? material.map((item, index) => (
                    <div
                      ref={(el) => {
                        fileRef.current[index] = el;
                      }}
                      key={item.id}
                      className={`flex items-center py-3 pl-4 pr-3 border select-none rounded-xl cursor-pointer border-gray-200 
                      ${
                        activeFile?.id === item.id
                          ? `bg-primary-lighter shadow-md ${openOptionsId === item.id ? "" : "hover:shadow-lg"}`
                          : `${openOptionsId === item.id ? "shadow-md" : "shadow-sm hover:shadow-md"}`
                      }`}
                      onDoubleClick={() => {
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
                      onClick={() => setActiveFile(item)}
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
                      {item.material.uploadedBy.genId === user?.genId && (
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
                              {item.material.type !== "FOLDER" && (
                                <button
                                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                  onClick={() => {
                                    handleDownload(item.id);
                                    setOpenOptionsId(null);
                                  }}
                                >
                                  <MdOutlineFileDownload className="w-4 h-4 text-gray-700" />
                                  Tải xuống
                                </button>
                              )}
                              <button
                                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                onClick={() => {
                                  toast.info(
                                    "Chức năng đổi tên chưa được cài đặt",
                                  );
                                  setOpenOptionsId(null);
                                }}
                              >
                                <FiEdit3 className="w-4 h-4 text-gray-700" />
                                Đổi tên
                              </button>
                              <button
                                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                onClick={() => {
                                  setShowDeleteModal(item.id);
                                  setOpenOptionsId(null);
                                }}
                              >
                                <LuTrash2 className="w-4 h-4 text-gray-700" />
                                Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                : !creatingFolder && (
                    <div className="col-span-5 flex h-64 items-center justify-center text-gray-700">
                      Không có tài liệu nào.
                    </div>
                  )}
            </div>
          </>
        )}
      </div>
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
        />
      )}
      {deleteItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa tài liệu này không?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setShowDeleteModal(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => {
                  handleDelete();
                  setShowDeleteModal(null);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
