import { FaEye, FaThumbsUp, FaBookmark } from "react-icons/fa";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { FaShare } from "react-icons/fa6";
import { Button } from "../../../_common/Button";

interface PostQuestionProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: string;
    authorAvatar: string;
    createdAt: string;
    views: number;
    likes: number;
    bookmarks: number;
    tags: string[];
  };
  handleLikePost: () => void;
  handleBookmarkPost: () => void;
  userLiked: boolean;
  userBookmarked: boolean;
}

const PostQuestion: React.FC<PostQuestionProps> = ({
  post,
  handleLikePost,
  handleBookmarkPost,
  userLiked,
  userBookmarked,
}) => {
  return (
    <Card className="mb-4 rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white via-gray-50 to-white">
        {/* Title + Author */}
        <div>
          <CardTitle className="text-3xl font-bold text-primary-dark leading-snug">
            {post.title}
          </CardTitle>

          <div className="flex items-center mt-4 space-x-4">
            <Image
              src={post.authorAvatar || "/student.png"}
              alt={post.author}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary-light shadow-sm"
            />
            <div>
              <p className="font-semibold text-gray-800">{post.author}</p>
              <p className="text-sm text-gray-500">
                Đăng ngày: {post.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center flex-wrap gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <FaEye className="mr-2 text-primary" />
            <span>{post.views} lượt xem</span>
          </div>

          <button
            onClick={handleLikePost}
            className={`flex items-center px-4 py-2 rounded-full border transition hover:text-primary-dark ${
              userLiked
                ? "bg-primary-lighter text-primary-dark border-primary "
                : "text-gray-600 hover:bg-gray-100 border-gray-300"
            }`}
          >
            <FaThumbsUp className="mr-2" />
            {post.likes} Thích
          </button>

          <button
            onClick={handleBookmarkPost}
            className={`flex items-center px-4 py-2 rounded-full border transition hover:text-primary-dark ${
              userBookmarked
                ? "bg-primary-lighter text-primary-dark border-primary"
                : "text-gray-600 hover:bg-gray-100 border-gray-300"
            }`}
          >
            <FaBookmark className="mr-2" />
            {post.bookmarks} Lưu
          </button>
        </div>
      </CardHeader>

      <CardContent className="">
        <div
          className="prose prose-slate max-w-none text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex flex-wrap gap-3 mt-6">
          {post.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-4 py-1 text-sm rounded-full bg-gradient-to-r from-primary-light to-primary text-white shadow-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-6 pt-2 pb-2 border-t bg-gray-50">
        <div className="w-full flex justify-end">
          <Button
            variant="basic"
            className="text-gray-700 hover:text-primary-dark  transition"
          >
            <FaShare className="mr-2" /> Chia sẻ bài viết
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostQuestion;
