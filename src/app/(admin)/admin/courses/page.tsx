"use client";

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaEdit, FaTrashAlt, FaPaperclip, FaTimes } from 'react-icons/fa';
import Button from '@/app/ui/components/button';
import Link from 'next/link';

const CoursePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  //Modals
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([
    { creator: 'Daniel Grant', subject: 'Toán học', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 10', createdAt: '17 Feb 2024', status: 'Active', notes: 'Chưa hoàn thành bài tập cuối kỳ' },
    { creator: 'Daniel Grant', subject: 'Ngữ văn', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 11', createdAt: '14 Feb 2024', status: 'Active', notes: 'Cần cập nhật tài liệu' },
    { creator: 'Daniel Grant', subject: 'Tiếng Anh', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 12', createdAt: '14 Feb 2024', status: 'Active', notes: 'Cần thêm phần nghe' },
    { creator: 'Daniel Grant', subject: 'Vật lý', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 10', createdAt: '14 Feb 2024', status: 'Deleted', notes: 'Không còn sử dụng tài liệu này nữa' },
    { creator: 'Daniel Grant', subject: 'Hóa học', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 11', createdAt: '14 Feb 2024', status: 'Active', notes: 'Chờ cập nhật bài tập' },
    { creator: 'Daniel Grant', subject: 'Sinh học', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 12', createdAt: '14 Feb 2024', status: 'Active', notes: 'Cần bổ sung video giảng dạy' },
    { creator: 'Daniel Grant', subject: 'Lịch sử', attachments: 200, description: 'Khóa học này dành cho các bạn học sinh lớp 10', createdAt: '14 Feb 2024', status: 'Deleted', notes: 'Chưa hoàn thành phần lịch sử hiện đại' },
    { creator: 'Daniel Grant', subject: 'Địa lý', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 11', createdAt: '14 Feb 2024', status: 'Active', notes: 'Cần thêm phần bài tập thực hành' },
    { creator: 'Daniel Grant', subject: 'Giáo dục công dân', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 12', createdAt: '14 Feb 2024', status: 'Active', notes: 'Tài liệu còn thiếu phần thực tế' },
    { creator: 'Daniel Grant', subject: 'Tin học', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 10', createdAt: '14 Feb 2024', status: 'Deleted', notes: 'Chưa hoàn thành các phần bài tập lập trình' },
    { creator: 'Daniel Grant', subject: 'Công nghệ', attachments: 100, description: 'Khóa học này dành cho các bạn học sinh lớp 11', createdAt: '14 Feb 2024', status: 'Active', notes: 'Cần cập nhật tài liệu mới nhất' },
  
  ]);
  
  const onCreateCourse = () => {
    setShowModal(true); 
  };

  const [formData, setFormData] = useState({
    creator: '',
    subject: '',
    attachments: 0,
    description: '',
    notes: '',
    createdAt: new Date().toLocaleDateString(),
    status: 'Active',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveCourse = () => {
    setCourses((prevCourses) => [...prevCourses, formData]);
    setShowModal(false);
  };

  const filteredCourses = courses.filter(course => {
    return (
      (selectedSubject ? course.subject === selectedSubject : true) &&
      (searchQuery ? course.subject.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );
  });

  const handleAttachmentClick = (subject: string) => {
    return `/admin/course-documents/${encodeURIComponent(subject)}`;
  };

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = Math.min(3, totalPages);

    let start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    for (let i = start; i < start + maxPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  //Files
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">Quản lý tài liệu môn học</h2>
      <h2 className="text-xl tracking-tight mb-6">Tìm tất cả tài liệu của nền tảng tại đây</h2>

      <div className="flex items-center justify-between mt-6 mr-6">
        <div className="flex items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-4 border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
          >
            <option value="">Tất cả môn học</option>
            <option value="math">Toán học</option>
            <option value="literature">Ngữ văn</option>
            <option value="english">Tiếng Anh</option>
            <option value="physics">Vật lý</option>
            <option value="chemistry">Hóa học</option>
            <option value="biology">Sinh học</option>
            <option value="history">Lịch sử</option>
            <option value="geography">Địa lý</option>
            <option value="civics">Giáo dục công dân</option>
            <option value="informatics">Tin học</option>
            <option value="technology">Công nghệ</option>
          </select>
          <h2 className="text-lg text-slate-400">{filteredCourses.length} khóa học đã được liệt kê</h2>
        </div>

        <div className="flex justify-end">
          <Button onClick={onCreateCourse} type="button" className="pl-6 pr-6">
            Tạo môn học
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 max-h-[400px] mr-6">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Người tạo</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Môn học</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Tệp đính kèm</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Mô tả</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Ngày tạo</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Trạng thái</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Ghi chú</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCourses.map((course, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-6 py-4 text-sm text-gray-700">{course.creator}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{course.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-700 mt-3 flex items-center hover:underline">
                  <Link href={handleAttachmentClick(course.subject)} className='flex'>
                    {course.attachments}
                    <FaPaperclip className="ml-2 mt-1 text-green-500" />
                  </Link>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">{course.description}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">{course.createdAt}</td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  <span className={`px-2 py-1 rounded-full text-white ${course.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{course.notes}</td>
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center space-x-3 text-center">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Show modal*/}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-3xl font-semibold mb-6 text-center">Tạo khóa học mới</h2>
            
            <label className="block text-sm font-medium text-gray-700">Người tạo</label>
            <input
              type="text"
              name="creator"
              value={formData.creator}
              onChange={handleInputChange}
              className="w-full border rounded p-2 mb-4"
              placeholder="Người tạo"
            />
            
            <label className="block text-sm font-medium text-gray-700">Môn học</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full border rounded p-2 mb-4"
              placeholder="Môn học"
            />
            
            <label className="block text-sm font-medium text-gray-700 mb-4">Số lượng tệp đính kèm</label>
            {/* File Drop Zone */}
            <div {...getRootProps({ className: 'border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4 cursor-pointer' })}>
              <input {...getInputProps()} />
              <p>Kéo và thả file vào đây, hoặc nhấp để chọn tệp</p>
            </div>

            {/* Display selected files with delete button */}
            {files.length > 0 && (
              <ul className="mb-4 space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center text-gray-700">
                    {file.name}
                    <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2 mb-4"
              placeholder="Mô tả khóa học"
            />
            
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full border rounded p-2 mb-4"
              placeholder="Ghi chú"
            />
            
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700">
                Hủy
              </Button>
              <Button onClick={handleSaveCourse} className="bg-blue-500 text-white">
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex justify-end mt-6 mr-6 space-x-2">
        <button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
            currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              currentPage === page ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
            currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default CoursePage;
