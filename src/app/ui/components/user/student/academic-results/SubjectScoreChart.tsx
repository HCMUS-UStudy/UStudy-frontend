"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { ClassScore, ClassScoreDetail } from "@/app/types/class";

interface SubjectScoreChartProps {
  data: ClassScore[] | ClassScoreDetail;
}

export const SubjectScoreChart = ({ data }: SubjectScoreChartProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isArray = Array.isArray(data);

  const getLabels = () => {
    if (!isArray) {
      return [(data as ClassScoreDetail).course.name];
    }
    const scores = data as ClassScore[];
    const nameCounts = scores.reduce(
      (acc, score) => {
        acc[score.course.name] = (acc[score.course.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    return scores.map((score) => {
      if (nameCounts[score.course.name] > 1) {
        return `${score.course.name} - ${score.grade.name}`;
      }
      return score.course.name;
    });
  };

  // Dữ liệu điểm số theo môn học
  const subjectScores = {
    labels: getLabels(),
    datasets: [
      {
        label: "Điểm của bạn",
        data: isArray
          ? (data as ClassScore[]).map((item) => item.studentAverage)
          : [(data as ClassScoreDetail).studentAverage],
        backgroundColor: "rgba(190, 229, 209, 0.7)",
        borderColor: "rgba(120, 174, 145, 1)",
        borderWidth: 1,
      },
      {
        label: "Điểm trung bình lớp",
        data: isArray
          ? (data as ClassScore[]).map((item) => item.classAverage)
          : [(data as ClassScoreDetail).classAverage],
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
