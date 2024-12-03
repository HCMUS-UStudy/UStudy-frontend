"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEllipsisV, FaFolder, FaSpinner } from "react-icons/fa";
import {Button} from "./button";
import PaginationAdmin from "./paginationAdmin";

interface Grade {
    id: string;
    name: string;
}

interface GradeGridProps {
    courseId: string;
    subject: string;
    gradesPerPage?: number;
}

const GradeGrid: React.FC<GradeGridProps> = ({ courseId, subject, gradesPerPage = 5 }) => {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSelectMode] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const fetchGrades = async () => {
        setLoading(true);
        const authToken = localStorage.getItem("accessToken");
        try {
            const response = await axios.get("http://localhost:8080/api/grade/admin/get-grades-by-course", {
                params: {
                    page: currentPage - 1,
                    limit: gradesPerPage,
                    courseId,
                },
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setGrades(response.data?.content || []);
            setTotalPages(response.data?.totalPages || 0);
        } catch (error) {
            console.error("Failed to fetch grades:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = (id: string) => {
        setActiveDropdown(activeDropdown === id ? "" : id);
    };

    // const handleSelectGrade = (id: string) => {
    //     setSelectedGrades((prev) => {
    //         const updated = new Set(prev);
    //         updated.has(id) ? updated.delete(id) : updated.add(id);
    //         return updated;
    //     });
    // };

    const renderDropdown = (id: string) => {
        return (
            activeDropdown === id && (
                <div
                    ref={dropdownRef}
                    className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Cut
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Copy
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Delete
                    </button>
                </div>
            )
        );
    };

    useEffect(() => {
        fetchGrades();
    }, [courseId, currentPage]);

    return (
        <div>
            {/* Grades Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="flex items-center justify-center col-span-full">
                        <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
                        <span className="ml-4 text-lg text-blue-500">Loading...</span>
                    </div>
                ) : (
                    grades.map((grade) => (
                        <div
                            key={grade.id}
                            className="relative flex items-center p-4 rounded-xl shadow-lg bg-white group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-50">
                            {/* Folder Icon */}
                            <div className="flex items-center space-x-4">
                                <div className="text-blue-500">
                                    <FaFolder className="text-6xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">{grade.name}</h2>
                                </div>
                            </div>

                            {/* Dropdown Button */}
                            <Button
                                onClick={() => toggleDropdown(grade.id)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                                <FaEllipsisV />
                            </Button>
                            {renderDropdown(grade.id)}

                            {/* Hover Overlay */}
                            {!isSelectMode && (
                                <div className="absolute inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <Button
                                        className="text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
                                        onClick={() =>
                                            window.location.href = `/admin/course-documents/${encodeURIComponent(courseId)}/${encodeURIComponent(subject)}/${encodeURIComponent(grade.id)}/${encodeURIComponent(grade.name)}`
                                        }>
                                        Xem thư mục
                                    </Button>
                                </div>
                            )}
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

export default GradeGrid;
