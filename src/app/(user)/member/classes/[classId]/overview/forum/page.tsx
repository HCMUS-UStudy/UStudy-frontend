"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import { FaCommentDots } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { FaArrowLeft, FaSort } from "react-icons/fa6";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import PostsList from "@/app/ui/components/user/student/forum/PostsList";

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
  const pathname = usePathname();
  const classId = pathname.split("/")[3]; // Lấy classId từ URL
  const [searchQuery] = useState("");
  const [posts, setPosts] = useState(MOCK_FORUM_POSTS);
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeTab, setActiveTab] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // Define how many posts to show per page
  const totalPages = Math.ceil(posts.length / postsPerPage);

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
    router.push(`/member/classes/${classId}/overview/forum/create`);
  };

  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="px-2">
      <Button
        variant="basic"
        onClick={handleBackClick}
        className="mb-4 flex items-center hover:bg-primary-lighter"
      >
        <FaArrowLeft className="mr-2" /> Quay lại tổng quan
      </Button>

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

      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap mt-2 mb-6 overflow-x-auto">
        <SearchField
          className="w-full sm:w-auto flex-1 min-w-[200px] bg-primary-lighter py-[2px] rounded-2xl"
          placeholder="Tìm kiếm bài viết..."
        />
        <div className="flex items-center gap-2 whitespace-nowrap px-2">
          <span className="text-primary-darkest font-medium">
            Sắp xếp theo ngày:
          </span>
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition whitespace-nowrap"
          >
            <span className="mr-2 text-primary-dark">
              {sortOrder === "asc" ? "Cũ nhất" : "Mới nhất"}
            </span>
            <FaSort size={15} />
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onTabChange={setActiveTab} className="mb-6">
        <TabList className="mb-4 flex flex-wrap gap-2">
          <Tab label="Tất cả" value="All" />
          <Tab label="Học tập" value="Study" />
          <Tab label="Khóa học" value="Course" />
          <Tab label="Thi cử" value="Exam" />
          <Tab label="Thảo luận" value="Discussion" />
        </TabList>

        <TabPanel value="All">
          <div>Hiển thị tất cả bài viết</div>
        </TabPanel>

        <TabPanel value="Study">
          <div>Nội dung học tập</div>
        </TabPanel>

        <TabPanel value="Course">
          <div>Nội dung khóa học</div>
        </TabPanel>

        <TabPanel value="Exam">
          <div>Nội dung thi cử</div>
        </TabPanel>

        <TabPanel value="Discussion">
          <div>Nội dung thảo luận</div>
        </TabPanel>
      </Tabs>

      {/* Posts list */}
      <PostsList
        posts={currentPosts}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
