"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBuilding,
  FaFileAlt,
  FaBook,
  FaLayerGroup,
  FaClock,
  FaUserShield,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// Card component for displaying statistics
const StatCard = ({
  title,
  count,
  icon,
  color,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <div className={`flex w-full bg-white rounded-2xl shadow-md p-4`}>
      <div className="flex flex-col gap-2 flex-1 justify-center">
        <div className="text-2xl font-bold text-primary-darker">{count}</div>
        <div className="text-md text-gray-500">{title}</div>
      </div>
      <div
        className={`flex items-center justify-center p-4 rounded-full bg-opacity-20 ${color}`}
      >
        <div className={`text-2xl ${color.replace("bg-", "text-")}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Component for displaying charts
const ChartCard = ({
  title,
  children,
  height = "h-64",
}: {
  title: string;
  children: React.ReactNode;
  height?: string;
}) => {
  return (
    <div
      className={`bg-white flex flex-col gap-2 ${height} rounded-2xl shadow-md p-4`}
    >
      <h3 className="text-lg font-semibold text-primary-darker border-b pb-2">
        {title}
      </h3>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
};

// Table component for displaying recent data
const RecentActivityTable = ({
  data,
  columns,
}: {
  data: any[];
  columns: string[];
}) => {
  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column, index) => (
              <th
                key={index}
                className="text-left py-2 px-3 text-sm font-medium text-gray-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {Object.values(row).map((cell: any, cellIndex) => (
                <td key={cellIndex} className="py-2 px-3 text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DashboardPage = () => {
  // Sample data for demonstration - in a real app, this would come from API calls
  const [stats, setStats] = useState({
    students: 1250,
    teachers: 75,
    branches: 8,
    materials: 345,
    courses: 42,
    grades: 12,
    sessions: 28,
    roles: 5,
    tuition: 1250000000,
  });

  // Sample data for charts
  const roleDistribution = [
    { name: "Admin", value: 5 },
    { name: "Teacher", value: 75 },
    { name: "Student", value: 1250 },
    { name: "Parent", value: 850 },
    { name: "Clerk", value: 20 },
  ];

  const monthlyRevenue = [
    { name: "Jan", revenue: 120000000 },
    { name: "Feb", revenue: 150000000 },
    { name: "Mar", revenue: 180000000 },
    { name: "Apr", revenue: 160000000 },
    { name: "May", revenue: 210000000 },
    { name: "Jun", revenue: 240000000 },
    { name: "Jul", revenue: 230000000 },
    { name: "Aug", revenue: 250000000 },
    { name: "Sep", revenue: 270000000 },
    { name: "Oct", revenue: 260000000 },
    { name: "Nov", revenue: 290000000 },
    { name: "Dec", revenue: 310000000 },
  ];

  const coursePopularity = [
    { name: "Math", students: 450 },
    { name: "Physics", students: 380 },
    { name: "Chemistry", students: 320 },
    { name: "Biology", students: 280 },
    { name: "Literature", students: 350 },
  ];

  const dailyActivity = [
    { date: "15/04", logins: 320, classes: 28 },
    { date: "16/04", logins: 332, classes: 32 },
    { date: "17/04", logins: 301, classes: 30 },
    { date: "18/04", logins: 334, classes: 35 },
    { date: "19/04", logins: 390, classes: 38 },
    { date: "20/04", logins: 330, classes: 25 },
    { date: "21/04", logins: 320, classes: 28 },
  ];

  // Sample data for teacher rankings
  const topTeachers = [
    { name: "Nguyễn Văn A", rating: 4.9, students: 120, subject: "Math" },
    { name: "Trần Thị B", rating: 4.8, students: 110, subject: "Physics" },
    { name: "Lê Văn C", rating: 4.8, students: 95, subject: "Chemistry" },
  ];

  // Sample data for recent enrollments
  const recentEnrollments = [
    { student: "Nguyễn Văn X", class: "Math 101", date: "19/04/2025" },
    { student: "Trần Thị Y", class: "Physics Advanced", date: "18/04/2025" },
    { student: "Lê Văn Z", class: "Chemistry Basics", date: "18/04/2025" },
    { student: "Phạm Thị W", class: "Biology 202", date: "17/04/2025" },
  ];

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Simulate fetching data on component mount
  useEffect(() => {
    // In a real app, you would fetch actual data from your API here
    const fetchDashboardData = async () => {
      try {
        // Simulated API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update stats with fetched data (using our sample data for now)
        setStats({
          students: 1250,
          teachers: 75,
          branches: 8,
          materials: 345,
          courses: 42,
          grades: 12,
          sessions: 28,
          roles: 5,
          tuition: 1250000000,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="text-2xl font-bold text-primary-darker">
        Dashboard Overview
      </h1>

      {/* Main statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Học sinh"
          count={stats.students}
          icon={<FaUserGraduate />}
          color="bg-blue-500"
        />
        <StatCard
          title="Giáo viên"
          count={stats.teachers}
          icon={<FaChalkboardTeacher />}
          color="bg-green-500"
        />
        <StatCard
          title="Chi nhánh"
          count={stats.branches}
          icon={<FaBuilding />}
          color="bg-purple-500"
        />
        <StatCard
          title="Tài liệu"
          count={stats.materials}
          icon={<FaFileAlt />}
          color="bg-yellow-500"
        />
      </div>

      {/* Additional statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Môn học"
          count={stats.courses}
          icon={<FaBook />}
          color="bg-indigo-500"
        />
        <StatCard
          title="Khối học"
          count={stats.grades}
          icon={<FaLayerGroup />}
          color="bg-pink-500"
        />
        <StatCard
          title="Ca học"
          count={stats.sessions}
          icon={<FaClock />}
          color="bg-cyan-500"
        />
        <StatCard
          title="Chức vụ"
          count={stats.roles}
          icon={<FaUserShield />}
          color="bg-orange-500"
        />
        <StatCard
          title="Học phí"
          count={stats.tuition}
          icon={<FaMoneyBillWave />}
          color="bg-emerald-500"
        />
      </div>

      {/* Charts and detailed info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Doanh thu theo tháng" height="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenue}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Role distribution */}
        <div>
          <ChartCard title="Phân bố chức vụ" height="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Second row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course popularity */}
        <ChartCard title="Số học sinh theo môn học" height="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={coursePopularity}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" name="Học sinh" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily activity */}
        <ChartCard title="Hoạt động hàng ngày" height="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyActivity}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="logins"
                name="Lượt đăng nhập"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="classes"
                name="Lớp học"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top teachers */}
        <ChartCard title="Giáo viên tiêu biểu" height="h-64">
          <RecentActivityTable
            columns={["Tên giáo viên", "Đánh giá", "Số học sinh", "Bộ môn"]}
            data={topTeachers}
          />
        </ChartCard>

        {/* Recent enrollments */}
        <ChartCard title="Đăng ký gần đây" height="h-64">
          <RecentActivityTable
            columns={["Học sinh", "Lớp học", "Ngày đăng ký"]}
            data={recentEnrollments}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardPage;
