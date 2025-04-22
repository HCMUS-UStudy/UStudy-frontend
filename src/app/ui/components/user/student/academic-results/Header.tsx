import { BsGraphUp, BsCalendar3, BsFileText } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { FaGraduationCap } from "react-icons/fa6";

interface HeaderProps {
  overallAverage: number;
  ranking: {
    color: string;
    label: string;
  };
  selectedSemester: string;
  selectedYear: string;
  totalSubjects: number;
}

export const Header = ({
  overallAverage,
  ranking,
  selectedSemester,
  selectedYear,
  totalSubjects,
}: HeaderProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Điểm trung bình */}
      <Card className="border-primary-light hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700">
            Điểm trung bình
          </CardTitle>
          <BsGraphUp className="h-5 w-5 text-primary-darker" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary-darkest">
              {overallAverage.toFixed(1)}
            </div>
            <p className={`text-lg font-medium ${ranking.color}`}>
              {ranking.label}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary-light hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700">
            Xếp hạng
          </CardTitle>
          <FaGraduationCap className="h-5 w-5 text-primary-darker" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary-darkest">5/30</div>
            <p className="text-sm font-medium text-gray-600">Trong lớp</p>
          </div>
        </CardContent>
      </Card>

      {/* Học kỳ hiện tại */}
      <Card className="border-primary-light hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700">
            Học kỳ hiện tại
          </CardTitle>
          <BsCalendar3 className="h-5 w-5 text-primary-darker" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary-darkest">
              {selectedSemester}
            </div>
            <p className="text-sm font-medium text-gray-600">{selectedYear}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tổng số môn học */}
      <Card className="border-primary-light hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700">
            Tổng số môn học
          </CardTitle>
          <BsFileText className="h-5 w-5 text-primary-darker" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary-darkest">
              {totalSubjects}
            </div>
            <p className="text-sm font-medium text-gray-600">Tổng số môn</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
