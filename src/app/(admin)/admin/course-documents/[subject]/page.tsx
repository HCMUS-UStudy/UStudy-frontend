"use client";

import Button from '@/app/ui/components/button';
import React, { useState, useEffect, useRef } from 'react';
import { FaFolder, FaEllipsisV } from 'react-icons/fa';
import ReactDOM from 'react-dom';

// Define the structure for the params object
interface Params {
  subject: string;
}

const foldersBySubject: {
  'Toán học': { id: number; name: string; description: string }[];
  'Ngữ văn': { id: number; name: string; description: string }[];
} = {
  'Toán học': [
    { id: 1, name: 'Chapter 1', description: 'Introduction to Algebra' },
    { id: 2, name: 'Chapter 2', description: 'Quadratic Equations' },
    { id: 3, name: 'Exercises', description: 'Practice problems and answers' },
    { id: 4, name: 'Chapter 3', description: 'Linear Equations' },
    { id: 5, name: 'Chapter 4', description: 'Polynomials' },
    { id: 6, name: 'Chapter 5', description: 'Factorization' },
    { id: 7, name: 'Chapter 6', description: 'Geometry' },
    { id: 8, name: 'Chapter 7', description: 'Trigonometry' },
    { id: 9, name: 'Chapter 8', description: 'Calculus' },
    { id: 10, name: 'Chapter 9', description: 'Statistics' },
    { id: 11, name: 'Chapter 10', description: 'Probability' },
    { id: 12, name: 'Chapter 11', description: 'Differential Equations' },
  ],
  'Ngữ văn': [
    { id: 1, name: 'Chapter 1', description: 'Literature basics' },
    { id: 2, name: 'Chapter 2', description: 'Poetry' },
    { id: 3, name: 'Chapter 3', description: 'Drama' },
    { id: 4, name: 'Chapter 4', description: 'Prose' },
    { id: 5, name: 'Chapter 5', description: 'Novels' },
  ],
};

const CourseDocumentsPage = ({ params }: { params: Promise<Params> }) => {
  const [subject, setSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedFolders, setSelectedFolders] = useState<Set<number>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [allSelected, setAllSelected] = useState(false); // Track select all state
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const foldersPerPage = 5;

  // Resolve params asynchronously using React.use
  useEffect(() => {
    params.then((resolvedParams) => {
      if (resolvedParams?.subject) {
        const decodedSubject = decodeURIComponent(resolvedParams.subject);
        setSubject(decodedSubject);
      }
    });
  }, [params]);

  const toggleDropdown = (id: number, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setActiveDropdown(activeDropdown === id ? null : id);
  };


  useEffect(() => {
    // Close dropdown if clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderDropdown = (id: number) => {
    return ReactDOM.createPortal(
      activeDropdown === id && (
        <div
          ref={dropdownRef} // Attach the ref to the dropdown element
          className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Cut</button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Copy</button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Move to</button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Rename</button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">Delete</button>
        </div>
      ),
      document.body
    );
  };

  const renderBreadcrumb = () => {
    if (!subject) return null; // Wait until the subject is set
    return (
      <div className="mb-4 text-gray-700">
        <span className="text-sm">
          <a href="/admin/courses" className=" text-black hover:text-blue-600 hover:underline mr-2">Quản lý môn học</a>
          {' > '}
          <a href={`/admin/course-documents/${subject}`} className="text-blue-600 hover:underline ml-2">{subject}</a>
        </span>
      </div>
    );
  };

  const handleSelectFolder = (id: number) => {
    setSelectedFolders((prevSelectedFolders) => {
      const newSelectedFolders = new Set(prevSelectedFolders);
      if (newSelectedFolders.has(id)) {
        newSelectedFolders.delete(id);
      } else {
        newSelectedFolders.add(id);
      }
      return newSelectedFolders;
    });
  };

  const handleSelectButtonClick = () => {
    setIsSelectMode((prev) => {
      if (prev) {
        setSelectedFolders(new Set());
      }
      return !prev;
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedFolders(new Set());
    } else {
      setSelectedFolders(new Set(paginatedFolders.map((folder) => folder.id))); // Select all folders on the current page
    }
    setAllSelected(!allSelected);
  };

  // Safely access folders by subject using type assertion
  const filteredFolders = (foldersBySubject[subject as keyof typeof foldersBySubject] || []).filter((folder) => {
    const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase()) || folder.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter ? folder.name.toLowerCase().includes(selectedFilter.toLowerCase()) : true;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredFolders.length / foldersPerPage);
  const startIndex = (currentPage - 1) * foldersPerPage;
  const paginatedFolders = filteredFolders.slice(startIndex, startIndex + foldersPerPage);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (!subject) return <div>Loading...</div>; // Show loading state while waiting for the subject

  const handleAttachmentClick = (subject: string, chapter: string) => {
    return `/admin/course-documents/${encodeURIComponent(subject)}/${encodeURIComponent(chapter)}`;
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {renderBreadcrumb()}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {subject}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center space-x-4 mb-6">
        {/* Select Mode Button */}
        <div className='flex'>
          <Button onClick={handleSelectButtonClick} className="mr-4">
            {isSelectMode ? 'Cancel' : 'Select Folders'}
          </Button>

          {/* Conditional buttons for Delete All and Move All */}
          {isSelectMode && (
            <div className="flex">
              <Button onClick={handleSelectAll} className="bg-sky-400 text-white mr-2">
                {allSelected ? 'Unselect All' : 'Select All'}
              </Button>
              <Button className="bg-red-500 text-white mr-2">Delete All</Button>
              <Button className="bg-green-500 text-white">Move All</Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search folders"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Chapters</option>
            <option value="Chapter">Chapter</option>
            <option value="Exercises">Exercises</option>
          </select>
        </div>
      </div>


      {/* Folders Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {paginatedFolders.map((folder) => (
          <div key={folder.id} className="relative flex items-center p-3 rounded-xl shadow-lg bg-white group">
            <div className="text-blue-400 mr-4">
              <FaFolder className="text-6xl" />
            </div>
            <div className="flex flex-col justify-center h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{folder.name}</h2>
              <p className="text-gray-600 text-sm">{folder.description}</p>
            </div>
            <button onClick={(e) => toggleDropdown(folder.id, e)} className="ml-auto text-gray-400 hover:text-gray-600">
              <FaEllipsisV />
            </button>
            {renderDropdown(folder.id)}

            {/* Select Checkbox (only shown in select mode) */}
            {isSelectMode && (
              <div className="absolute top-2 right-10">
                <input
                  type="checkbox"
                  checked={selectedFolders.has(folder.id)}
                  onChange={() => handleSelectFolder(folder.id)}
                />
              </div>
            )}

            {/* Hover Overlay */}
            {!isSelectMode && (
              <div className="absolute inset-0 bg-gray-300 bg-opacity-90 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                  className="text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
                  onClick={() => window.location.href = handleAttachmentClick(subject as string, folder.name)}
                >
                  View Folder
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-6 mr-6 space-x-2">
        <Button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${currentPage === 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {totalPages === 1 ? (
          <button
            key={1}
            onClick={() => setCurrentPage(1)}
            className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${currentPage === 1
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            1
          </button>
        ) : (
          Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
            const page = Math.min(totalPages - 2, Math.max(1, currentPage - 1)) + index;
            return (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${currentPage === page
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {page}
              </button>
            );
          })
        )}

        <Button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${currentPage === totalPages
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

    </div>
  );
};

export default CourseDocumentsPage;