"use client";

import { useParams } from "next/navigation";
import { ClassTeacher } from "@/app/types/type";
import { useEffect, useState } from "react";
import { getClassById } from "@/app/lib/services/class";
import { MdArrowForwardIos } from "react-icons/md";
import ClassMaterial from "@/app/ui/components/user/teacher/ClassMaterial";
import Notification from "@/app/ui/components/user/teacher/Notification";
import Loading from "@/app/ui/components/_common/Loading";
import { Button } from "@/app/ui/components/_common/Button";
import AddingModal from "@/app/ui/components/user/teacher/AddingModal";

const ComponentDetails = ({
  title,
  showDetail,
  setShowDetail,
  children,
}: {
  title: string;
  showDetail: boolean;
  setShowDetail: (value: boolean) => void;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col border border-gray-200 shadow-sm rounded-3xl">
      <div className="flex justify-between bg-white py-5 px-8 rounded-3xl">
        <h2 className="flex items-center text-[22px] font-bold">{title}</h2>
        <div
          className={`flex justify-center items-center p-3 bg-gray-50 border border-gray-200 text-primary-darkest
          rounded-2xl cursor-pointer h-fit hover:border-primary-darkest transition-transform duration-300 ${
            showDetail ? "rotate-90" : ""
          }`}
          onClick={() => setShowDetail(!showDetail)}
        >
          <MdArrowForwardIos />
        </div>
      </div>
      <div
        className={`bg-white ease-in-out overflow-hidden transition-transform origin-top duration-300 
          rounded-b-3xl
          ${showDetail ? "scale-y-100" : "scale-y-0 h-0"}`}
      >
        {children}
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

  const [addingModal, setAddingModal] = useState(false);

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

  // const fetchListMembers = async () => {
  //   const response = await getListMembers(classId, "", 0, 100, "STUDENT");
  //   setMemberData(response);
  // };

  if (loading) {
    return <Loading />;
  }

  if (!classDetail) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">Không tìm thấy lớp</h1>
      </div>
    );
  }

  return (
    <div className="container p-4 flex flex-col gap-6">
      <div className="flex justify-between">
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
          <div className="text-[18px]">
            <strong>Giáo viên: </strong>Nguyễn Minh Quân
          </div>
        </div>

        <div className="mr-6 mt-6 flex flex-col gap-2">
          <Button className="px-5">Danh sách học viên</Button>
          <Button>Điểm danh</Button>
          <Button onClick={() => setAddingModal(true)}> + Nội dung mới</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ComponentDetails
          title="📢 Thông báo"
          showDetail={notiDetail}
          setShowDetail={setNotiDetail}
        >
          <Notification classId={classId} />
        </ComponentDetails>

        <ComponentDetails
          title="📂 Tài liệu"
          showDetail={resourcesDetail}
          setShowDetail={setResourcesDetail}
        >
          <ClassMaterial classId={classId} />
        </ComponentDetails>

        <ComponentDetails
          title="📝 Bài tập"
          showDetail={assignmentDetail}
          setShowDetail={setAssignmentDetail}
        ></ComponentDetails>
      </div>

      {addingModal && <AddingModal setAddingModal={setAddingModal} />}
    </div>
  );
}
