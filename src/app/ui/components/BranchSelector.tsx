import { useState, useEffect, useRef } from 'react';
import '../styles/BranchSelector.css';

interface Branch {
  id: string;
  name: string;
}

interface BranchSelectorProps {
  onBranchChange: (branchId: string) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ onBranchChange }) => {
  const initialBranches: Branch[] = [
    { id: '1', name: 'Chi nhánh 1' },
    { id: '2', name: 'Chi nhánh 2' },
    { id: '3', name: 'Chi nhánh 3' },
  ];
  const [branches] = useState<Branch[]>(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (branches.length > 0) {
      setSelectedBranch(branches[0].id);
      onBranchChange(branches[0].id);
    }
  }, [branches, onBranchChange]);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    onBranchChange(branchId);
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
      <div className='dropdown' onClick={() => setIsOpen(!isOpen)}>
        <div className='dropdown-selected'>
          {branches.find(branch => branch.id === selectedBranch)?.name || 'Chọn chi nhánh'}
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
    </div>
  );
};

export default BranchSelector;
