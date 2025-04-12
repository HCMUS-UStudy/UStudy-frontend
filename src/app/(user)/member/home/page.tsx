/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  FaBook,
  FaTasks,
  FaQuestionCircle,
  FaClipboardList,
} from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { FaArrowRight } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Home() {
  const homeworkList = [
    {
      id: 1,
      subject: "Toán học",
      icon: <FaClipboardList className="h-5 w-5 text-blue-500" />,
      progress: 80,
    },
    {
      id: 2,
      subject: "Lý học",
      icon: <FaClipboardList className="h-5 w-5 text-green-500" />,
      progress: 60,
    },
    {
      id: 3,
      subject: "Hóa học",
      icon: <FaClipboardList className="h-5 w-5 text-red-500" />,
      progress: 40,
    },
  ];

  const subjectScores = {
    labels: [
      "Toán học",
      "Lý học",
      "Hóa học",
      "Sinh học",
      "Ngữ văn",
      "Lịch sử",
      "Địa lý",
      "Tiếng Anh",
      "Tin học",
      "GDCD",
    ],
    datasets: [
      {
        label: "Điểm của bạn",
        data: [8.5, 7.2, 6.8, 7.5, 8.0, 7.0, 6.5, 8.8, 9.0, 7.8], // Điểm của bạn
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Màu thanh biểu đồ cá nhân
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const averageScores = [7.5, 6.8, 7.2, 8.0, 7.0, 6.5, 6.0, 8.5, 7.9, 7.3]; // Điểm trung bình lớp

  const scheduleData = [
    {
      subject: "Toán học",
      grade: "Lớp 10",
      date: "2024-11-26",
      time: "08:00 - 10:00",
    },
    {
      subject: "Vật lý",
      grade: "Lớp 10",
      date: "2024-11-27",
      time: "10:30 - 12:00",
    },
    {
      subject: "Hóa học",
      grade: "Lớp 11",
      date: "2024-11-28",
      time: "14:00 - 16:00",
    },
    {
      subject: "Sinh học",
      grade: "Lớp 11",
      date: "2024-11-29",
      time: "16:30 - 18:00",
    },
    // Thêm các môn học khác vào đây
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 20,
        boxWidth: 20,
        boxHeight: 10,
        callbacks: {
          title: function (tooltipItems: TooltipItem<"bar">[]) {
            return tooltipItems[0].label;
          },
          label: function (context: TooltipItem<"bar">) {
            const studentScore = context.raw as number;
            const subjectIndex = context.dataIndex;
            const avgScore = averageScores[subjectIndex];
            return `${context.dataset.label}: ${studentScore.toFixed(1)} | Điểm trung bình lớp: ${avgScore.toFixed(1)}`;
          },
        },
        useHTML: true,
        external: function () {
          // Add z-index to the tooltip
          const tooltipEl = document.querySelector(".chartjs-tooltip");
          if (tooltipEl instanceof HTMLElement) {
            tooltipEl.style.zIndex = "9999";
          }
        },
      },
      // Plugin tùy chỉnh
      customCanvasBackgroundColor: {
        id: "addPointsAboveBars",
        beforeDraw(chart: any) {
          const { ctx, scales } = chart;
          const xScale = scales.x;
          const yScale = scales.y;

          chart.data.datasets.forEach((dataset: any) => {
            dataset.data.forEach((value: any, index: any) => {
              const x = xScale.getPixelForValue(index);
              const y = yScale.getPixelForValue(value);

              ctx.save();
              ctx.font = "12px Arial";
              ctx.textAlign = "center";
              ctx.fillStyle = "#333";
              ctx.fillText(value.toFixed(1), x, y - 2);
              ctx.restore();
            });
          });
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          position: "left",
          text: "Điểm trung bình lớp",
        },
        ticks: {
          display: false,
          stepSize: 5,
          min: 0,
          max: 10,
        },
      },
    },

    layout: {
      padding: {
        top: 15,
        right: 25,
      },
    },
  };

  ChartJS.register({
    id: "verticalLabelRight",
    beforeDraw(chart: any) {
      const { ctx, chartArea } = chart;
      const chartHeight = chartArea.bottom - chartArea.top;

      ctx.save();
      ctx.font = "12px Arial";
      ctx.fillStyle = "#4682B4";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.save();
      ctx.translate(chartArea.right + 13, chartArea.top + chartHeight / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillText("Điểm của bạn", 0, 0);
      ctx.restore();

      ctx.restore();
    },
  });

  ChartJS.register({
    id: "addDotsAndConnect",
    beforeDraw(chart) {
      const { ctx, scales } = chart;
      const xScale = scales.x; // Trục x
      const yScale = scales.y; // Trục y

      let previousStarX: number | null = null;
      let previousStarY: number | null = null;

      chart.data.datasets.forEach((dataset) => {
        dataset.data.forEach((value, index) => {
          // Lấy điểm trung bình lớp tương ứng
          const avgScore = averageScores[index];
          if (avgScore) {
            // Tính tọa độ của chấm tròn
            const starX = xScale.getPixelForValue(index); // Trung tâm cột
            const starY = yScale.getPixelForValue(avgScore); // Tọa độ theo điểm tb lớp

            // Vẽ chấm tròn
            ctx.save();
            ctx.beginPath();
            ctx.arc(starX, starY, 5, 0, Math.PI * 2); // Vẽ hình tròn (r = 5)
            ctx.fillStyle = "gold"; // Màu sắc chấm tròn
            ctx.fill();
            ctx.restore();

            // Kết nối các chấm với nhau
            if (previousStarX !== null && previousStarY !== null) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(previousStarX, previousStarY); // Điểm bắt đầu (chấm trước đó)
              ctx.lineTo(starX, starY); // Điểm kết thúc (chấm hiện tại)
              ctx.strokeStyle = "gold"; // Màu sắc đường nối
              ctx.lineWidth = 2; // Độ dày đường nối
              ctx.stroke();
              ctx.restore();
            }

            // Cập nhật tọa độ của chấm hiện tại để nối với chấm sau
            previousStarX = starX;
            previousStarY = starY;
          }
        });
      });
    },
  });

  ChartJS.register({
    id: "addPointsAboveBars",
    afterDraw(chart) {
      const { ctx, scales } = chart;
      const xScale = scales.x;
      const yScale = scales.y;

      chart.data.datasets.forEach((dataset) => {
        dataset.data.forEach((value: any, index) => {
          const x = xScale.getPixelForValue(index);
          const y = yScale.getPixelForValue(value);

          // Vẽ điểm phía trên cột
          ctx.save();
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillStyle = "#333"; // Màu chữ
          ctx.fillText(value.toFixed(1), x, y - 9); // Điều chỉnh khoảng cách
          ctx.restore();
        });
      });
    },
  });

  return (
    <div className="px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Tổng số lớp học */}
        <Card className="rounded-lg border hover:shadow-md transition-shadow p-4 bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-2 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số lớp học
            </CardTitle>
            <FaBook className="h-6 w-6 text-gray-600" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-3xl font-bold text-gray-900 flex items-center">
              {20}
              <span className="ml-3 text-sm text-blue-600 bg-blue-100 border border-blue-600 rounded-full px-2 py-0.5">
                +8.00%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tổng số bài tập */}
        <Card className="rounded-lg border hover:shadow-md transition-shadow p-4 bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-2 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số bài tập
            </CardTitle>
            <FaTasks className="h-6 w-6 text-gray-600" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-3xl font-bold text-gray-900 flex items-center">
              {50}
              <span className="ml-3 text-sm text-green-600 bg-green-100 border border-green-600 rounded-full px-2 py-0.5">
                +10.00%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tổng số trắc nghiệm */}
        <Card className="rounded-lg border hover:shadow-md transition-shadow p-4 bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-2 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Trắc nghiệm
            </CardTitle>
            <FaQuestionCircle className="h-6 w-6 text-gray-600" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-3xl font-bold text-gray-900 flex items-center">
              {30}
              <span className="ml-3 text-sm text-red-600 bg-red-100 border border-red-600 rounded-full px-2 py-0.5">
                +7.00%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Homework and Study Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Bài tập về nhà */}
        <div className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Bài tập về nhà
            </h3>
            <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              Xem thêm
            </button>
          </div>

          <ul className="space-y-4">
            {homeworkList.slice(0, 3).map(
              (
                homework, // Display only the first 3 items
              ) => (
                <li
                  key={homework.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="text-2xl text-blue-500">
                      {homework.icon}
                    </div>
                    <p className="text-lg font-medium text-gray-700 ml-3">
                      {homework.subject}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full transition-all duration-300`}
                        style={{
                          width: `${homework.progress}%`,
                          backgroundColor:
                            homework.progress > 50 ? "#4CAF50" : "#FF6F61",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {homework.progress}%
                    </span>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Kết quả học tập */}
        <div className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Kết quả học tập
            </h3>
            <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              Xem thêm
            </button>
          </div>
          <div className="relative bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg shadow-md">
            <Bar data={subjectScores} options={chartOptions} />
          </div>

          <div className="flex items-center justify-center mt-4 space-x-4">
            {/* Điểm của bạn */}
            <div className="flex items-center space-x-2 mr-3">
              <span className="w-4 h-4 bg-sky-500 rounded-full"></span>
              <span className="text-gray-600 text-sm">Điểm của bạn</span>
            </div>

            {/* Điểm trung bình lớp */}
            <div className="flex items-center space-x-2">
              <div className="relative w-4 h-4 mr-2">
                <span className="w-4 h-4 bg-yellow-300 rounded-full block"></span>
                <span className="absolute w-[180%] h-0.5 bg-yellow-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </div>
              <span className="text-gray-600 text-sm">Điểm trung bình lớp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Xem lịch học</h3>
          <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Xem thêm
          </button>
        </div>

        {/* Lịch học */}
        <div className="space-y-4">
          {scheduleData.map((schedule, index) => (
            <div
              key={index}
              className="flex justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300 shadow-md"
            >
              {/* Môn học và khối */}
              <div className="flex flex-col space-y-1">
                <span className="text-lg font-semibold text-gray-800">
                  {schedule.subject}
                </span>
                <span className="text-sm text-gray-600">{schedule.grade}</span>
              </div>

              {/* Ngày học và giờ học */}
              <div className="text-right space-y-1">
                <span className="text-sm text-gray-500 mr-4">
                  {schedule.date}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {schedule.time}
                </span>
                <div className="flex justify-end">
                  {" "}
                  {/* This ensures the button aligns to the right */}
                  <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center transition-all duration-200">
                    Chi tiết <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
