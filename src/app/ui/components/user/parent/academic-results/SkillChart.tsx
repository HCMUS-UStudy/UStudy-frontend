"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Radar } from "react-chartjs-2";

export const SkillChart = () => {
  // Dữ liệu cho biểu đồ radar kỹ năng
  const skillsData = {
    labels: [
      "Tư duy phản biện",
      "Khả năng ghi nhớ",
      "Tính tự giác",
      "Kỹ năng nhóm",
      "Thuyết trình",
      "Sáng tạo",
    ],
    datasets: [
      {
        label: "Kỹ năng của con",
        data: [8.5, 9.0, 7.5, 6.8, 7.2, 8.3],
        backgroundColor: "rgba(190, 229, 209, 0.3)",
        borderColor: "rgba(58, 169, 122, 1)",
        pointBackgroundColor: "rgba(58, 169, 122, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(58, 169, 122, 1)",
        borderWidth: 2,
      },
      {
        label: "Trung bình lớp",
        data: [7.2, 7.5, 7.0, 7.3, 6.8, 7.1],
        backgroundColor: "rgba(217, 217, 217, 0.3)",
        borderColor: "rgba(150, 150, 150, 1)",
        pointBackgroundColor: "rgba(150, 150, 150, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(150, 150, 150, 1)",
        borderWidth: 2,
      },
    ],
  };
  return (
    <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle>Đánh giá kỹ năng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Radar
            data={skillsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  min: 0,
                  max: 10,
                  ticks: {
                    stepSize: 2,
                  },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
