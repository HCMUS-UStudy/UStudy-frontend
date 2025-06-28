import { BsGraphUp, BsTrophy, BsBook } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { ClassScoreDetail } from "@/app/types/class";

interface HeaderProps {
  details: ClassScoreDetail;
}

export const Header = ({ details }: HeaderProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {/* Điểm trung bình */}
      <Card className="border-primary-light hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700">
            Điểm trung bình
          </CardTitle>
          <BsGraphUp className="h-5 w-5 text-primary-darker" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-darkest">
            {details.studentAverage.toFixed(1)}
          </div>
          <p className="text-sm text-gray-500">
            TB lớp: {details.classAverage.toFixed(1)}
          </p>
        </CardContent>
      </Card>

      {/* Xếp hạng */}
      <Card className="border-primary-light hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700">
            Xếp hạng
          </CardTitle>
          <BsTrophy className="h-5 w-5 text-primary-darker" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-darkest">
            {`${details.studentRank}/${details.totalStudents}`}
          </div>
          <p className="text-sm text-gray-500">Trong lớp</p>
        </CardContent>
      </Card>

      {/* Môn học */}
      <Card className="border-primary-light hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700">
            Môn học
          </CardTitle>
          <BsBook className="h-5 w-5 text-primary-darker" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-darkest">
            {details.course.name}
          </div>
          <p className="text-sm text-gray-500">{details.grade.name}</p>
        </CardContent>
      </Card>
    </div>
  );
};
