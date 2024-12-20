"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV, FaFolder, FaSpinner } from "react-icons/fa";
import {Button} from "../Button";
import PaginationAdmin from "../paginationAdmin";
import { CourseItem, GradeItem } from "@/app/types/type";
import { getGradesByCourseId } from "@/app/lib/api";

interface GradeGridProps {
    courseId: string;
    subject: string;
    searchQuery: string
}

const GradeGrid: React.FC<GradeGridProps> = ({ searchQuery, courseId, subject}) => {
    const [grades, setGrades] = useState<GradeItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSelectMode] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const fetchGrades = async () => {
        let filteredData: GradeItem[] = [];
        setLoading(true);
        try {
            const response = await getGradesByCourseId(searchQuery, currentPage - 1, courseId);

            filteredData = response.content.map((item: CourseItem) => ({
                id: item.id,
                name: item.name
            }));

            //setGrades(response.data?.content || []);
            setTotalPages(response.data?.totalPages || 0);
        } catch (error) {
            console.error("Failed to fetch grades:", error);
        } finally {
            setGrades(filteredData);
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
    }, [courseId, currentPage, searchQuery]);

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
                                            window.location.href = `/admin/courses/course-documents/${encodeURIComponent(courseId)}/${encodeURIComponent(subject)}/${encodeURIComponent(grade.id)}/${encodeURIComponent(grade.name)}`
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
