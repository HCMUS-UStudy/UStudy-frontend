/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { FaChartBar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getStudentClassesWithGrades } from "@/app/lib/services/class";
import { StudentClassWithGrades } from "@/app/types/class";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

export default function ResultStudy() {
  const [classesData, setClassesData] = useState<StudentClassWithGrades[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentClassesWithGrades();
        setClassesData(data);
        // XÓA hoặc comment mockdata
        // const mockData: StudentClassWithGrades[] = [...];
        // setClassesData(mockData);
      } catch (err) {
        console.log(err);
        setError("Không thể tải dữ liệu kết quả học tập.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Chuyển đổi dữ liệu từ API thành format cho chart
  const subjectScores: any = {
    labels: classesData.map((cls) => cls.course?.name || "Không có tên môn"),
    datasets: [
      {
        label: "Điểm trung bình lớp",
        data: classesData.map((cls) => cls.classAverage || 0),
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        borderColor: "rgba(251, 191, 36, 1)",
        borderWidth: 3,
        type: "line",
        pointRadius: 8,
        pointBackgroundColor: "rgba(251, 191, 36, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 3,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: "rgba(251, 191, 36, 1)",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 3,
        fill: false,
        tension: 0.3,
        order: 1,
      },
      {
        label: "Điểm của bạn",
        data: classesData.map((cls) => cls.studentAverage || 0),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        type: "bar",
        order: 2,
      },
    ],
  };

  const averageScores = classesData.map((cls) => cls.classAverage || 0);

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          padding: 25,
          font: {
            size: 12,
            weight: "600",
            family: "Inter, system-ui, sans-serif",
          },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(59, 130, 246, 0.3)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        boxWidth: 20,
        boxHeight: 10,
        titleFont: {
          size: 14,
          weight: "600",
          family: "Inter, system-ui, sans-serif",
        },
        bodyFont: {
          size: 13,
          weight: "500",
          family: "Inter, system-ui, sans-serif",
        },
        callbacks: {
          title: function (tooltipItems: TooltipItem<"bar">[]) {
            return tooltipItems[0].label;
          },
          label: function (context: TooltipItem<"bar">) {
            const studentScore = context.raw as number;
            return `${context.dataset.label}: ${studentScore.toFixed(1)}`;
          },
        },
        useHTML: true,
        external: function () {
          const tooltipEl = document.querySelector(".chartjs-tooltip");
          if (tooltipEl instanceof HTMLElement) {
            tooltipEl.style.zIndex = "9999";
          }
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: true,
          font: {
            size: 11,
            weight: "500",
            family: "Inter, system-ui, sans-serif",
          },
          color: "#6B7280",
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
          padding: 8,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          position: "left",
          text: "Điểm số",
          font: {
            size: 12,
            weight: "600",
            family: "Inter, system-ui, sans-serif",
          },
          color: "#374151",
          padding: {
            top: 0,
            bottom: 10,
          },
        },
        ticks: {
          display: true,
          stepSize: 2,
          font: {
            size: 11,
            weight: "500",
            family: "Inter, system-ui, sans-serif",
          },
          color: "#6B7280",
          min: 0,
          max: 10,
          padding: 8,
        },
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
          lineWidth: 1,
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        top: 30,
        right: 20,
        left: 20,
        bottom: 20,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  // Đăng ký plugin để vẽ chấm vàng và đường nối
  ChartJS.register({
    id: "verticalLabelRight",
    beforeDraw(chart: any) {
      const { ctx, chartArea } = chart;
      const chartHeight = chartArea.bottom - chartArea.top;

      ctx.save();
      ctx.font = "bold 12px Arial";
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
    afterDraw(chart: any) {
      console.log("Drawing dots and lines...", averageScores);
      const { ctx, scales } = chart;
      const xScale = scales.x; // Trục x
      const yScale = scales.y; // Trục y

      let previousStarX: number | null = null;
      let previousStarY: number | null = null;

      // Vẽ chấm vàng cho điểm trung bình lớp
      averageScores.forEach((avgScore, index) => {
        console.log(`Drawing dot for index ${index}, score: ${avgScore}`);
        if (avgScore && avgScore > 0) {
          // Tính tọa độ của chấm tròn
          const starX = xScale.getPixelForValue(index); // Trung tâm cột
          const starY = yScale.getPixelForValue(avgScore); // Tọa độ theo điểm tb lớp

          console.log(`Dot position: x=${starX}, y=${starY}`);

          // Vẽ chấm tròn
          ctx.save();
          ctx.beginPath();
          ctx.arc(starX, starY, 6, 0, Math.PI * 2); // Tăng kích thước chấm
          ctx.fillStyle = "#FFD700"; // Màu vàng đậm hơn
          ctx.fill();
          ctx.strokeStyle = "#FFA500"; // Viền cam
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();

          // Kết nối các chấm với nhau
          if (previousStarX !== null && previousStarY !== null) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(previousStarX, previousStarY); // Điểm bắt đầu (chấm trước đó)
            ctx.lineTo(starX, starY); // Điểm kết thúc (chấm hiện tại)
            ctx.strokeStyle = "#FFD700"; // Màu sắc đường nối
            ctx.lineWidth = 3; // Tăng độ dày đường nối
            ctx.stroke();
            ctx.restore();
          }

          // Cập nhật tọa độ của chấm hiện tại để nối với chấm sau
          previousStarX = starX;
          previousStarY = starY;
        }
      });
    },
  });

  ChartJS.register({
    id: "addPointsAboveBars",
    afterDraw(chart: any) {
      const { ctx, scales } = chart;
      const xScale = scales.x;
      const yScale = scales.y;

      chart.data.datasets.forEach((dataset: any) => {
        if (dataset.type === "bar") {
          // chỉ vẽ số cho cột
          dataset.data.forEach((value: any, index: any) => {
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
        }
      });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white p-4 rounded-xl border hover:shadow-xl transition-shadow h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <FaChartBar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Kết quả học tập</h3>
            <p className="text-xs text-gray-500">Theo dõi điểm số các môn</p>
          </div>
        </div>
        <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 text-sm">
          <span>Xem tất cả</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 flex-grow">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8 flex-grow">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-red-500 text-center text-sm">{error}</p>
        </div>
      ) : classesData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 flex-grow">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <p className="text-gray-500 text-center text-sm">
            Chưa có dữ liệu kết quả học tập
          </p>
        </div>
      ) : (
        <>
          <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 rounded-xl shadow-lg flex-grow h-[400px] border border-gray-100">
            <Bar data={subjectScores} options={chartOptions} />
          </div>
        </>
      )}
    </motion.div>
  );
}
