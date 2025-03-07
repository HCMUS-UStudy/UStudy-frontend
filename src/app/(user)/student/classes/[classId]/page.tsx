"use client";

import { getClassById } from "@/app/lib/services/class";
import { getMaterialsByClassId } from "@/app/lib/services/material";
import { ClassUserItem, MaterialItem } from "@/app/types/type";
import Loading from "@/app/ui/components/_common/Loading";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaBullhorn,
  FaChevronDown,
  FaChevronUp,
  FaComments,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFolderOpen,
} from "react-icons/fa6";

const ClassDetail = () => {
  const params = useParams();
  const classId = Array.isArray(params.classId)
    ? params.classId[0]
    : params.classId;

  const [classDetail, setClassDetail] = useState<ClassUserItem>();
  const [materialItem, setMaterialItem] = useState<MaterialItem[]>([]);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false); // Track the state of the "Tổng quan" tab
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false); // Theo dõi trạng thái mở rộng tất cả
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [subject] = useState({
    name: "Toán học nâng cao",
    description:
      "Khóa học giúp củng cố kiến thức toán học từ cơ bản đến nâng cao, phù hợp với học sinh muốn cải thiện kỹ năng giải bài tập và nâng cao thành tích học tập.",
    overview: [
      {
        title: "Thông báo",
      },
      {
        title: "Diễn đàn thảo luận",
      },
      {
        title: "Giáo trình khóa học",
      },
    ],
    curriculum: [
      {
        title: "Tuần 1: Đại số tuyến tính",
        description: "Học về ma trận, định thức, và không gian vector.",
        materials: [
          {
            title: "Bài tập Đại số tuyến tính",
            description: "File PDF chứa bài tập và lời giải chi tiết.",
            link: "https://example.com/algebra-exercises.pdf",
          },
          {
            title: "Video hướng dẫn Đại số tuyến tính",
            description: "Video giải thích các khái niệm.",
            link: "https://example.com/algebra-video.mp4",
          },
        ],
      },
      {
        title: "Tuần 2: Giải tích",
        description: "Khám phá đạo hàm, tích phân, và ứng dụng thực tế.",
        materials: [
          {
            title: "Tài liệu Giải tích",
            description: "PDF hướng dẫn các khái niệm giải tích cơ bản.",
            link: "https://example.com/calculus-material.pdf",
          },
          {
            title: "Video hướng dẫn Giải tích",
            description: "Video minh họa các bài toán thực tế.",
            link: "https://example.com/calculus-video.mp4",
          },
        ],
      },
    ],
  });

  const fetchClassDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getClassById(classId as string);
      setClassDetail(response.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải thông tin lớp học.");
    } finally {
      console.log(loading);
      console.log(error);
      setLoading(false);
    }
  };

  const fetchMaterial = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMaterialsByClassId("", 0, classId as string);
      setMaterialItem(response.content);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải thông tin lớp học.");
    } finally {
      console.log(loading);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClassDetail();
      fetchMaterial();
    }
  }, [classId]);

  const toggleOverview = () => {
    setIsOverviewOpen(!isOverviewOpen);
  };

  const toggleRoute = () => {
    setIsRouteOpen(!isRouteOpen);
  };

  const toggleAllSections = () => {
    if (allExpanded) {
      setIsOverviewOpen(false);
      setIsRouteOpen(false);
    } else {
      setIsOverviewOpen(true);
      setIsRouteOpen(true);
    }
    setAllExpanded(!allExpanded); // Đổi trạng thái
  };

  if (!subject) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy thông tin môn học.
      </div>
    );
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-2">
      {/* Title Section */}
      <div className="border-b border-gray-300 pb-8">
        <h1 className="text-4xl font-bold text-primary-darker mb-4">
          {classDetail?.course?.name
            ? `Lớp ${classDetail?.name} - ${classDetail?.course?.name} ${classDetail.grade?.name}`
            : classDetail?.name}
        </h1>
        <p className="text-lg text-gray-700">{classDetail?.description}</p>
      </div>

      {/* Tổng quan Section */}
      <div className="mt-8 border-b border-gray-300 pb-6">
        {/* Toggle button to open/close the "Tổng quan" section */}
        <div className="flex justify-between">
          <div
            className="flex items-center cursor-pointer mb-6"
            onClick={toggleOverview}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-dark text-primary-dark mr-4 bg-primary-lighter hover:bg-primary-light transition-all">
              {isOverviewOpen ? (
                <FaChevronUp size={20} />
              ) : (
                <FaChevronDown size={20} />
              )}
            </span>
            <h2 className="text-2xl font-semibold text-highlight-text hover:text-[#FAB564] transition-all">
              Tổng quan
            </h2>
          </div>
          <button
            onClick={toggleAllSections}
            className="px-4 py-2 text-sm bg-primary-darkest text-white rounded-full hover:bg-hover-primary transition-all mb-6"
          >
            {allExpanded ? "Thu gọn tất cả" : "Mở rộng tất cả"}
          </button>
        </div>

        {/* Conditionally render the overview content based on isOverviewOpen state */}
        {isOverviewOpen && (
          <ul className="space-y-4">
            {subject.overview.map((section, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  {/* Render the icon based on the section title */}
                  {section.title === "Thông báo" && (
                    <FaBullhorn size={24} className="text-primary-dark mr-4" />
                  )}
                  {section.title === "Diễn đàn thảo luận" && (
                    <FaComments size={24} className="text-primary-dark mr-4" />
                  )}
                  {section.title === "Giáo trình khóa học" && (
                    <FaBookOpen size={24} className="text-primary-dark mr-4" />
                  )}
                  <h3 className="text-xl font-medium text-gray-800">
                    {section.title}
                  </h3>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Curriculum Section */}
      <div className="mt-8">
        <div
          className="flex items-center cursor-pointer mb-6"
          onClick={toggleRoute}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-dark text-primary-dark mr-4 bg-primary-lighter hover:bg-primary-light transition-all">
            {isRouteOpen ? (
              <FaChevronUp size={20} />
            ) : (
              <FaChevronDown size={20} />
            )}
          </span>
          <h2 className="text-2xl font-semibold text-highlight-text hover:text-[#FAB564] transition-all">
            Lộ trình môn học
          </h2>
        </div>

        {isRouteOpen && (
          <div className="p-6 bg-white shadow-md rounded-lg">
            {materialItem.length > 0 ? (
              <ul className="space-y-4">
                {materialItem.map((item, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-lg shadow transition-all duration-200 hover:shadow-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center cursor-pointer">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        {/* Icon dựa trên loại tài liệu */}
                        {item.type === "FOLDER" ? (
                          <FaFolderOpen
                            size={28}
                            className="text-yellow-500 mr-2 flex-shrink-0"
                          />
                        ) : item.name.endsWith(".pdf") ? (
                          <FaFilePdf
                            size={28}
                            className="text-red-500 mr-2 flex-shrink-0"
                          />
                        ) : item.name.endsWith(".doc") ||
                          item.name.endsWith(".docx") ? (
                          <FaFileWord
                            size={28}
                            className="text-blue-500 mr-2 flex-shrink-0"
                          />
                        ) : (
                          <FaFileImage
                            size={28}
                            className="text-green-500 mr-2 flex-shrink-0"
                          />
                        )}

                        <div className="overflow-hidden">
                          <h3 className="text-lg font-medium text-gray-800 hover:text-primary transition-all truncate max-w-md">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 truncate max-w-md">
                            Được tải lên bởi:{" "}
                            <span className="text-primary font-medium">
                              {item.uploadedBy.name}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Nút tải về nếu là FILE */}
                      {item.type === "FILE" && (
                        <a
                          href={`/download/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary-dark text-white text-sm rounded-full hover:bg-primary transition-all shadow-md flex-shrink-0"
                        >
                          Tải về
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>Không có tài liệu nào.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetail;
