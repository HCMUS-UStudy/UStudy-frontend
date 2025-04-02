import { MdArrowForwardIos } from "react-icons/md";
import { toast } from "react-toastify";

import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheck, FaTimes } from "react-icons/fa";

import {
  TbFolders,
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypePdf,
  TbFileTypePpt,
  TbFileTypeTxt,
  TbFileTypeZip,
  TbFilePlus,
  TbFolderPlus,
} from "react-icons/tb";
import {
  getMaterialsByClassId,
  getMaterialsByParent,
  downloadSystemMaterial,
  downloadPersonalMaterial,
  uploadClassMaterial,
  createFolder,
  deleteClassMaterial,
} from "@/app/lib/services/class-material"; // API này chắc chắn có
import { useEffect, useState } from "react";
import { MaterialItem, UserData } from "@/app/types/type";
import { getUserDataFromCookies } from "@/app/lib/action";
import { Input } from "../../_common/text-field/Input";

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

const SingleMaterial = ({
  classId,
  material,
  parentId,
  isExpanded,
  onToggleExpand,
  setFolderContents,
}: {
  classId: string;
  material: MaterialItem;
  parentId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  setFolderContents: React.Dispatch<
    React.SetStateAction<Map<string, MaterialItem[]>>
  >;
}) => {
  const type = material.name.split(".").pop();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserDataFromCookies();
      setUser(userInfo);
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteClassMaterial(classId, material.id, parentId || "");
      setShowDeleteModal(false);

      if (parentId) {
        const response = await getMaterialsByParent(0, 100, classId, parentId);
        setFolderContents(
          (prev) => new Map(prev.set(parentId, response.content)),
        );
      }
      toast.success("Xóa tài liệu thành công", {
        autoClose: 2500,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Không thể xóa tài liệu", {
        autoClose: 2500,
        pauseOnHover: false,
      });
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await (material.materialType === "PERSONAL"
        ? downloadPersonalMaterial(material.id)
        : downloadSystemMaterial(material.id));

      if (!(blob instanceof Blob)) {
        throw new Error("Invalid file format received");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = material.name;
      a.click();
    } catch (error) {
      console.error("Error downloading material:", error);
    }
  };

  return (
    <div className="py-4">
      {material.type == "FOLDER" ? (
        <div
          className="flex gap-12 items-center px-2 cursor-pointer w-fit group"
          onClick={onToggleExpand}
        >
          <div className="flex text-[17px]">
            <TbFolders className="text-[25px] text-yellow-500 mr-2" />
            {material.name}
          </div>
          <div
            className={`flex justify-center items-center text-black 
            rounded-2xl h-fit transition-all duration-500 w-fit group-hover:text-primary-darkest`}
          >
            <MdArrowForwardIos className={`${isExpanded ? "rotate-90" : ""}`} />
          </div>
        </div>
      ) : (
        <div className="flex px-2 gap-16 mr-8">
          <div
            className="flex cursor-pointer hover:text-primary-darkest w-fit"
            onClick={handleDownload} // Hàm xử lý tải tài liệu
          >
            {fileTypeIcons.find((item) => item.type === type)?.icon}
            {material.name}
          </div>
          {user?.genId === material.uploadedBy?.genId && (
            <RiDeleteBin6Line
              className="text-red-600 text-[22px] cursor-pointer hover:text-red-800"
              onClick={() => setShowDeleteModal(true)} // Hàm xử lý xóa tài liệu
            />
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa tài liệu này không?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ClassMaterial = ({ classId }: { classId: string }) => {
  const [materials, setMaterials] = useState([] as MaterialItem[]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]); // Lưu các thư mục mở
  const [folderContents, setFolderContents] = useState<
    Map<string, MaterialItem[]>
  >(new Map());

  const [newFolder, setNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const toggleFolder = async (folderId: string) => {
    // Kiểm tra thư mục đã được mở chưa
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders((prevState) =>
        prevState.filter((id) => id !== folderId),
      );
    } else {
      setExpandedFolders((prevState) => [...prevState, folderId]);
      // Kiểm tra xem nội dung thư mục đã được tải chưa
      if (!folderContents.has(folderId)) {
        try {
          const response = await getMaterialsByParent(
            0,
            100,
            classId,
            folderId,
          ); // API lấy tài liệu con của thư mục
          setFolderContents(
            (prevMap) => new Map(prevMap.set(folderId, response.content)),
          );
          console.log("Folder contents:", folderContents);
        } catch (error) {
          console.error("Error fetching folder contents:", error);
        }
      }
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await getMaterialsByClassId("", 0, classId);
      //sort by name
      response.content.sort((a, b) => {
        if (a.type === "FOLDER" && b.type !== "FOLDER") return -1;
        if (a.type !== "FOLDER" && b.type === "FOLDER") return 1;
        return a.name.localeCompare(b.name);
      });
      setMaterials([...response.content]);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [classId]);

  const renderMaterials = (
    material: MaterialItem,
    classId: string,
    parentId: string,
  ) => {
    if (!material || !material.id) return null;
    return (
      <div className="ml-10 mr-2" key={material.id}>
        <SingleMaterial
          classId={classId}
          material={material}
          parentId={parentId}
          isExpanded={expandedFolders.includes(material.id)} // Kiểm tra xem thư mục có mở không
          onToggleExpand={() => toggleFolder(material.id)} // Hàm xử lý nhấn vào thư mục
          setFolderContents={setFolderContents}
        />
        {/* Nếu thư mục được mở, hiển thị tài liệu con */}
        <div
          className={`transition-transform duration-300 origin-top ease-in-out overflow-hidden ${
            expandedFolders.includes(material.id) &&
            folderContents.has(material.id)
              ? "scale-y-100"
              : "scale-y-0 h-0"
          }`}
        >
          <div className="ml-6">
            {folderContents.get(material.id)?.length !== 0 &&
              folderContents.get(material.id)?.map((child) => (
                <div key={child.id}>
                  {renderMaterials(child, classId, material.id)}{" "}
                  {/* Đệ quy để hiển thị tài liệu con */}
                </div>
              ))}
            <label
              className="cursor-pointer ml-8 p-4 flex items-center text-[17px]
                 hover:text-primary-darkest w-fit"
            >
              <TbFilePlus className="text-[22px] mr-2" />
              <div className="flex items-center">Tải tài liệu lên</div>
              <input
                type="file"
                className="hidden"
                onChange={(event) => handleFileUpload(event, material.id)}
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    parentId: string,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("description", "Tài liệu mới");
    formData.append("file", file);
    formData.append("parentId", parentId);

    try {
      await uploadClassMaterial(formData, parentId, classId);
      if (parentId) {
        const response = await getMaterialsByParent(0, 100, classId, parentId);
        setFolderContents(
          (prev) => new Map(prev.set(parentId, response.content)),
        );
      } else {
        fetchMaterials();
      }
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

  const handleNewFolder = () => {
    setNewFolder(true);
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await createFolder(classId, name);
      await fetchMaterials();
      toast.success("Tạo thư mục thành công", {
        autoClose: 2500,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error uploading material:", error);
      toast.error("Tạo thư mục thất bại", {
        autoClose: 2500,
        pauseOnHover: false,
      });
    }
  };

  return (
    // <div className="flex flex-col border border-gray-200 shadow-sm rounded-3xl p-2">
    //   <div className="flex justify-between bg-white py-4 px-6">
    //     <div className="flex items-center">
    //       <h2 className="flex items-center text-[22px] font-bold">
    //         📂 Tài liệu
    //       </h2>
    //     </div>
    //     <div
    //       className={`flex justify-center items-center p-3 bg-gray-50 border border-gray-200 text-primary-darkest
    //       rounded-2xl cursor-pointer h-fit hover:border-primary-darkest transition-transform duration-300 ${showDetail ? "rotate-90" : ""} `}
    //       onClick={() => setShowDetail(!showDetail)}
    //     >
    //       <MdArrowForwardIos />
    //     </div>
    //   </div>
    //   <div
    //     className={`bg-white ease-in-out overflow-y-auto transition-transform origin-top duration-300 ${
    //       showDetail ? "scale-y-100" : "scale-y-0 h-0"
    //     }`}
    //   >
    <>
      {materials.map((material) => renderMaterials(material, classId, ""))}{" "}
      {newFolder && (
        <div className="ml-8 mb-4 p-3 flex items-center text-[17px]">
          <TbFolders className="text-[25px] text-yellow-500 mr-2" />
          <Input
            placeholder="Tên thư mục"
            className="w-56"
            value={newFolderName}
            onChange={(event) => setNewFolderName(event.target.value)}
            onEnter={() => {
              handleCreateFolder(newFolderName);
              setNewFolder(false);
              setNewFolderName("");
            }}
          />
          <div className="flex items-center gap-1 ml-4">
            <FaCheck
              className="text-green-600 text-[18px] cursor-pointer ml-2 hover:text-green-800"
              onClick={() => {
                handleCreateFolder(newFolderName);
                setNewFolder(false);
                setNewFolderName("");
              }}
            />
            <FaTimes
              className="text-red-600 text-[18px] cursor-pointer ml-2 hover:text-red-800"
              onClick={() => {
                setNewFolder(false);
                setNewFolderName("");
              }}
            />
          </div>
        </div>
      )}
      {!newFolder && (
        <div
          className="cursor-pointer ml-8 mb-4 p-4 flex items-center text-[17px]
         hover:text-primary-darkest w-fit"
          onClick={handleNewFolder}
        >
          <TbFolderPlus className="text-[22px] mr-2" />
          Tạo thư mục
        </div>
      )}
    </>
    //   </div>
    // </div>
  );
};

export default ClassMaterial;
