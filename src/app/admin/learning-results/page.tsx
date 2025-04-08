'use client';

import { useState, ChangeEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Dữ liệu giả định
const mockData = [
  {
    id: 1,
    studentName: "Nguyễn Văn A",
    studentId: "SV001",
    subject: "Toán cao cấp",
    midtermScore: 8.5,
    finalScore: 7.5,
    averageScore: 8.0,
    semester: "2023-2024-1",
    status: "Đạt",
  },
  {
    id: 2,
    studentName: "Trần Thị B",
    studentId: "SV002",
    subject: "Lập trình web",
    midtermScore: 9.0,
    finalScore: 8.5,
    averageScore: 8.75,
    semester: "2023-2024-1",
    status: "Đạt",
  },
  {
    id: 3,
    studentName: "Lê Văn C",
    studentId: "SV003",
    subject: "Cơ sở dữ liệu",
    midtermScore: 7.0,
    finalScore: 8.0,
    averageScore: 7.5,
    semester: "2023-2024-1",
    status: "Đạt",
  },
];

const semesters = [
  "2023-2024-1",
  "2023-2024-2",
  "2022-2023-1",
  "2022-2023-2",
];

export default function LearningResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const filteredData = mockData.filter((item) => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = selectedSemester === "all" || item.semester === selectedSemester;
    
    return matchesSearch && matchesSemester;
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý kết quả học tập</h1>
          <p className="text-muted-foreground">
            Xem và quản lý kết quả học tập của sinh viên
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xuất dữ liệu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm kết quả
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên sinh viên, mã sinh viên hoặc môn học..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả học kỳ</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SV</TableHead>
                  <TableHead>Tên sinh viên</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead>Điểm giữa kỳ</TableHead>
                  <TableHead>Điểm cuối kỳ</TableHead>
                  <TableHead>Điểm trung bình</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Học kỳ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.studentId}</TableCell>
                    <TableCell>{item.studentName}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>{item.midtermScore}</TableCell>
                    <TableCell>{item.finalScore}</TableCell>
                    <TableCell className="font-medium">{item.averageScore}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "Đạt" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>{item.semester}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 