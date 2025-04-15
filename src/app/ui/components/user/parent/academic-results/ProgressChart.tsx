import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Line } from "react-chartjs-2";

export const ProgressChart = () => {
  // Dữ liệu điểm trung bình theo học kỳ
  const progressData = {
    labels: [
      "HK1 2022-2023",
      "HK2 2022-2023",
      "HK1 2023-2024",
      "HK2 2023-2024",
    ],
    datasets: [
      {
        label: "Điểm trung bình",
        data: [8.1, 8.3, 8.5, 8.7],
        borderColor: "rgba(58, 169, 122, 1)",
        backgroundColor: "rgba(190, 229, 209, 0.2)",
        pointBackgroundColor: "rgba(58, 169, 122, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(58, 169, 122, 1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  return (
    <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle>Tiến độ học tập</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Line
            data={progressData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
