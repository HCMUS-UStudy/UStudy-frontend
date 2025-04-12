"use client";

import { BsPerson } from "react-icons/bs";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  lastActive: string;
}

interface TeacherListProps {
  teachers: Teacher[];
  selectedTeacher: string | null;
  setSelectedTeacher: (name: string) => void;
}

const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  selectedTeacher,
  setSelectedTeacher,
}) => {
  return (
    <div className="md:col-span-1 max-h-screen-height">
      <Card className="h-full shadow-md bg-white border">
        <CardHeader className="max-h-sub-header-height min-h-sub-header-height">
          <CardTitle className="flex items-center text-primary-dark">
            <BsPerson className="mr-2" />
            Danh sách giáo viên
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Chọn giáo viên để nhắn tin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 py-2 max-h-sub-screen-height overflow-auto scrollbar-thin scrollbar-thumb-gray-300">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className={`flex items-center p-3 border rounded cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm ${
                selectedTeacher === teacher.name
                  ? "border-primary-dark bg-primary-lighter"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedTeacher(teacher.name)}
            >
              <div className="relative w-11 h-11 mr-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                  {teacher.avatar ? (
                    <Image
                      width={36}
                      height={36}
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BsPerson size={24} className="text-primary-dark" />
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"></span>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-primary-dark">
                  {teacher.name}
                </p>
                <p className="text-xs text-gray-500">{teacher.subject}</p>
                <p className="text-xs text-gray-400">{teacher.lastActive}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherList;
