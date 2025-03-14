"use client";

import { useParams } from "next/navigation";
import { ClassTeacher } from "@/app/types/type";
import { useEffect, useState } from "react";
import { getClassById } from "@/app/lib/services/class";
import { MdArrowForwardIos } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import ClassMaterial from "@/app/ui/components/user/teacher/ClassMaterial";

const ComponentDetails = ({
  title,
  showDetail,
  setShowDetail,
}: {
  title: string;
  showDetail: boolean;
  setShowDetail: (value: boolean) => void;
}) => {
  return (
    <div className="flex flex-col border border-gray-200 shadow-sm rounded-3xl p-2">
      <div className="flex justify-between bg-white py-4 px-6">
        <div className="flex items-center">
          <h2 className="flex items-center text-[22px] font-bold">{title}</h2>
        </div>
        <div
          className={`flex justify-center items-center p-3 bg-gray-50 border border-gray-200 text-primary-darkest
          rounded-2xl cursor-pointer h-fit hover:border-primary-darkest transition-transform duration-300 ${showDetail ? "rotate-90" : ""} `}
          onClick={() => setShowDetail(!showDetail)}
        >
          <MdArrowForwardIos />
        </div>
      </div>
      <div
        className={`bg-white ease-in-out duration-300 overflow-hidden transition-max-height ${
          showDetail ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="mt-2 border-t border-gray-300 mx-2 py-5 px-4">
          Học sinh nghỉ học
        </div>
        <div
          className="text-primary-darker mx-2 py-5 px-4
        cursor-pointer hover:text-primary-darkest flex items-center"
        >
          <IoIosAdd className="text-[30px] text-purple-800 mb-1" />
          Thêm thông báo
        </div>
      </div>
    </div>
  );
};

export default function ClassDetail() {
  const { classId } = useParams() as { classId: string };
  const [classDetail, setClassDetail] = useState<ClassTeacher | null>(null);
  const [loading, setLoading] = useState(true);

  const [notiDetail, setNotiDetail] = useState(false);
  const [resourcesDetail, setResourcesDetail] = useState(false);
  const [assignmentDetail, setAssignmentDetail] = useState(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await getClassById(classId);
        setClassDetail(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClass();
  }, [classId]);

  useEffect(() => {
    if (classDetail) {
      setLoading(false);
    }
  }, [classDetail]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Nếu không tìm thấy lớp
  if (!classDetail) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">Class not found</h1>
        <p className="mt-4">
          Please check the class ID or go back to the class list.
        </p>
      </div>
    );
  }

  return (
    <div className="container p-4 flex flex-col gap-6">
      <div className="bg-white p-6">
        <h2 className="text-3xl font-bold mb-4">{classDetail.name}</h2>
        <div className="text-[18px]">
          <strong>Môn: </strong> Lý - Khối 11
        </div>
        <div className="text-[18px]">
          <strong>Thời gian: </strong>
          T3 - T5 (15:00 - 17:00)
        </div>
        <div className="text-[18px]">
          <strong>Phòng: </strong> 101
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ComponentDetails
          title="📢 Thông báo"
          showDetail={notiDetail}
          setShowDetail={setNotiDetail}
        />

        <ClassMaterial
          classId={classId}
          showDetail={resourcesDetail}
          setShowDetail={setResourcesDetail}
        />

        <ComponentDetails
          title="📝 Bài tập"
          showDetail={assignmentDetail}
          setShowDetail={setAssignmentDetail}
        />
      </div>

      {/* 
      <div className="flex flex-col border border-gray-200 shadow-md rounded-3xl p-6">
        <div className="flex justify-between bg-white">
          <h2 className="flex items-center text-2xl font-bold">📢 Thông báo</h2>
          <div
            className={`flex justify-center items-center p-3 bg-gray-50 border border-gray-200 text-primary-darkest
          rounded-2xl cursor-pointer h-fit hover:border-primary-darkest transition-transform duration-300 ${notiDetail ? "rotate-90" : ""} `}
            onClick={() => setNotiDetail(!notiDetail)}
          >
            <MdArrowForwardIos />
          </div>
        </div>
        <div
          className={`bg-white ease-in-out duration-500 overflow-hidden transition-max-height ${
            notiDetail ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="mt-2 border-t border-gray-300 ml-4 mr-7 py-5 px-3">
            Học sinh nghỉ học
          </div>
          <div className="mt-2 border-t border-gray-300 ml-4 mr-7 py-5 px-3">
            Học sinh nghỉ học
          </div>
          <div className="mt-2 border-t border-gray-300 ml-4 mr-7 py-5 px-3">
            Học sinh nghỉ học
          </div>
          <div className="mt-2 border-t border-gray-300 ml-4 mr-7 py-5 px-3">
            Học sinh nghỉ học
          </div>
          <div className="mt-2 border-t border-gray-300 ml-4 mr-7 py-5 px-3">
            Học sinh nghỉ học
          </div>
        </div>
      </div> */}

      {/* <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">👥 Students</h2>
        {classDetail.students.map((student, index) => (
          <div key={index} className="flex justify-between">
            <p>{student.name}</p>
            <button className="text-blue-500">Profile</button>
            <button className="text-blue-500">Attendance</button>
          </div>
        ))}
      </div> */}
      {/* 
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">📂 Tài liệu</h2>
        {classDetail.resources.map((resource, index) => (
          <div key={index} className="flex justify-between">
            <p>📄 {resource.name}</p>
            <button className="text-blue-500">Download</button>
          </div>
        ))}
        <button className="text-blue-500 mt-4">➕ Tải tài liệu lên</button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">📝 Bài tập</h2>
        {classDetail.assignments.map((assignment, index) => (
          <div key={index} className="flex justify-between">
            <p>📄 {assignment.name}</p>
            <p>{assignment.dueDate}</p>
            <p>{assignment.status}</p>
          </div>
        ))}
        <button className="text-blue-500 mt-4">➕ Create New Assignment</button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">📊 Grades</h2>
        {classDetail.grades.map((grade, index) => (
          <div key={index} className="flex justify-between">
            <p>{grade.studentName}</p>
            <p>{grade.grade}</p>
          </div>
        ))}
        <button className="text-blue-500 mt-4">📈 View Analytics</button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">💬 Communication</h2>
        <button className="text-blue-500">✉️ Message Student</button>
        <button className="text-blue-500 ml-4">Discussion Board</button>
      </div>
     */}
    </div>
  );
}
