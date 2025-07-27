"use client";
import { Users, GraduationCap, Bell, BookOpen, TrendingUp } from "lucide-react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "@/app/ui/components/_common/Card";
import Notifications from "../../../ui/components/admin/dashboard/notifications";
import { useAppSelector } from "@/app/store/store";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardData } from "@/app/lib/services";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

// Mock data for charts
const studentRegistrationData = {
  labels: [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ],
  datasets: [
    {
      label: "Học viên đăng ký",
      data: [45, 52, 38, 45, 58, 62, 55, 48, 65, 70, 75, 80],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
    },
  ],
};

const classCompletionData = {
  labels: ["Hoàn thành", "Đang học", "Chưa bắt đầu"],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: [
        "rgba(16, 185, 129, 0.8)",
        "rgba(59, 130, 246, 0.8)",
        "rgba(245, 158, 11, 0.8)",
      ],
    },
  ],
};

const studentLevelData = {
  labels: ["Tiểu học", "THCS", "THPT", "Đại học", "Khác"],
  datasets: [
    {
      label: "Số học viên",
      data: [150, 280, 420, 180, 50],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(139, 92, 246, 0.8)",
      ],
    },
  ],
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
}) => (
  <Card className="p-6 bg-foreground border-2 border-slate-200 transition-all duration-300 hover:bg-primary-lighter hover:shadow-lg hover:border-primary-dark">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={`text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}%
            </span>
            <TrendingUp
              className={`w-4 h-4 ml-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
            />
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-full transition-all duration-300 group-hover:bg-blue-100">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </Card>
);

const DashboardPage = () => {
  const selectedBranchId =
    useAppSelector((state) => state.branch.selectedBranchId) || "";
  const { data, status } = useQuery({
    queryKey: ["AdminOverview", selectedBranchId],
    queryFn: () => getAdminDashboardData(selectedBranchId),
    refetchOnWindowFocus: false,
    enabled: selectedBranchId !== null && selectedBranchId !== "",
  });
  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      {status === "pending" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border-2 border-slate-200 h-32 bg-slate-200 animate-pulse"></div>
          <div className="border-2 border-slate-200 h-32 bg-slate-200 animate-pulse"></div>
          <div className="border-2 border-slate-200 h-32 bg-slate-200 animate-pulse"></div>
          <div className="border-2 border-slate-200 h-32 bg-slate-200 animate-pulse"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng học viên"
            value={data?.totalStudents.toLocaleString() || ""}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Tổng giáo viên"
            value={data?.totalTeachers.toLocaleString() || ""}
            icon={GraduationCap}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Tổng lớp học"
            value={data?.totalClasses.toLocaleString() || ""}
            icon={BookOpen}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Doanh thu của chi nhánh"
            value={`${data?.totalRevenue.toLocaleString()} vnđ` || ""}
            icon={Bell}
            trend={{ value: 5, isPositive: false }}
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <Notifications />
        {/* Class Completion Rate */}
        <Card className="p-6 bg-foreground border-2 border-slate-200 transition-all duration-300 hover:bg-primary-lighter hover:shadow-lg hover:border-primary-dark">
          <h3 className="text-lg font-semibold mb-4">
            Tỷ lệ hoàn thành lớp học
          </h3>
          <div className="h-[300px]">
            <Doughnut
              data={classCompletionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Level Distribution */}
        <Card className="p-6 bg-foreground border-2 border-slate-200 transition-all duration-300 hover:bg-primary-lighter hover:shadow-lg hover:border-primary-dark">
          <h3 className="text-lg font-semibold mb-4">
            Phân bố học viên theo cấp học
          </h3>
          <div className="h-[300px]">
            <Bar
              data={studentLevelData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Số học viên",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Cấp học",
                    },
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Student Registration Chart */}
        <Card className="p-6 bg-foreground border-2 border-slate-200 transition-all duration-300 hover:bg-primary-lighter hover:shadow-lg hover:border-primary-dark">
          <h3 className="text-lg font-semibold mb-4">
            Học viên đăng ký theo tháng
          </h3>
          <div className="h-[300px]">
            <Line
              data={studentRegistrationData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
