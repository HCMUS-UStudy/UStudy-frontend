"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/ui/components/_common/Table";
import { FaArrowLeft } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Pagination from "@/app/ui/components/_common/Pagination";
// Giả sử backend có hàm lấy detail đánh giá của giáo viên (tương tự courseGrade)
import { getTeacherRatingsDetails } from "@/app/lib/services/rating";
import { TeacherRatingDetail } from "@/app/types/rating";
import { SearchField } from "@/app/ui/components/_common/text-field";

// Mock data nếu backend chưa có
// const mockTeacherDetails: TeacherRatingDetail[] = [
//   {
//     id: "td1",
//     rating: 4.8,
//     comment: "Thầy dạy rất dễ hiểu và nhiệt tình!",
//     ratedBy: {
//       id: "s1",
//       genId: "ST001",
//       email: "student1@example.com",
//       name: "Nguyễn Văn A",
//       avatar: "",
//       role: { id: "r1", name: "Học sinh", defaultRoute: "STUDENT" },
//     },
//     createdAt: "2024-08-10T08:30:00Z",
//   },
//   {
//     id: "td2",
//     rating: 3.9,
//     comment: "Cần tăng cường thêm bài tập về nhà.",
//     ratedBy: {
//       id: "s2",
//       genId: "ST002",
//       email: "student2@example.com",
//       name: "Trần Thị B",
//       avatar: "",
//       role: { id: "r1", name: "Học sinh", defaultRoute: "STUDENT" },
//     },
//     createdAt: "2024-08-09T15:00:00Z",
//   },
// ];

interface PageProps {
  params: Promise<{ teacherId: string }>;
}

function renderStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar
        key={"full" + i}
        className="text-yellow-400 inline-block w-4 h-4"
      />,
    );
  }
  if (hasHalfStar) {
    stars.push(
      <FaStarHalfAlt
        key="half"
        className="text-yellow-400 inline-block w-4 h-4"
      />,
    );
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar
        key={"empty" + i}
        className="text-yellow-400 inline-block w-4 h-4"
      />,
    );
  }
  return stars;
}

export default function TeacherRatingsDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { teacherId } = resolvedParams;
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<TeacherRatingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const page = currentPage - 1; // Backend uses 0-based pagination
        const res = await getTeacherRatingsDetails(
          teacherId,
          page,
          itemsPerPage,
        );
        const content = res?.data?.content || [];
        const totalElements = res?.data?.totalElements || 0;

        setData(content);
        setTotalPages(Math.ceil(totalElements / itemsPerPage) || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [teacherId, currentPage]);

  const filteredData = data.filter(
    (item) =>
      item.comment.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ratedBy.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ratedBy.email.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 mb-4 text-primary hover:text-primary-dark"
      >
        <FaArrowLeft />
        Quay lại
      </button>

      {/* Tổng số đánh giá */}
      <h2
        className={`text-lg md:text-xl font-bold ${
          loading ? "animate-pulse text-gray-400" : ""
        }`}
      >
        Tổng số đánh giá (
        {loading ? "Đang tải..." : filteredData.length.toLocaleString("vi-VN")})
      </h2>

      <div className="flex items-center justify-between mt-4 mb-4 gap-2 md:gap-14">
        <SearchField
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Tìm kiếm đánh giá..."
        />
      </div>

      <Table>
        <TableHeader
          columns={[
            "Học sinh",
            "Email",
            "Đánh giá",
            "Bình luận",
            "Ngày đánh giá",
          ]}
          classNameTH={["", "", "text-center", "", "text-center"]}
        />
        <TableBody isLoading={loading} noDataMessage={true}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.ratedBy.name}</TableCell>
                <TableCell>{item.ratedBy.email}</TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>{item.rating.toFixed(1)}</span>
                    <span className="flex pb-1">
                      {renderStars(item.rating)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{item.comment}</TableCell>
                <TableCell className="text-center">
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                Không có dữ liệu phù hợp
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={(page) => setCurrentPage(page)}
          handlePreviousPage={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          handleNextPage={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      </div>
    </div>
  );
}
