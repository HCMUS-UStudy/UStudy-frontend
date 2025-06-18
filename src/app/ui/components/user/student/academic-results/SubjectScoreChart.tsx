"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

export const SubjectScoreChart = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subjectScores = {
    labels: [
      "Toán học",
      "Ngữ văn",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "GDCD",
    ],
    datasets: [
      {
        label: "Điểm của bạn",
        data: [8.5, 7.8, 8.2, 7.5, 8.0, 9.2, 7.6, 8.4, 8.8],
        backgroundColor: "rgba(190, 229, 209, 0.7)",
        borderColor: "rgba(120, 174, 145, 1)",
        borderWidth: 1,
      },
      {
        label: "Điểm trung bình lớp",
        data: [7.8, 7.2, 7.5, 7.0, 7.3, 8.1, 7.0, 7.8, 8.0],
        backgroundColor: "rgba(217, 217, 217, 0.5)",
        borderColor: "rgba(150, 150, 150, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (!isClient) {
    return (
      <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Điểm số theo môn học</CardTitle>
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
        <CardTitle>Điểm số theo môn học</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Bar
            data={subjectScores}
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
