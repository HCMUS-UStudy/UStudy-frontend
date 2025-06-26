"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { setSelectedBranch, setBranches } from "../../../store/branch-slice";
import { TiArrowSortedDown } from "react-icons/ti";
import { Branch } from "@/app/types";
import { getUserDataFromCookies } from "@/app/lib/action";

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
        const userData = await getUserDataFromCookies();
        if (!userData?.branches) {
          console.error("No branches found in user data");
          return;
        }

        const branchData = [...userData.branches].sort((a: Branch, b: Branch) =>
          a.name.localeCompare(b.name),
        );

        dispatch(setBranches(branchData));

        if (branchData.length > 0) {
          dispatch(setSelectedBranch(branchData[0].id));
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };

    fetchBranches();
  }, [dispatch]);

  const handleBranchChange = (branchId: string) => {
    dispatch(setSelectedBranch(branchId));
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
          className="relative cursor-pointer rounded-[20px] select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="px-3 sm:px-4 py-1.5 md:py-[10px] rounded-xl md:rounded-[14px] bg-primary hover:bg-hover-primary gap-5 flex justify-between text-sm md:text-[15px] items-center transition-all">
            {branches.find((branch) => branch.id === selectedBranchId)?.name ||
              "Chọn chi nhánh"}
            <TiArrowSortedDown className="text-black" />
          </div>
          {isOpen && (
            <div
              className="absolute top-full mt-[4px] max-h-52 overflow-y-auto left-0 w-full
                  border border-gray-300 rounded-[10px] bg-white z-[1000] shadow-xl"
            >
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className={`px-4 py-2 text-sm md:text-base cursor-pointer hover:bg-primary-light transition-all ${
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
