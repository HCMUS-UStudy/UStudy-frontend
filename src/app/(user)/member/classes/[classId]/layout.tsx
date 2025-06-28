"use client";
import { getClassById } from "@/app/lib/services/class";
import ClassNavigationBar from "@/app/ui/components/admin/classes/ClassNavigationBar";
import Image from "next/image";
import React from "react";
import { BsFillBookFill } from "react-icons/bs";
import ClassLayoutWrapper from "@/app/ui/components/admin/classes/ClassLayoutWrapper";
import { useEncodedRoute } from "@/app/lib/hooks";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function ClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { classId } = await params;
  // const classDetail = await getClassById(classId);

  const params = useParams<{ classId: string }>();
  const { decodeId } = useEncodedRoute();
  const classId = decodeId(params?.classId as string);

  const { data: classDetail } = useQuery({
    queryKey: ["ClassDetails"],
    queryFn: () => getClassById(classId),
  });

  // dummy data
  const classMembers = [
    { id: 1, name: "Nguyễn Văn A", avatar: "/student.png" },
    { id: 2, name: "Trần Thị B", avatar: "/teacher.png" },
    { id: 3, name: "Lê Văn C", avatar: "/avatar3.jpg" },
    { id: 4, name: "Phạm Thị D", avatar: "/avatar4.jpg" },
    { id: 5, name: "Hoàng Văn E", avatar: "/avatar5.jpg" },
  ];
  const displayedMembers = classMembers.slice(0, 2);
  const remainingCount = classMembers.length - displayedMembers.length;

  const layout = (
    <>
      <div className="border-b border-primary-light">
        <div className="flex items-center space-x-4 mb-3">
          <div className="bg-highlight-text hidden md:flex text-white p-3 rounded-lg shadow">
            <BsFillBookFill className="size-6" />
          </div>
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-darkest">
              {classDetail?.course.name
                ? `Lớp ${classDetail?.name} - ${classDetail?.course.name} ${classDetail?.grade.name}`
                : classDetail?.name}
            </h1>
            <div className="md:flex hidden items-center space-x-1">
              {displayedMembers.map((member) => (
                <Image
                  width={32}
                  height={32}
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border-2 border-primary-light shadow-md"
                />
              ))}
              {remainingCount > 0 && (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-darkest flex items-center justify-center text-sm font-bold border-2 border-primary-light shadow-md">
                  +{remainingCount}
                </div>
              )}
            </div>
          </div>
        </div>
        <ClassNavigationBar />
      </div>
      <div className="mt-3">{children}</div>
    </>
  );

  return <ClassLayoutWrapper layout={layout}>{children}</ClassLayoutWrapper>;
}
