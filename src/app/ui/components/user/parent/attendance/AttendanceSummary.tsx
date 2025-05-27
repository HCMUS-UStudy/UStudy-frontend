"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../_common/Card";

interface AttendanceData {
  dates: Record<string, AttendanceRecord>;
  summary: AttendanceSummary;
  subjects: Record<string, SubjectAttendance>;
}

interface AttendanceRecord {
  status: AttendanceStatus;
  subject: string;
  time: string;
  reason?: string;
  lateMinutes?: number;
}

interface AttendanceSummary {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
}

interface SubjectAttendance {
  present: number;
  absent: number;
  late: number;
  total: number;
}

type AttendanceStatus = "present" | "absent" | "late";

interface Props {
  mockAttendanceData: AttendanceData;
  selectedYear: number;
}

export default function AttendanceSummary({
  mockAttendanceData,
  selectedYear,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-white border border-primary-light shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary-darkest">
            Thống kê điểm danh
          </CardTitle>
          <CardDescription className="text-primary-dark">
            Tỷ lệ điểm danh năm học {selectedYear - 1}-{selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {mockAttendanceData.summary.presentPercentage}%
              </div>
              <div className="text-green-800 text-center">Có mặt</div>
              <div className="text-green-600 text-center mt-1">
                {mockAttendanceData.summary.present}/
                {mockAttendanceData.summary.totalClasses} buổi
              </div>
            </div>
            <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {mockAttendanceData.summary.absentPercentage}%
              </div>
              <div className="text-red-800 text-center">Vắng mặt</div>
              <div className="text-red-600 text-center mt-1">
                {mockAttendanceData.summary.absent}/
                {mockAttendanceData.summary.totalClasses} buổi
              </div>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {mockAttendanceData.summary.latePercentage}%
              </div>
              <div className="text-yellow-800 text-center">Đi muộn</div>
              <div className="text-yellow-600 text-center mt-1">
                {mockAttendanceData.summary.late}/
                {mockAttendanceData.summary.totalClasses} buổi
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-4 transition-all duration-300"
                style={{
                  width: `${mockAttendanceData.summary.presentPercentage}%`,
                }}
              ></div>
              <div
                className="bg-yellow-500 h-4 transition-all duration-300"
                style={{
                  width: `${mockAttendanceData.summary.latePercentage}%`,
                }}
              ></div>
              <div
                className="bg-red-500 h-4 transition-all duration-300"
                style={{
                  width: `${mockAttendanceData.summary.absentPercentage}%`,
                }}
              ></div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-primary-darkest mb-4">
            Theo môn học
          </h3>
          <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
            {Object.entries(mockAttendanceData.subjects).map(
              ([subject, data]) => (
                <div
                  key={subject}
                  className="border border-primary-light rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{subject}</div>
                    <div className="text-sm text-gray-600">
                      {data.total} buổi học
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="flex h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-2.5"
                        style={{
                          width: `${(data.present / data.total) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="bg-yellow-500 h-2.5"
                        style={{
                          width: `${(data.late / data.total) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="bg-red-500 h-2.5"
                        style={{
                          width: `${(data.absent / data.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-green-600">
                      Có mặt: {data.present}
                    </span>
                    <span className="text-yellow-600">
                      Đi muộn: {data.late}
                    </span>
                    <span className="text-red-600">
                      Vắng mặt: {data.absent}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-primary-light shadow-lg rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-primary-darkest">
            Tư vấn & Nhận xét
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Đánh giá từ giáo viên chủ nhiệm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-sm text-gray-700">
            {/* Nhận xét */}
            <div className="bg-primary-lighter/60 border border-primary-light rounded-lg p-4 shadow-sm">
              <p className="italic leading-relaxed">
                &quot;Học sinh có tần suất tham gia lớp học tốt, tuy nhiên cần
                cải thiện việc đi học đúng giờ ở môn Tiếng Anh và Hóa học.&quot;
              </p>
              <div className="mt-2 text-right text-xs text-gray-500">
                - Giáo viên chủ nhiệm, 15/11/2024
              </div>
            </div>

            {/* Gợi ý cải thiện */}
            <section>
              <h3 className="font-semibold text-primary-darkest mb-2">
                Gợi ý cải thiện
              </h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Cần chú ý đến việc đi học đúng giờ, đặc biệt là các buổi học
                  sáng sớm.
                </li>
                <li>
                  Nên thông báo trước với giáo viên khi có việc đột xuất không
                  thể tham gia lớp học.
                </li>
                <li>
                  Chuẩn bị sẵn sàng đồ dùng học tập từ tối hôm trước để tránh
                  quên và đi trễ.
                </li>
              </ul>
            </section>

            {/* Môn học cần chú ý */}
            <section>
              <h3 className="font-semibold text-primary-darkest mb-2">
                Môn học cần chú ý
              </h3>
              <ul className="space-y-1 list-disc list-inside text-red-600 font-medium">
                <li>Tiếng Anh - Đi trễ 15%</li>
                <li>Hóa học - Vắng 20%</li>
              </ul>
            </section>

            {/* Thành tích điểm danh */}
            <section>
              <h3 className="font-semibold text-primary-darkest mb-2">
                Thành tích điểm danh
              </h3>
              <p className="text-green-700 font-medium">
                🎉 10 buổi học liên tiếp có mặt đầy đủ!
              </p>
            </section>

            {/* Nhắc nhở sắp tới */}
            <section>
              <h3 className="font-semibold text-primary-darkest mb-2">
                Nhắc nhở sắp tới
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>📅 17/04 - Sinh học lúc 7:00</li>
                <li>📅 18/04 - Toán học lúc 6:45</li>
              </ul>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
