// PostsList.tsx
import React from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaEye,
  FaThumbsUp,
  FaCommentDots,
} from "react-icons/fa";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../_common/Card";
import Pagination from "../../../_common/Pagination";
import { usePathname } from "next/navigation";

interface Post {
  id: number; // Change id type from string to number based on your mock data
  title: string;
  author: string;
  createdAt: string;
  content: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
}

interface PostsListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PostsList: React.FC<PostsListProps> = ({
  posts,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const pathname = usePathname();
  const classId = pathname.split("/")[3]; // Lấy classId từ URL

  return (
    <div className="space-y-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post.id}
            className="transition-all duration-200 border border-gray-200 hover:border-primary-light shadow-sm rounded-2xl"
          >
            <CardHeader className="p-4 border-b border-gray-100">
              <Link
                href={`/member/classes/${classId}/overview/forum/${post.id}`}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-primary-darker hover:text-primary-dark transition-colors font-semibold cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <div className="text-sm text-gray-500 mt-1 flex items-center">
                    <FaUser className="mr-1 text-primary-dark" />
                    <span className="font-medium">{post.author}</span>
                    <span className="mx-2">•</span>
                    <FaCalendarAlt className="mr-1 text-primary-dark" />
                    {post.createdAt}
                  </div>
                </div>
              </Link>
            </CardHeader>

            <CardContent className="px-4 py-3 text-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <p className="line-clamp-2 leading-relaxed">{post.content}</p>
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-lighter text-primary-dark text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center">
                    <FaEye className="mr-1 text-primary-dark" />
                    <span>
                      <b>{post.views}</b> lượt xem
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaThumbsUp className="mr-1 text-primary-dark" />
                    <span>
                      <b>{post.likes}</b> lượt thích
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCommentDots className="mr-1 text-primary-dark" />
                    <span>
                      <b>{post.comments}</b> bình luận
                    </span>
                  </div>
                </div>

                <Link
                  href={`/member/classes/${classId}/overview/forum/${post.id}`}
                  className="text-primary-dark hover:text-primary-darker font-medium transition"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm">
          <FaCommentDots className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">
            Không tìm thấy bài viết phù hợp với từ khóa tìm kiếm
          </p>
        </div>
      )}

      {/* Pagination */}
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
  );
};

export default PostsList;
