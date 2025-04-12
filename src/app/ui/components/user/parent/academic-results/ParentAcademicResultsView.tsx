'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/_common/Card';
import { Tabs, TabList, Tab, TabPanel } from '@/app/ui/components/_common/Tabs';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { BsCalendar3, BsFileText } from 'react-icons/bs';
import { FaChild, FaChartLine, FaCommentDots } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';

// Đăng ký các components cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ParentAcademicResultsView() {
  const [selectedChild, setSelectedChild] = useState('Nguyễn Văn An');
  const [selectedSemester, setSelectedSemester] = useState('HK1');
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  const [activeTab, setActiveTab] = useState('charts');

  // Danh sách con của phụ huynh
  const children = [
    { id: 1, name: 'Nguyễn Văn An', class: '10A1', school: 'THPT Chu Văn An' },
    { id: 2, name: 'Nguyễn Thị Bình', class: '8A2', school: 'THCS Nguyễn Trãi' }
  ];

  // Dữ liệu điểm số theo môn học
  const subjectScores = {
    labels: ["Toán học", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", "GDCD"],
    datasets: [
      {
        label: 'Điểm của con',
        data: [8.5, 7.8, 8.2, 7.5, 8.0, 9.2, 7.6, 8.4, 8.8],
        backgroundColor: 'rgba(190, 229, 209, 0.7)',
        borderColor: 'rgba(120, 174, 145, 1)',
        borderWidth: 1,
      },
      {
        label: 'Điểm trung bình lớp',
        data: [7.8, 7.2, 7.5, 7.0, 7.3, 8.1, 7.0, 7.8, 8.0],
        backgroundColor: 'rgba(217, 217, 217, 0.5)',
        borderColor: 'rgba(150, 150, 150, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Dữ liệu điểm trung bình theo học kỳ
  const progressData = {
    labels: ["HK1 2022-2023", "HK2 2022-2023", "HK1 2023-2024", "HK2 2023-2024"],
    datasets: [
      {
        label: 'Điểm trung bình',
        data: [8.1, 8.3, 8.5, 8.7],
        borderColor: 'rgba(58, 169, 122, 1)',
        backgroundColor: 'rgba(190, 229, 209, 0.2)',
        pointBackgroundColor: 'rgba(58, 169, 122, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(58, 169, 122, 1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Dữ liệu cho biểu đồ radar kỹ năng
  const skillsData = {
    labels: ['Tư duy phản biện', 'Khả năng ghi nhớ', 'Tính tự giác', 'Kỹ năng nhóm', 'Thuyết trình', 'Sáng tạo'],
    datasets: [
      {
        label: 'Kỹ năng của con',
        data: [8.5, 9.0, 7.5, 6.8, 7.2, 8.3],
        backgroundColor: 'rgba(190, 229, 209, 0.3)',
        borderColor: 'rgba(58, 169, 122, 1)',
        pointBackgroundColor: 'rgba(58, 169, 122, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(58, 169, 122, 1)',
        borderWidth: 2,
      },
      {
        label: 'Trung bình lớp',
        data: [7.2, 7.5, 7.0, 7.3, 6.8, 7.1],
        backgroundColor: 'rgba(217, 217, 217, 0.3)',
        borderColor: 'rgba(150, 150, 150, 1)',
        pointBackgroundColor: 'rgba(150, 150, 150, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(150, 150, 150, 1)',
        borderWidth: 2,
      }
    ],
  };

  // Chi tiết điểm số
  const detailedScores = [
    { subject: "Toán học", midterm: 8.0, final: 9.0, average: 8.5, grade: "A", teacher: "Nguyễn Văn A" },
    { subject: "Ngữ văn", midterm: 7.5, final: 8.0, average: 7.8, grade: "B+", teacher: "Trần Thị B" },
    { subject: "Tiếng Anh", midterm: 8.0, final: 8.5, average: 8.2, grade: "A-", teacher: "Lê Văn C" },
    { subject: "Vật lý", midterm: 7.0, final: 8.0, average: 7.5, grade: "B", teacher: "Phạm Thị D" },
    { subject: "Hóa học", midterm: 7.5, final: 8.5, average: 8.0, grade: "B+", teacher: "Võ Văn E" },
    { subject: "Sinh học", midterm: 9.0, final: 9.5, average: 9.2, grade: "A+", teacher: "Nguyễn Thị F" },
    { subject: "Lịch sử", midterm: 7.0, final: 8.0, average: 7.6, grade: "B", teacher: "Trần Văn G" },
    { subject: "Địa lý", midterm: 8.0, final: 8.5, average: 8.4, grade: "A-", teacher: "Lê Thị H" },
    { subject: "GDCD", midterm: 8.5, final: 9.0, average: 8.8, grade: "A", teacher: "Phạm Văn I" },
  ];

  // Thông tin về hạnh kiểm và chuyên cần
  const attendanceData = {
    present: 90,
    late: 5,
    absent: 5,
    behaviorGrade: "Tốt"
  };

  // Tính điểm trung bình tổng
  const overallAverage = detailedScores.reduce((sum, item) => sum + item.average, 0) / detailedScores.length;
  
  // Xếp loại học lực
  const getAcademicRanking = (score: number) => {
    if (score >= 9.0) return { label: "Xuất sắc", color: "text-red-600" };
    if (score >= 8.0) return { label: "Giỏi", color: "text-green-600" };
    if (score >= 7.0) return { label: "Khá", color: "text-blue-600" };
    if (score >= 5.0) return { label: "Trung bình", color: "text-yellow-600" };
    return { label: "Yếu", color: "text-gray-600" };
  };

  const ranking = getAcademicRanking(overallAverage);

  // Nhận xét từ các giáo viên
  const teacherComments = [
    {
      teacher: "Cô Nguyễn Thị Hương",
      role: "Giáo viên chủ nhiệm",
      comment: "Em An có khả năng học tập tốt, đặc biệt trong các môn khoa học tự nhiên. Cần cố gắng hơn trong môn Ngữ văn và tích cực tham gia các hoạt động nhóm. Tinh thần học tập nghiêm túc, có tiềm năng phát triển tốt trong tương lai.",
      date: "20/10/2023"
    },
    {
      teacher: "Thầy Trần Văn Bình",
      role: "Giáo viên Toán",
      comment: "Em An có năng lực tư duy logic tốt, giải quyết bài tập nhanh và chính xác. Tuy nhiên, cần chú ý hơn đến việc trình bày bài tập và làm thêm các dạng bài tập nâng cao.",
      date: "18/10/2023"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Chọn con */}
      <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Chọn học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {children.map((child) => (
              <div
                key={child.id}
                onClick={() => setSelectedChild(child.name)}
                className={`p-4 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                  selectedChild === child.name
                    ? 'bg-primary-light border-2 border-primary-dark shadow-md'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="p-2 bg-primary-darker rounded-full">
                  <FaChild className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{child.name}</h3>
                  <p className="text-xs text-gray-600">{child.class} - {child.school}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Thông tin chung */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary-light hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Điểm TB</CardTitle>
            <FaChartLine className="h-5 w-5 text-primary-darker" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-darkest">{overallAverage.toFixed(1)}</div>
            <p className={`text-sm font-medium ${ranking.color}`}>{ranking.label}</p>
          </CardContent>
        </Card>

        <Card className="border-primary-light hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Xếp hạng</CardTitle>
            <IoMdSchool className="h-5 w-5 text-primary-darker" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-darkest">5/30</div>
            <p className="text-sm font-medium text-gray-600">Trong lớp</p>
          </CardContent>
        </Card>

        <Card className="border-primary-light hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Học kỳ</CardTitle>
            <BsCalendar3 className="h-5 w-5 text-primary-darker" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-darkest">{selectedSemester}</div>
            <p className="text-sm font-medium text-gray-600">{selectedYear}</p>
          </CardContent>
        </Card>

        <Card className="border-primary-light hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Môn học</CardTitle>
            <BsFileText className="h-5 w-5 text-primary-darker" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-darkest">{detailedScores.length}</div>
            <p className="text-sm font-medium text-gray-600">Tổng số môn</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc học kỳ và năm học */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border border-primary-light shadow-sm">
        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Học kỳ</label>
          <select
            id="semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="HK1">Học kỳ 1</option>
            <option value="HK2">Học kỳ 2</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Năm học</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="2022-2023">2022-2023</option>
            <option value="2023-2024">2023-2024</option>
          </select>
        </div>
      </div>

      {/* Tabs cho biểu đồ và bảng điểm */}
      <Tabs value={activeTab} onTabChange={setActiveTab} className="w-full">
        <TabList className="grid w-full max-w-md grid-cols-3 mx-auto mb-4">
          <Tab label="Biểu đồ" value="charts" />
          <Tab label="Chi tiết điểm số" value="details" />
          <Tab label="Nhận xét" value="comments" />
        </TabList>
        
        <TabPanel value="charts" className="space-y-6">
          {/* Biểu đồ điểm theo môn học */}
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
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 10,
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Biểu đồ tiến độ học tập */}
          <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Tiến độ học tập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line 
                  data={progressData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 10,
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Biểu đồ radar kỹ năng */}
          <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Đánh giá kỹ năng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Radar 
                  data={skillsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        min: 0,
                        max: 10,
                        ticks: {
                          stepSize: 2
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabPanel>
        
        <TabPanel value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle>Chi tiết điểm số</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-primary-lighter border-b border-primary-light">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Môn học</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Điểm giữa kỳ</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Điểm cuối kỳ</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Điểm TB</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Điểm chữ</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giáo viên</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedScores.map((score, index) => (
                          <tr 
                            key={index} 
                            className={`border-b border-gray-200 hover:bg-primary-lighter transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{score.subject}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-700">{score.midterm.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-700">{score.final.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm font-medium text-primary-darkest">{score.average.toFixed(1)}</td>
                            <td className="px-4 py-3 text-center text-sm font-medium text-primary-darkest">{score.grade}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{score.teacher}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-primary-lighter border-t border-primary-light">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">Điểm trung bình tổng</td>
                          <td colSpan={2} className="px-4 py-3"></td>
                          <td className="px-4 py-3 text-center text-sm font-bold text-primary-darkest">{overallAverage.toFixed(1)}</td>
                          <td colSpan={2} className="px-4 py-3 text-center text-sm font-bold text-primary-darkest">
                            <span className={`font-bold ${ranking.color}`}>{ranking.label}</span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow mb-6">
                <CardHeader>
                  <CardTitle>Chuyên cần</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Đi học đầy đủ</span>
                        <span className="text-sm font-medium text-gray-800">{attendanceData.present}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${attendanceData.present}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Đi học muộn</span>
                        <span className="text-sm font-medium text-gray-800">{attendanceData.late}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${attendanceData.late}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Vắng mặt</span>
                        <span className="text-sm font-medium text-gray-800">{attendanceData.absent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${attendanceData.absent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle>Hạnh kiểm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center flex-col p-6">
                    <div className="text-4xl font-bold text-primary-darkest mb-2">{attendanceData.behaviorGrade}</div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel value="comments">
          <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Nhận xét của giáo viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teacherComments.map((comment, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-primary-lighter rounded-lg border border-primary-light"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary-darker rounded-full h-fit">
                        <FaCommentDots className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 mb-4 italic">
                          "{comment.comment}"
                        </p>
                        <div className="flex flex-wrap justify-between items-end">
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">{comment.teacher}</p>
                            <p>{comment.role}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Ngày: {comment.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Phụ huynh có thể liên hệ trực tiếp với giáo viên bộ môn hoặc giáo viên chủ nhiệm để biết thêm thông tin chi tiết về kết quả học tập của con.
                </p>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
} 