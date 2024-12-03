"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEllipsisV, FaSpinner } from "react-icons/fa";
import { Button } from "./button";
import PaginationAdmin from "./paginationAdmin";
import { FaDownload, FaEye, FaFilePdf, FaFileWord } from "react-icons/fa6";

interface Document {
    id: number;
    fileName: string;
    filePath: string
}

interface DocumentGridProps {
    courseId: string;
    chapterId: string;
    documentsPerPage?: number;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ courseId, chapterId, documentsPerPage = 5 }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const fetchGrades = async () => {
        setLoading(true);
        if (!courseId) return;

        setLoading(true);
        const authToken = localStorage.getItem("accessToken");

        try {
            const response = await axios.get(
                "http://localhost:8080/api/material/all/get-materials",
                {
                    params: {
                        page: currentPage - 1,
                        limit: documentsPerPage,
                        chapterId
                    },
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            setDocuments(response.data?.content || []);
            setTotalPages(response.data?.totalPages || 0);

        } catch (error) {
            console.error("Failed to fetch grades:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = (id: number, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        });
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const renderDropdown = (id: number) => {
        return (
            activeDropdown === id && (
                <div
                    ref={dropdownRef}
                    className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                    style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                >
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Cut
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Copy
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Move to
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Rename
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Delete
                    </button>
                </div>
            )
        );
    };

    const getFileType = (title: string) => {
        const extension = title.split('.').pop()?.toLowerCase(); // Lấy phần mở rộng của tệp
        if (extension === 'pdf') return 'pdf';
        if (['doc', 'docx'].includes(extension || '')) return 'docx';
        return 'other'; // Mặc định cho các loại tệp không xác định
    };

    useEffect(() => {
        fetchGrades();
    }, [chapterId, currentPage]);

    return (
        <div>
            {/* Chapters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {loading ? (
                    <div className="flex items-center justify-center col-span-full">
                        <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
                        <span className="ml-4 text-lg text-blue-500">Loading...</span>
                    </div>
                ) : (documents.map((doc, index) => (
                    <div
                        key={doc.id || index}
                        className={`border p-4 rounded-lg shadow-md hover:shadow-lg transition`}>
                        <div className="flex items-center space-x-4 mb-3">
                            {getFileType(doc.fileName) === "pdf" ? (
                                <FaFilePdf className="text-red-500 text-3xl" />
                            ) : (
                                <FaFileWord className="text-blue-500 text-3xl" />
                            )}
                            <h3 className="font-semibold flex-1">{doc.fileName}</h3>

                            <button
                                className="text-gray-600"
                                onClick={(e) => toggleDropdown(index, e)}>
                                <FaEllipsisV />
                            </button>
                            {renderDropdown(doc.id)}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={() => window.open(doc.filePath, "_blank")}
                                className="bg-blue-500 text-white hover:bg-blue-600 transition p-2">
                                <FaEye className="text-white text-sm" />
                            </Button>
                            <Button
                                onClick={() => window.open(doc.filePath, "_blank")}
                                className="bg-green-500 text-white hover:bg-green-600 transition p-2">
                                <FaDownload className="text-white text-sm" />
                            </Button>
                        </div>
                    </div>
                ))
                )}
            </div>

            {/* Pagination */}
            <PaginationAdmin
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                handlePreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                handleNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
        </div>
    );
};

export default DocumentGrid;
