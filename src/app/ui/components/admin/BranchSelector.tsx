"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setBranch, setBranches } from "../../../store/branch-slice";
import { getAllBranches } from "@/app/lib/services/branch";
import { TiArrowSortedDown } from "react-icons/ti";

interface Branch {
  id: string;
  name: string;
  adress: string;
  contact_number: string;
}

const BranchSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { branches, selectedBranchId } = useSelector(
    (state: RootState) => state.branch,
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranches(0, 20);
        const branchData = response.data.content
          .map((branch: Branch) => ({
            id: branch.id,
            name: branch.name,
          }))
          .sort((a: Branch, b: Branch) => a.name.localeCompare(b.name));

        // Lưu vào Redux
        dispatch(setBranches(branchData));

        // Chọn chi nhánh đầu tiên nếu có dữ liệu
        if (branchData.length > 0) {
          dispatch(setBranch(branchData[0].id));
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };

    fetchBranches();
  }, [dispatch]);

  const handleBranchChange = (branchId: string) => {
    dispatch(setBranch(branchId));
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-fit" ref={dropdownRef}>
      {branches.length > 0 ? (
        <div
          className="relative cursor-pointer rounded-[20px]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="px-4 py-[10px] rounded-[14px] bg-primary hover:bg-hover-primary gap-5 flex justify-between text-[15px] items-center">
            {branches.find((branch) => branch.id === selectedBranchId)?.name ||
              "Chọn chi nhánh"}
            <TiArrowSortedDown className="text-black" />
          </div>
          {isOpen && (
            <div
              className="absolute top-full mt-[2px] max-h-52 overflow-y-auto left-0 w-full
                  border border-gray-300 rounded-[10px] bg-white z-[1000] shadow-xl"
            >
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-primary-light ${
                    branch.id === selectedBranchId ? "bg-primary-light" : ""
                  }`}
                  onClick={() => handleBranchChange(branch.id)}
                >
                  {branch.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Không có chi nhánh nào</p>
      )}
    </div>
  );
};

export default BranchSelector;
