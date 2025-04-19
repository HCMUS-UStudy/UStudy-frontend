"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import { Button } from "@/app/ui/components/_common/Button";
import { FaCommentDots, FaSearch, FaEye, FaThumbsUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock data - In a real application, this would come from an API
const MOCK_FORUM_POSTS = [
  {
    id: 1,
    title: "Làm thế nào để học tốt môn Toán?",
    content: "Tôi đang gặp khó khăn trong môn Toán, đặc biệt là phần đại số...",
    author: "Nguyễn Văn A",
    createdAt: "2025-04-15",
    views: 156,
    likes: 24,
    comments: 12,
    tags: ["học tập", "toán học"],
  },
  {
    id: 2,
    title: "Chia sẻ kinh nghiệm học tiếng Anh hiệu quả",
    content:
      "Sau nhiều năm học tiếng Anh, tôi muốn chia sẻ một số phương pháp...",
    author: "Trần Thị B",
    createdAt: "2025-04-12",
    views: 320,
    likes: 45,
    comments: 28,
    tags: ["tiếng anh", "học tập"],
  },
  {
    id: 3,
    title: "Thảo luận về phương pháp học nhóm",
    content:
      "Học nhóm có hiệu quả không? Làm sao để tổ chức một nhóm học hiệu quả?",
    author: "Lê Văn C",
    createdAt: "2025-04-10",
    views: 210,
    likes: 32,
    comments: 19,
    tags: ["học nhóm", "phương pháp học"],
  },
  {
    id: 4,
    title: "Khó khăn khi học trực tuyến và cách khắc phục",
    content:
      "Trong thời gian gần đây, việc học trực tuyến gặp nhiều thách thức...",
    author: "Phạm Thị D",
    createdAt: "2025-04-08",
    views: 185,
    likes: 29,
    comments: 21,
    tags: ["học trực tuyến", "e-learning"],
  },
  {
    id: 5,
    title: "Cách chuẩn bị cho kỳ thi THPT Quốc gia",
    content: "Kỳ thi THPT Quốc gia đang đến gần, làm sao để chuẩn bị tốt nhất?",
    author: "Hoàng Văn E",
    createdAt: "2025-04-05",
    views: 412,
    likes: 67,
    comments: 34,
    tags: ["thi cử", "THPT Quốc gia"],
  },
];

export default function ForumPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(MOCK_FORUM_POSTS);

  // Filter posts based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = MOCK_FORUM_POSTS.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
      setPosts(filtered);
    } else {
      setPosts(MOCK_FORUM_POSTS);
    }
  }, [searchQuery]);

  const handleCreatePost = () => {
    router.push("/member/forum/create");
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-darker mb-4 md:mb-0">
          Diễn đàn trao đổi học tập
        </h1>
        <Button
          onClick={handleCreatePost}
          className="bg-primary-darker text-white hover:bg-hover-primary"
        >
          <FaCommentDots className="mr-2" /> Tạo bài viết mới
        </Button>
      </div>

      {/* Search box */}
      <div className="mb-8 relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full p-4 pr-12 border border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-dark" />
        </div>
      </div>

      {/* Forum categories - can be expanded later */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outlined" className="border-primary text-primary-dark">
          Tất cả
        </Button>
        <Button variant="basic" className="text-gray-600">
          Học tập
        </Button>
        <Button variant="basic" className="text-gray-600">
          Khóa học
        </Button>
        <Button variant="basic" className="text-gray-600">
          Thi cử
        </Button>
        <Button variant="basic" className="text-gray-600">
          Thảo luận
        </Button>
      </div>

      {/* Posts list */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post.id}
              className="hover:border-primary-light transition-all duration-200"
            >
              <CardHeader className="flex flex-col md:flex-row justify-between py-3">
                <div>
                  <Link href={`/member/forum/${post.id}`}>
                    <CardTitle className="text-primary-darker hover:text-primary-dark cursor-pointer text-lg">
                      {post.title}
                    </CardTitle>
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    Đăng bởi: <span className="font-medium">{post.author}</span>{" "}
                    • {post.createdAt}
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2 md:mt-0 text-sm text-gray-500">
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
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-gray-700 line-clamp-2">{post.content}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-lighter text-primary-darker text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500 flex justify-end py-2">
                <Link
                  href={`/member/forum/${post.id}`}
                  className="text-primary-dark hover:text-primary-darker font-medium"
                >
                  Xem chi tiết →
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <FaCommentDots className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">
              Không tìm thấy bài viết phù hợp với từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>

      {/* Pagination - simple version */}
      <div className="mt-8 flex justify-center">
        <Button variant="basic" className="mx-1 text-gray-600">
          1
        </Button>
        <Button variant="basic" className="mx-1 text-gray-600">
          2
        </Button>
        <Button variant="basic" className="mx-1 text-gray-600">
          3
        </Button>
        <span className="mx-2 py-2">...</span>
        <Button variant="basic" className="mx-1 text-gray-600">
          10
        </Button>
      </div>
    </div>
  );
}
