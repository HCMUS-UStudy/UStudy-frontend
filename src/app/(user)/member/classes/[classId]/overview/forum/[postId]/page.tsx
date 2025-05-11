"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/app/ui/components/_common/Button";
import { FaCommentDots, FaArrowLeft } from "react-icons/fa";
import PostQuestion from "@/app/ui/components/user/student/forum/PostQuestion";
import CommentForm from "@/app/ui/components/user/student/forum/CommentForm";
import CommentList from "@/app/ui/components/user/student/forum/CommentList";

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isTeacher: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  views: number;
  likes: number;
  bookmarks: number;
  comments: Comment[];
  tags: string[];
}

// Mock data - In a real application, this would come from an API
const MOCK_FORUM_POSTS = [
  {
    id: "1",
    title: "Làm thế nào để học tốt môn Toán?",
    content: `
      <p>Tôi đang gặp khó khăn trong môn Toán, đặc biệt là phần đại số. Tôi đã thử nhiều phương pháp nhưng chưa thấy hiệu quả rõ rệt. Có ai có kinh nghiệm học tốt môn này không?</p>
      <p>Tôi đã thử:</p>
      <ul>
        <li>Làm nhiều bài tập</li>
        <li>Xem video hướng dẫn</li>
        <li>Ghi chép cẩn thận</li>
      </ul>
      <p>Nhưng vẫn cảm thấy không nắm vững được kiến thức. Mong nhận được lời khuyên từ mọi người!</p>
    `,
    author: "Nguyễn Văn A",
    authorAvatar: "/student.png",
    createdAt: "2025-04-15",
    views: 156,
    likes: 24,
    bookmarks: 8,
    comments: [
      {
        id: "c1",
        author: "Trần Văn Giáo",
        authorAvatar: "/teacher.png",
        content:
          "Theo kinh nghiệm của tôi, để học tốt Toán cần hiểu rõ các khái niệm cơ bản trước khi đi vào các bài toán phức tạp. Nên bắt đầu từ những bài tập đơn giản rồi dần dần nâng cao độ khó.",
        createdAt: "2025-04-16",
        likes: 5,
        isTeacher: true,
      },
      {
        id: "c2",
        author: "Lê Thị Học",
        authorAvatar: "/student.png",
        content:
          "Tôi từng gặp vấn đề tương tự. Điều giúp tôi tiến bộ là tìm một người bạn cùng học và giải thích lại kiến thức cho nhau. Khi bạn có thể giải thích một vấn đề cho người khác, nghĩa là bạn đã thực sự hiểu nó.",
        createdAt: "2025-04-16",
        likes: 3,
        isTeacher: false,
      },
      {
        id: "c3",
        author: "Phạm Văn Kinh",
        authorAvatar: "/student.png",
        content:
          "Tôi thấy việc áp dụng toán học vào các vấn đề thực tế rất hiệu quả. Thử tìm hiểu các ứng dụng của đại số trong đời sống, điều này sẽ giúp bạn thấy môn học thú vị và dễ nhớ hơn.",
        createdAt: "2025-04-17",
        likes: 2,
        isTeacher: false,
      },
    ],
    tags: ["học tập", "toán học"],
  },
  {
    id: "2",
    title: "Chia sẻ kinh nghiệm học tiếng Anh hiệu quả",
    content: `
      <p>Sau nhiều năm học tiếng Anh, tôi muốn chia sẻ một số phương pháp đã giúp tôi tiến bộ rõ rệt:</p>
      <ol>
        <li>Học từ vựng theo chủ đề thay vì học riêng lẻ từng từ</li>
        <li>Luyện nghe mỗi ngày thông qua phim, podcast hoặc bài hát</li>
        <li>Tìm bạn để luyện nói hoặc tham gia các câu lạc bộ tiếng Anh</li>
        <li>Đọc sách báo bằng tiếng Anh, bắt đầu từ những bài đơn giản</li>
      </ol>
      <p>Quan trọng nhất là kiên trì học tập mỗi ngày, dù chỉ 15-30 phút.</p>
    `,
    author: "Trần Thị B",
    authorAvatar: "/student.png",
    createdAt: "2025-04-12",
    views: 320,
    likes: 45,
    bookmarks: 23,
    comments: [],
    tags: ["tiếng anh", "học tập"],
  },
  // More posts would be here...
];

export default function PostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const classId = pathname?.split("/")[3]; // Lấy classId từ URL
  const postId = params?.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLiked, setUserLiked] = useState(false);
  const [userBookmarked, setUserBookmarked] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPost = () => {
      setIsLoading(true);
      try {
        const foundPost = MOCK_FORUM_POSTS.find((p) => p.id === postId);
        if (foundPost) {
          setPost(foundPost);
        } else {
          // Handle not found
          router.push(`/member/classes/${classId}/overview/forum`);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [classId, postId, router]);

  const handleBackClick = () => {
    router.back();
  };

  const handleSubmitComment = (comment: string) => {
    if (!comment.trim()) return;

    const newCommentObj = {
      id: `c${Date.now()}`,
      author: "Người dùng hiện tại",
      authorAvatar: "/student.png",
      content: comment,
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
      isTeacher: false,
    };

    if (post) {
      setPost({
        ...post,
        comments: [...post.comments, newCommentObj],
      });
    }
  };

  const handleLikePost = () => {
    setUserLiked(!userLiked);

    // Ensure that post is not null before updating likes
    if (post) {
      setPost({
        ...post, // Spread the existing post
        likes: userLiked ? post.likes - 1 : post.likes + 1, // Increment or decrement likes
      });
    }
  };

  const handleBookmarkPost = () => {
    setUserBookmarked(!userBookmarked);

    // Ensure that post is not null before updating bookmarks
    if (post) {
      setPost({
        ...post, // Spread the existing post
        bookmarks: userBookmarked ? post.bookmarks - 1 : post.bookmarks + 1, // Increment or decrement bookmarks
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy bài viết
        </h2>
        <Button onClick={handleBackClick}>
          <FaArrowLeft className="mr-2" /> Quay lại diễn đàn
        </Button>
      </div>
    );
  }

  return (
    <div className="px-2">
      <Button
        variant="basic"
        onClick={handleBackClick}
        className="mb-4 flex items-center hover:bg-primary-lighter"
      >
        <FaArrowLeft className="mr-2" /> Quay lại diễn đàn
      </Button>

      <PostQuestion
        post={post}
        handleLikePost={handleLikePost}
        handleBookmarkPost={handleBookmarkPost}
        userLiked={userLiked}
        userBookmarked={userBookmarked}
      />

      {/* Comments Section */}
      <div>
        <h3 className="text-xl font-bold text-primary-darker mb-4 mt-10 flex items-center">
          <FaCommentDots className="mr-2" />
          Bình luận ({post.comments?.length || 0})
        </h3>

        <CommentForm onSubmit={handleSubmitComment} />

        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment: Comment) => (
              <CommentList
                key={comment.id}
                author={comment.author}
                authorAvatar={comment.authorAvatar}
                isTeacher={comment.isTeacher}
                createdAt={comment.createdAt}
                content={comment.content}
                likes={comment.likes}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <FaCommentDots className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
