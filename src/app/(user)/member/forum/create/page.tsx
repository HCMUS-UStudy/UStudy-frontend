"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import { Button } from "@/app/ui/components/_common/Button";
import { FaArrowLeft, FaPaperclip, FaTimes, FaTag } from "react-icons/fa";

export default function CreateForumPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleBackClick = () => {
    router.back();
  };

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung bài viết.");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to create the post
      console.log({
        title,
        content,
        tags,
        attachments: attachments.map((file) => file.name),
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to forum page after successful post creation
      router.push("/member/forum");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Có lỗi xảy ra khi đăng bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="container py-8">
      <Button
        variant="basic"
        onClick={handleBackClick}
        className="mb-6 flex items-center hover:bg-primary-lighter"
      >
        <FaArrowLeft className="mr-2" /> Quay lại diễn đàn
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary-darker">
            Tạo bài viết mới
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full p-3 border border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-gray-700 font-medium mb-2"
              >
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung bài viết..."
                className="w-full p-3 border border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark min-h-[200px]"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-gray-700 font-medium mb-2"
              >
                Thẻ
              </label>
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <input
                    id="tag"
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyDown={keyDownHandler}
                    placeholder="Thêm thẻ (ví dụ: học tập, toán học)..."
                    className="w-full p-3 border border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark pr-10"
                  />
                  <FaTag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 bg-primary-dark text-white"
                >
                  Thêm
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-primary-lighter text-primary-darker px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-darker hover:text-primary-dark"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attachments */}
            <div>
              <label
                htmlFor="attachments"
                className="block text-gray-700 font-medium mb-2"
              >
                Tệp đính kèm
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-primary-light rounded-lg hover:bg-primary-lighter transition-colors">
                  <FaPaperclip className="mr-2 text-primary-dark" />
                  <span>Chọn tệp</span>
                  <input
                    type="file"
                    onChange={handleAttachmentChange}
                    className="hidden"
                    multiple
                  />
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-medium text-gray-700">
                    Đã chọn {attachments.length} tệp:
                  </p>
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                    >
                      <span className="text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="border-t pt-4 flex justify-between">
          <Button variant="outlined" onClick={handleBackClick}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary-darker text-white"
            isPending={isSubmitting}
          >
            Đăng bài viết
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
