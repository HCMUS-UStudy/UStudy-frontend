import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import {
  BsBook,
  BsCalendarEvent,
  BsCardHeading,
  BsLayers,
  BsPeople,
  BsPersonCheck,
  BsTextParagraph,
  BsTrophy,
} from "react-icons/bs";
import { ClassScoreDetail } from "@/app/types/class";

// interface Score {
//   subject: string;
//   midterm: number;
//   final: number;
//   average: number;
//   grade: string;
//   teacher: string;
// }

// interface Ranking {
//   label: string;
//   color: string;
// }

// interface DetailedScoresTableProps {
//   detailedScores: Score[];
//   overallAverage: number;
//   ranking: Ranking;
// }

// const testResults = [
//   {
//     id: 1,
//     examName: "Toán học kỳ 1",
//     score: 8.5,
//     averageScore: 7.0,
//     examDate: "2025-04-10",
//   },
//   {
//     id: 2,
//     examName: "Văn học kỳ 1",
//     score: 7.2,
//     averageScore: 6.8,
//     examDate: "2025-04-12",
//   },
//   {
//     id: 3,
//     examName: "Tiếng Anh giữa kỳ",
//     score: 9.0,
//     averageScore: 7.5,
//     examDate: "2025-03-28",
//   },
//   {
//     id: 4,
//     examName: "Lý học kỳ 2",
//     score: 6.8,
//     averageScore: 7.1,
//     examDate: "2025-05-05",
//   },
//   {
//     id: 5,
//     examName: "Hóa học kỳ 2",
//     score: 7.5,
//     averageScore: 7.0,
//     examDate: "2025-05-08",
//   },
// ];

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <div className="flex items-center p-3 transition-colors hover:bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-lighter text-primary-darker rounded-full mr-4">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-md font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

interface DetailedScoresTableProps {
  details: ClassScoreDetail;
}

export default function DetailedScoresTable({
  details,
}: DetailedScoresTableProps) {
  const detailItems = [
    {
      icon: <BsCardHeading size={20} />,
      label: "Tên lớp",
      value: details.className,
    },
    {
      icon: <BsBook size={20} />,
      label: "Môn học",
      value: details.course.name,
    },
    { icon: <BsLayers size={20} />, label: "Khối", value: details.grade.name },
    {
      icon: <BsCalendarEvent size={20} />,
      label: "Ngày bắt đầu",
      value: new Date(details.startDate).toLocaleDateString("vi-VN"),
    },
    {
      icon: <BsPersonCheck size={20} />,
      label: "Điểm của bạn",
      value: details.studentAverage.toFixed(1),
    },
    {
      icon: <BsPeople size={20} />,
      label: "Điểm TB Lớp",
      value: details.classAverage.toFixed(1),
    },
    {
      icon: <BsTrophy size={20} />,
      label: "Xếp hạng",
      value: `${details.studentRank}/${details.totalStudents}`,
    },
    {
      icon: <BsTextParagraph size={20} />,
      label: "Mô tả",
      value: details.description || "Không có",
    },
  ];

  return (
    <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle>Chi tiết lớp học</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {detailItems.map((item, index) => (
            <DetailItem key={index} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
