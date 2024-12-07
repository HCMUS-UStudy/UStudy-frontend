"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV, FaSpinner } from "react-icons/fa";
import { Button } from "../button";
import PaginationAdmin from "../paginationAdmin";
import { FaDownload, FaEye, FaFilePdf, FaFileWord } from "react-icons/fa6";
import { MaterialItem } from "@/app/types/type";
import { getMaterialsByChapterId } from "@/app/lib/api";

interface DocumentGridProps {
    courseId: string;
    chapterId: string;
    searchQuery: string
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ searchQuery, courseId, chapterId }) => {
    const [documents, setDocuments] = useState<MaterialItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const fetchGrades = async () => {
        let filteredData: MaterialItem[] = [];
        setLoading(true);
        if (!courseId) return;

        try {
            const response = await getMaterialsByChapterId(searchQuery, currentPage - 1, chapterId);

            filteredData = response.content.map((item: MaterialItem) => ({
                id: item.id,
                fileName: item.fileName,
                filePath: item.filePath
            }))

            setTotalPages(response.data?.totalPages || 0);

        } catch (error) {
            console.error("Failed to fetch grades:", error);
        } finally {
            setDocuments(filteredData);
            setLoading(false);
        }
    };

    const toggleDropdown = (id: string) => {
        setActiveDropdown(activeDropdown === id ? "" : id);
    };

    const renderDropdown = (id: string) => {
        return (
            activeDropdown === id && (
                <div
                    ref={dropdownRef}
                    className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
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
    }, [chapterId, currentPage, searchQuery]);

    return (
        <div>
            {/* Chapters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {loading ? (
                    <div className="flex items-center justify-center col-span-full">
                        <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
                        <span className="ml-4 text-lg text-blue-500">Loading...</span>
                    </div>
                ) : (documents.map((doc) => (
                    <div
                        key={doc.id}
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
                                onClick={() => toggleDropdown(doc.id)}>
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
