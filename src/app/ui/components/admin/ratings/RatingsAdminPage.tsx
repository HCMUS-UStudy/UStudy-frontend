"use client";

import { useEffect, useState } from "react";
import { getListCourseGradeRatings } from "@/app/lib/services/rating";
import { CourseGradeRatingOverview } from "@/app/types/rating";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/ui/components/_common/Table";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface RatingsAdminPageProps {
  searchQuery?: string;
}

// export const mockCourseGradeRatings: CourseGradeRatingOverview[] = [
//   {
//     rating: 4.5,
//     numRatings: 12,
//     course: { id: "c1", name: "Toán học" },
//     grade: { id: "g1", name: "Khối 12" },
//   },
//   {
//     rating: 3.8,
//     numRatings: 8,
//     course: { id: "c2", name: "Văn học" },
//     grade: { id: "g2", name: "Khối 11" },
//   },
// ];

// Hàm render sao
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

export default function RatingsAdminPage({
  searchQuery,
}: RatingsAdminPageProps) {
  const [data, setData] = useState<CourseGradeRatingOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getListCourseGradeRatings(0, 10);
        let content = res?.data?.content || [];

        // if (content.length === 0) {
        //   content = mockCourseGradeRatings; // fallback mock data
        // }

        if (searchQuery) {
          content = content.filter(
            (item) =>
              item.course.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.grade.name.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }
        setData(content);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <Table>
      <TableHeader
        columns={["Môn học", "Khối", "Đánh giá TB", "Số lượt đánh giá"]}
        classNameTH={["", "", "text-center", "text-center"]}
      />
      <TableBody isLoading={loading}>
        {data.map((item, idx) => (
          <TableRow
            key={idx}
            className="cursor-pointer"
            onClick={() =>
              router.push(
                `/admin/ratings/courseGrade/${item.course.id}/${item.grade.id}`,
              )
            }
          >
            <TableCell>{item.course.name}</TableCell>
            <TableCell>{item.grade.name}</TableCell>
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
  );
}
