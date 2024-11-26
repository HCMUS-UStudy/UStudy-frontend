"use client";

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setBranch, setBranches } from '../../store/branchSlice';
import axios from 'axios';
import '../styles/BranchSelector.css';

interface Branch {
  id: string;
  name: string;
  adress: string;
  contact_number: string;
}

const BranchSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { branches, selectedBranchId } = useSelector((state: RootState) => state.branch);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/branch/clerk/get-all", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("authToken"),
          },
          params: {
            page: 0,
            limit: 10,
          },
        });

        // Chỉ lấy `id` và `name`
        const branchData = response.data.content.map((branch: Branch) => ({
          id: branch.id,
          name: branch.name,
        }));

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
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='branch-select' ref={dropdownRef}>
      {branches.length > 0 ? (
        <div className='dropdown' onClick={() => setIsOpen(!isOpen)}>
          <div className='dropdown-selected'>
            {branches.find(branch => branch.id === selectedBranchId)?.name || 'Chọn chi nhánh'}
          </div>
          {isOpen && (
            <div className='dropdown-options'>
              {branches.map(branch => (
                <div
                  key={branch.id}
                  className='dropdown-option'
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
