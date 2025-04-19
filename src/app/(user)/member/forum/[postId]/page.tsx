"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import { Button } from "@/app/ui/components/_common/Button";
import {
  FaThumbsUp,
  FaEye,
  FaCommentDots,
  FaShare,
  FaArrowLeft,
  FaBookmark,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";

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
  const postId = params.postId as string;

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
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
          router.push("/member/forum");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  const handleBackClick = () => {
    router.back();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // In a real app, this would be an API call to add a comment
    const newCommentObj = {
      id: `c${Date.now()}`,
      author: "Người dùng hiện tại",
      authorAvatar: "/student.png",
      content: newComment,
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
      isTeacher: false,
    };

    setPost({
      ...post,
      comments: [...post.comments, newCommentObj],
    });

    setNewComment("");
  };

  const handleLikePost = () => {
    setUserLiked(!userLiked);
    setPost({
      ...post,
      likes: userLiked ? post.likes - 1 : post.likes + 1,
    });
  };

  const handleBookmarkPost = () => {
    setUserBookmarked(!userBookmarked);
    setPost({
      ...post,
      bookmarks: userBookmarked ? post.bookmarks - 1 : post.bookmarks + 1,
    });
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
        <Button onClick={handleBackClick} className="mt-4">
          <FaArrowLeft className="mr-2" /> Quay lại diễn đàn
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="basic"
        onClick={handleBackClick}
        className="mb-6 flex items-center hover:bg-primary-lighter"
      >
        <FaArrowLeft className="mr-2" /> Quay lại diễn đàn
      </Button>

      <Card className="mb-8">
        <CardHeader className="flex flex-col md:flex-row md:items-start justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl text-primary-darker">
              {post.title}
            </CardTitle>

            <div className="flex items-center mt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={post.authorAvatar || "/student.png"}
                  alt={post.author}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">{post.author}</p>
                <p className="text-sm text-gray-500">
                  Đăng ngày: {post.createdAt}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center">
              <FaEye className="mr-2 text-primary-dark" />
              <span>{post.views} lượt xem</span>
            </div>

            <button
              onClick={handleLikePost}
              className={`flex items-center ${userLiked ? "text-primary-darker font-medium" : "text-gray-600"}`}
            >
              <FaThumbsUp className="mr-2" />
              <span>{post.likes} thích</span>
            </button>

            <button
              onClick={handleBookmarkPost}
              className={`flex items-center ${userBookmarked ? "text-primary-darker font-medium" : "text-gray-600"}`}
            >
              <FaBookmark className="mr-2" />
              <span>{post.bookmarks} đánh dấu</span>
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-lighter text-primary-darker text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4">
          <div className="w-full flex justify-end">
            <Button variant="basic" className="text-gray-600">
              <FaShare className="mr-2" /> Chia sẻ
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary-darker mb-4 flex items-center">
          <FaCommentDots className="mr-2" />
          Bình luận ({post.comments?.length || 0})
        </h3>

        {/* Comment Form */}
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={handleSubmitComment}>
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="w-full p-4 border border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark min-h-[120px]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-primary-darker text-white hover:bg-hover-primary"
              >
                Đăng bình luận
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Comments List */}
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment: any) => (
              <Card
                key={comment.id}
                className={`${comment.isTeacher ? "border-primary-dark" : ""}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                      <Image
                        src={comment.authorAvatar || "/student.png"}
                        alt={comment.author}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="font-medium text-gray-800 mr-2">
                          {comment.author}
                        </p>
                        {comment.isTeacher && (
                          <span className="px-2 py-0.5 bg-primary-light text-primary-darker text-xs rounded-full">
                            Giáo viên
                          </span>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                          {comment.createdAt}
                        </p>
                      </div>
                      <p className="mt-2 text-gray-700">{comment.content}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <button className="flex items-center hover:text-primary-dark">
                          <FaThumbsUp className="mr-1" /> {comment.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
