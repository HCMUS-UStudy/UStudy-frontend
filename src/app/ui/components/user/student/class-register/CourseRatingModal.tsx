"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { Star, StarHalf, Loader2 } from "lucide-react";
import { getCourseGradeRatingsDetails } from "@/app/lib/services/rating";
import Pagination from "@/app/ui/components/_common/Pagination";
import { CourseGradeRatingDetail } from "@/app/types/rating";
import { PaginatedResponse } from "@/app/types";

interface CourseRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  gradeId: string;
  className: string;
}

export default function CourseRatingModal({
  isOpen,
  onClose,
  courseId,
  gradeId,
  className,
}: CourseRatingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<CourseGradeRatingDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalRatings, setTotalRatings] = useState(0);
  const limit = 10;

  const fetchRatings = useCallback(
    async (pageNum: number) => {
      try {
        setIsLoading(true);
        const response = await getCourseGradeRatingsDetails(
          courseId,
          gradeId,
          pageNum,
          limit,
        );

        if (response?.data?.content?.length) {
          const data =
            response.data as PaginatedResponse<CourseGradeRatingDetail>;
          setRatings(data.content);
          setTotalPages(data.totalPages);
          setTotalRatings(data.totalElements);
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
        setError("Error fetching ratings");
        setCurrentPage(1);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [courseId, gradeId, limit],
  );

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchRatings(pageNumber - 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchRatings(currentPage - 2);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchRatings(currentPage);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => {
        const starValue = i + 1;
        if (rating >= starValue) {
          return (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          );
        }
        if (rating > i && rating < starValue) {
          return (
            <StarHalf
              key={i}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          );
        }
        return <Star key={i} className="w-4 h-4 text-gray-300" />;
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchRatings(0);
    }
  }, [isOpen, fetchRatings]);

  return (
    <Dialog className="w-1/3" isOpen={isOpen} onClose={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>Đánh giá về lớp {className}</DialogHeader>

        <div
          className="flex-1 overflow-y-auto mt-2 mb-2"
          style={{
            scrollbarWidth: "thin", // Firefox
            scrollbarColor: "rgba(0,0,0,0.3) transparent", // Firefox
          }}
        >
          {isLoading && ratings.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có đánh giá nào cho môn học này.
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => {
                const avatarUrl = rating.ratedBy.avatar;
                const initial =
                  rating.ratedBy.name?.charAt(0).toUpperCase() || "?";

                return (
                  <div
                    key={rating.id}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={rating.ratedBy.name}
                            className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg border border-gray-300">
                            {initial}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-800">
                            {rating.ratedBy.name}
                          </p>
                          <div className="flex items-center">
                            {renderStars(rating.rating)}
                            <span className="ml-2 text-sm text-gray-600 font-medium">
                              {rating.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    {rating.comment && (
                      <p className="mt-3 text-gray-700 leading-relaxed">
                        {rating.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 pt-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageClick={handlePageClick}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
