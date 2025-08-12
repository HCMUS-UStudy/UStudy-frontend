"use client";

import { useEffect, useState } from "react";
import { getListTeacherRatings } from "@/app/lib/services/rating";
import { TeacherRatingOverview } from "@/app/types/rating";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/ui/components/_common/Table";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "@/app/ui/components/_common/Pagination";

interface RatingsTeacherPageProps {
  searchQuery?: string;
}

// export const mockTeacherRatings: TeacherRatingOverview[] = [
//   {
//     rating: 4.7,
//     numRatings: 20,
//     teacher: {
//       id: "t1",
//       genId: "T001",
//       email: "teacher.a@example.com",
//       name: "Nguyễn Văn A",
//       avatar: "",
//       role: { id: "r1", name: "Giáo viên", defaultRoute: "TEACHER" },
//     },
//   },
//   {
//     rating: 4.2,
//     numRatings: 15,
//     teacher: {
//       id: "t2",
//       genId: "T002",
//       email: "teacher.b@example.com",
//       name: "Trần Thị B",
//       avatar: "",
//       role: { id: "r1", name: "Giáo viên", defaultRoute: "TEACHER" },
//     },
//   },
// ];

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

export default function RatingsTeacherPage({
  searchQuery,
}: RatingsTeacherPageProps) {
  const [data, setData] = useState<TeacherRatingOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const page = currentPage - 1; // Backend uses 0-based pagination
        const res = await getListTeacherRatings(page, itemsPerPage);
        let content = res?.data?.content || [];
        const totalElements = res?.data?.totalElements || 0;

        if (searchQuery) {
          content = content.filter(
            (item) =>
              item.teacher.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.teacher.email
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          );
        }

        setData(content);
        setTotalPages(Math.ceil(totalElements / itemsPerPage) || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, currentPage]);

  return (
    <>
      <Table>
        <TableHeader
          columns={[
            "Tên giáo viên",
            "Email",
            "Đánh giá TB",
            "Số lượt đánh giá",
          ]}
          classNameTH={["", "", "text-center", "text-center"]}
        />
        <TableBody isLoading={loading}>
          {data.map((item, idx) => (
            <TableRow
              key={idx}
              className="cursor-pointer"
              onClick={() =>
                router.push(`/admin/ratings/teacher/${item.teacher.id}`)
              }
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.teacher.avatar ? (
                    <Image
                      src={item.teacher.avatar}
                      alt={item.teacher.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary-darkest font-semibold">
                      {item.teacher.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {item.teacher.name}
                </div>
              </TableCell>
              <TableCell>{item.teacher.email}</TableCell>
              <TableCell className="text-center">
                <div className="inline-flex items-center justify-center gap-1">
                  <span>{item.rating.toFixed(1)}</span>
                  <span className="flex pb-1">{renderStars(item.rating)}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{item.numRatings}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </>
  );
}
