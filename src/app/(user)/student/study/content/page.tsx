"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaFileAlt, FaRegCalendarAlt } from "react-icons/fa";
import { FaBookOpen, FaBullhorn, FaChevronDown, FaChevronUp, FaComments } from "react-icons/fa6";

export default function StudyContent() {
  const [date, setDate] = useState(new Date());
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([]);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);  // Track the state of the "Tổng quan" tab
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false); // Theo dõi trạng thái mở rộng tất cả

  const [subject] = useState({
    name: "Toán học nâng cao",
    description:
      "Khóa học giúp củng cố kiến thức toán học từ cơ bản đến nâng cao, phù hợp với học sinh muốn cải thiện kỹ năng giải bài tập và nâng cao thành tích học tập.",
    overview:
      [
        {
          title: "Thông báo"
        },
        {
          title: "Diễn đàn thảo luận"
        },
        {
          title: "Giáo trình khóa học"
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

  const toggleWeek = (index: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(index)
        ? prev.filter((weekIndex) => weekIndex !== index) // Đóng tuần
        : [...prev, index] // Mở tuần
    );
  };

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
      setExpandedWeeks([]); // Thu gọn tất cả các tuần
    } else {
      setIsOverviewOpen(true);
      setIsRouteOpen(true);
      setExpandedWeeks(subject.curriculum.map((_, index) => index)); // Mở rộng tất cả các tuần
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

  const handleDateChange = (selectedDate: any) => {
    setDate(selectedDate);
    console.log("Selected Date:", selectedDate);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 rounded-3xl">

      {/* Body Content */}
      <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-lg mt-4">
        {/* Title Section */}
        <div className="border-b border-gray-300 pb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">{subject.name}</h1>
          <p className="text-lg text-gray-700">{subject.description}</p>
        </div>

        {/* Tổng quan Section */}
        <div className="mt-8 border-b border-gray-300 pb-6">

          {/* Toggle button to open/close the "Tổng quan" section */}
          <div className="flex justify-between">
            <div className="flex items-center cursor-pointer mb-6" onClick={toggleOverview}>
              <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 mr-4 bg-blue-50 hover:bg-blue-100 transition-all">
                {isOverviewOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
              </span>
              <h2 className="text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-all">Tổng quan</h2>
            </div>
            <button
              onClick={toggleAllSections}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all mb-6"
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
                      <FaBullhorn size={24} className="text-blue-500 mr-4" />
                    )}
                    {section.title === "Diễn đàn thảo luận" && (
                      <FaComments size={24} className="text-blue-500 mr-4" />
                    )}
                    {section.title === "Giáo trình khóa học" && (
                      <FaBookOpen size={24} className="text-blue-500 mr-4" />
                    )}
                    <h3 className="text-xl font-medium text-gray-800">{section.title}</h3>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Curriculum Section */}
        <div className="mt-8">
          <div className="flex items-center cursor-pointer mb-6" onClick={toggleRoute}>
            <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 mr-4 bg-blue-50 hover:bg-blue-100 transition-all">
              {isRouteOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
            </span>
            <h2 className="text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-all">Lộ trình môn học</h2>
          </div>

          {isRouteOpen && (
            <ul className="space-y-4">
              {subject.curriculum.map((week, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleWeek(index)}
                  >
                    <div className="flex items-center">
                      <FaRegCalendarAlt size={24} className="text-blue-500 mr-4" />
                      <div>
                        <h3 className="text-xl font-medium text-gray-800">{week.title}</h3>
                        <p className="text-gray-600 mt-1">{week.description}</p>
                      </div>
                    </div>
                    <span className="text-blue-500 transform transition-transform">
                      {expandedWeeks.includes(index) ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                    </span>
                  </div>
                  {expandedWeeks.includes(index) && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">Tài liệu:</h4>
                      <ul className="space-y-3">
                        {week.materials.map((material, matIndex) => (
                          <li
                            key={matIndex}
                            className="flex items-center justify-between bg-gray-50 p-4 rounded-md border-l-4 border-green-500"
                          >
                            <div className="flex items-center">
                              <FaFileAlt size={20} className="text-green-500 mr-3" />
                              <div>
                                <h5 className="text-md font-medium text-gray-800">
                                  {material.title}
                                </h5>
                                <p className="text-gray-600 text-sm">{material.description}</p>
                              </div>
                            </div>
                            <a
                              href={material.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-all"
                            >
                              Tải về
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Calendar Section */}
      <div className="w-full md:w-1/4 bg-white bg-opacity-90 backdrop-blur-md shadow-lg border-t md:border-l border-gray-200 p-6 rounded-t-3xl md:rounded-l-3xl">
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800 text-center md:text-left">
          Lịch cá nhân
        </h3>
        <div className="p-4 bg-gradient-to-br from-white to-indigo-100 rounded-2xl shadow-xl">
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="w-full rounded-lg overflow-hidden shadow-md"
            tileClassName={({ date, view }) =>
              `transition-all duration-300 ${view === "month" &&
                date.toDateString() === new Date().toDateString()
                ? "bg-indigo-500 text-white font-bold rounded-lg shadow-md"
                : "hover:bg-blue-100 hover:text-blue-700 rounded-md"
              }`
            }
            formatShortWeekday={(locale, date) => {
              const weekdays = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
              return weekdays[date.getDay()];
            }}
            formatMonthYear={(locale, date) => {
              const options: { year: "numeric"; month: "short" } = {
                year: "numeric",
                month: "short",
              };
              return new Intl.DateTimeFormat("en-US", options).format(date);
            }}
            prevLabel={<span className="text-blue-500">←</span>}
            nextLabel={<span className="text-blue-500">→</span>}
          />
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Bài tập gần đây</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài tập toán ngày mai</p>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài tập lý cuối tuần</p>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài kiểm tra hóa học</p>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}