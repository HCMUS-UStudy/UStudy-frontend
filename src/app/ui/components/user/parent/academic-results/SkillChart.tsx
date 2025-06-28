"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { ChildClassScore } from "@/app/types";

interface SkillChartProps {
  data: ChildClassScore[];
}

export const SkillChart = ({ data }: SkillChartProps) => {
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

  const studentAverages = data.map((item) => item.studentAverage);
  const differences = data.map(
    (item) => item.classAverage - item.studentAverage,
  );

  const comparisonData = {
    labels: labels,
    datasets: [
      {
        label: "Điểm của con",
        data: studentAverages,
        backgroundColor: "rgba(156, 163, 175, 0.7)", // gray-400
        borderColor: "rgba(107, 114, 128, 1)", // gray-500
        borderWidth: 1,
      },
      {
        label: "Chênh lệch đến TB lớp",
        data: differences,
        backgroundColor: differences.map(
          (d) =>
            d >= 0
              ? "rgba(239, 68, 68, 0.7)" // red-500
              : "rgba(58, 169, 122, 0.7)", // custom green
        ),
        borderColor: differences.map(
          (d) =>
            d >= 0
              ? "rgba(220, 38, 38, 1)" // red-600
              : "rgba(5, 150, 105, 1)", // emerald-600
        ),
        borderWidth: 1,
      },
    ],
  };

  if (!isClient) {
    return (
      <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>So sánh với trung bình lớp</CardTitle>
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
        <CardTitle>So sánh với trung bình lớp</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Bar
            data={comparisonData}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      if (context.dataset.label === "Điểm của con") {
                        return ` ${context.dataset.label}: ${context.formattedValue}`;
                      }
                      const diff = parseFloat(context.formattedValue);
                      const comparisonText = diff >= 0 ? "Thấp hơn" : "Cao hơn";
                      return ` ${comparisonText} TB lớp: ${Math.abs(diff).toFixed(1)}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  stacked: true,
                  title: {
                    display: true,
                    text: "Điểm trung bình",
                  },
                },
                y: {
                  stacked: true,
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
