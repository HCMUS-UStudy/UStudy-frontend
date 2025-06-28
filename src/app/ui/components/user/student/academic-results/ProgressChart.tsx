"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { ClassScore } from "@/app/types/class";

interface ProgressChartProps {
  data: ClassScore[];
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nameCounts = data.reduce(
    (acc, score) => {
      acc[score.course.name] = (acc[score.course.name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const labels = data.map((score) => {
    if (nameCounts[score.course.name] > 1) {
      return `${score.course.name} - ${score.grade.name}`;
    }
    return score.course.name;
  });

  // Dữ liệu điểm trung bình theo học kỳ
  const progressData = {
    labels: labels,
    datasets: [
      {
        label: "Điểm trung bình",
        data: data.map((item) => item.studentAverage),
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

  if (!isClient) {
    return (
      <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Tiến độ học tập</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
