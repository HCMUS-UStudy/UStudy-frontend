import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";

interface Score {
  subject: string;
  midterm: number;
  final: number;
  average: number;
  grade: string;
  teacher: string;
}

interface Ranking {
  label: string;
  color: string;
}

interface DetailedScoresTableProps {
  detailedScores: Score[];
  overallAverage: number;
  ranking: Ranking;
}

export default function DetailedScoresTable({
  detailedScores,
  overallAverage,
  ranking,
}: DetailedScoresTableProps) {
  return (
    <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle>Chi tiết điểm số</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-lighter border-b border-primary-light">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Môn học
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Điểm giữa kỳ
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Điểm cuối kỳ
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Điểm TB
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Điểm chữ
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Giáo viên
                </th>
              </tr>
            </thead>
            <tbody>
              {detailedScores.map((score, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-primary-lighter transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {score.subject}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {score.midterm.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {score.final.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-primary-darkest">
                    {score.average.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-primary-darkest">
                    {score.grade}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {score.teacher}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-primary-lighter border-t border-primary-light">
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                  Điểm trung bình tổng
                </td>
                <td colSpan={2} className="px-4 py-3" />
                <td className="px-4 py-3 text-center text-sm font-bold text-primary-darkest">
                  {overallAverage.toFixed(1)}
                </td>
                <td
                  colSpan={2}
                  className="px-4 py-3 text-center text-sm font-bold text-primary-darkest"
                >
                  <span className={`font-bold ${ranking.color}`}>
                    {ranking.label}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
