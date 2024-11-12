"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CourseDocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject"); // Get the 'subject' query parameter from the URL

  // Sample course data, replace with actual API call if needed
  const courses = [
    {
      subject: "Toán học",
      description: "Khóa học này dành cho các bạn học sinh lớp 10",
      notes: "Chưa hoàn thành bài tập cuối kỳ",
    },
    {
      subject: "Ngữ văn",
      description: "Khóa học này dành cho các bạn học sinh lớp 11",
      notes: "Cần cập nhật tài liệu",
    },
    {
      subject: "Tiếng Anh",
      description: "Khóa học này dành cho các bạn học sinh lớp 12",
      notes: "Cần thêm phần nghe",
    },
    {
      subject: "Vật lý",
      description: "Khóa học này dành cho các bạn học sinh lớp 10",
      notes: "Không còn sử dụng tài liệu này nữa",
    },
  ];

  // Find the selected course based on the subject parameter
  const selectedCourse = courses.find((course) => course.subject === subject);

  if (!selectedCourse) {
    return <div>Không tìm thấy tài liệu cho môn học này.</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Tài liệu môn học: {selectedCourse.subject}
      </h2>
      <p className="text-lg mb-6">{selectedCourse.description}</p>

      <h3 className="text-xl font-semibold mb-4">Ghi chú:</h3>
      <p>{selectedCourse.notes}</p>

      {/* Tài liệu liên quan sẽ được thêm vào đây */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Tài liệu đính kèm:</h3>
        <ul className="space-y-2">
          <li>Tài liệu 1: Tài liệu bài học về toán học lớp 10</li>
          <li>Tài liệu 2: Bài giảng về ngữ văn lớp 11</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseDocumentsPage;
