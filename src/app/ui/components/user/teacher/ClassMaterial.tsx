"use client";

import { MdArrowForwardIos } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { FcOpenedFolder } from "react-icons/fc";
import {
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypePdf,
  TbFileTypePpt,
} from "react-icons/tb";

import { getMaterialsByClassId } from "@/app/lib/services/material";
import { useEffect, useState } from "react";
import { MaterialItem } from "@/app/types/type";

const SingleMaterial = ({ material }: { material: MaterialItem }) => {
  return (
    <div
      className="text-primary-darker mx-2 py-5 px-4
    cursor-pointer hover:text-primary-darkest flex items-center"
    >
      {material.type == "FILE" && (
        <TbFileTypePdf className="text-[30px] text-red-700 mb-1" />
      )}
      {material.type === "doc" && (
        <TbFileTypeDoc className="text-[30px] text-blue-800 mb-1" />
      )}
      {material.type === "docx" && (
        <TbFileTypeDocx className="text-[30px] text-blue-800 mb-1" />
      )}
      {material.type === "ppt" && (
        <TbFileTypePpt className="text-[30px] text-red-800 mb-1" />
      )}
      {material.type == "FOLDER" && (
        <FcOpenedFolder className="text-[30px] text-yellow-800 mb-1" />
      )}{" "}
      {material.name}
    </div>
  );
};

const ClassMaterial = ({
  classId,
  showDetail,
  setShowDetail,
}: {
  classId: string;
  showDetail: boolean;
  setShowDetail: (value: boolean) => void;
}) => {
  const [materials, setMaterials] = useState([] as MaterialItem[]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await getMaterialsByClassId("", 0, classId);
        console.log(response);
        setMaterials(response.content);
      } catch {}
    };

    fetchMaterials();
  }, []);

  return (
    <div className="flex flex-col border border-gray-200 shadow-sm rounded-3xl p-2">
      <div className="flex justify-between bg-white py-4 px-6">
        <div className="flex items-center">
          <h2 className="flex items-center text-[22px] font-bold">
            📂 Tài liệu
          </h2>
        </div>
        <div
          className={`flex justify-center items-center p-3 bg-gray-50 border border-gray-200 text-primary-darkest
          rounded-2xl cursor-pointer h-fit hover:border-primary-darkest transition-transform duration-300 ${showDetail ? "rotate-90" : ""} `}
          onClick={() => setShowDetail(!showDetail)}
        >
          <MdArrowForwardIos />
        </div>
      </div>
      <div
        className={`bg-white ease-in-out duration-300 overflow-hidden transition-max-height ${
          showDetail ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="mt-2 border-t border-gray-300 mx-2 py-5 px-4">
          {materials.map((material) => (
            <SingleMaterial key={material.id} material={material} />
          ))}
        </div>
        <div
          className="text-primary-darker mx-2 py-5 px-4
        cursor-pointer hover:text-primary-darkest flex items-center"
        >
          <IoIosAdd className="text-[30px] text-purple-800 mb-1" />
          Tải tài liệu
        </div>
      </div>
    </div>
  );
};

export default ClassMaterial;
