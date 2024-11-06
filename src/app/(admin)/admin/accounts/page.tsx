import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/card';
import { FaUserGraduate, FaChalkboardTeacher, FaBuilding } from 'react-icons/fa'; // Importing icons

const AccountPage: React.FC = () => {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight my-4">Quản lý tài khoản</h2>
      <div className="flex-1 space-y-4">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
            <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
              <CardTitle className="text-base font-semibold text-gray-800">Tổng số học viên</CardTitle>
              <FaUserGraduate className="h-5 w-5 text-black" /> {/* Icon for students */}
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                11.000
                <span className="ml-2 text-xs text-blue-600 border border-blue-600 rounded-full px-1 py-0.5">
                  +5.00%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
            <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
              <CardTitle className="text-base font-semibold text-gray-800">Tổng số giáo viên</CardTitle>
              <FaChalkboardTeacher className="h-5 w-5 text-black" /> {/* Icon for teachers */}
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                3000
                <span className="ml-2 text-xs text-green-600 border border-green-600 rounded-full px-1 py-0.5">
                  +5.00%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
            <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
              <CardTitle className="text-base font-semibold text-gray-800">Tổng số giáo vụ</CardTitle>
              <FaBuilding className="h-5 w-5 text-black" /> {/* Icon for staff */}
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                50
                <span className="ml-2 text-xs text-red-600 border border-red-600 rounded-full px-1 py-0.5">
                  +5.00%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
