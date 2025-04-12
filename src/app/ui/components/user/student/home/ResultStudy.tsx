/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function ResultStudy() {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          Kết quả học tập
        </h3>
        <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center">
          <span>Xem thêm</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
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
      <div className="relative bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg shadow-md flex-grow h-[400px]">
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
    </motion.div>
  );
}
