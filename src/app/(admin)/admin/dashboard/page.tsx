import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import React from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
} from "react-icons/fa";

const DashboardPage: React.FC = () => {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mr-6">
        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số học viên
            </CardTitle>
            <FaUserGraduate className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              {10}
              <span className="ml-2 text-xs text-blue-600 border border-blue-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng số học viên</CardTitle>
          </CardHeader>
          <CardContent>
            <CardTitle>Tổng số học viên</CardTitle>
            <CardDescription>Content</CardDescription>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số giáo viên
            </CardTitle>
            <FaChalkboardTeacher className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              {10}
              <span className="ml-2 text-xs text-green-600 border border-green-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số giáo vụ
            </CardTitle>
            <FaBuilding className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              {10}
              <span className="ml-2 text-xs text-red-600 border border-red-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;
