"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BranchRootState } from "@/app/store/store";
import { setBranch, setBranches } from "../../store/branchSlice";
import { getAllBranches } from "@/app/lib/api";

interface Branch {
  id: string;
  name: string;
  adress: string;
  contact_number: string;
}

const BranchSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { branches, selectedBranchId } = useSelector(
    (state: BranchRootState) => state.branch
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranches(0, 20);
        const branchData = response.data.content.map((branch: Branch) => ({
          id: branch.id,
          name: branch.name,
        })).sort((a: Branch, b: Branch) => a.name.localeCompare(b.name));

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
    <div className="relative w-[200px]" ref={dropdownRef}>
      {branches.length > 0 ? (
        <div className="relative cursor-pointer rounded-[20px]" onClick={() => setIsOpen(!isOpen)}>
          <div className="p-2 border border-[#ccc] rounded-[12px] bg-[#f9f9f9]
                         flex justify-between items-center relative">
            {branches.find((branch) => branch.id === selectedBranchId)?.name ||
              "Chọn chi nhánh"}
            <span className="absolute right-2 top-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-800 transform -translate-y-1/2"></span>
          </div>
          {isOpen && (
            <div className="absolute top-full left-0 w-full border border-gray-300 rounded-[4px] bg-white z-[1000] shadow-lg">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="p-2 cursor-pointer hover:bg-[#f1f1f1]"
                  onClick={() => handleBranchChange(branch.id)}>
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
