"use client";

import Image from "next/image";
import { FaThumbsUp } from "react-icons/fa";
import { Card, CardContent } from "../../../_common/Card";

interface CommentListProps {
  author: string;
  authorAvatar?: string;
  isTeacher: boolean;
  createdAt: string;
  content: string;
  likes: number;
}

export default function CommentList({
  author,
  authorAvatar,
  isTeacher,
  createdAt,
  content,
  likes,
}: CommentListProps) {
  return (
    <Card
      className={`shadow-md ${isTeacher ? "border-primary-dark" : "border-gray-300"} rounded-lg`}
    >
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Image
              src={authorAvatar || "/student.png"}
              alt={author}
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-gray-300 transition-transform transform hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Author + Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">{author}</p>
                {isTeacher && (
                  <span className="px-2 py-0.5 bg-primary-light text-primary-darker text-xs rounded-full">
                    Giáo viên
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{createdAt}</p>
            </div>

            {/* Content */}
            <p className="mt-2 text-gray-700">{content}</p>

            {/* Like button */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 hover:text-primary-dark">
              <button className="flex items-center hover:text-primary-dark transition-all">
                <FaThumbsUp className="mr-1" /> {likes}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
