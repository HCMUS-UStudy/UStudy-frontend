import { Button } from "@/app/ui/components/_common/Button";
import { useRouter } from "next/navigation";

interface ReviewSuccessBodyProps {
  classId: string;
}

export default function ReviewSuccessBody({ classId }: ReviewSuccessBodyProps) {
  const router = useRouter();

  return (
    <div className="p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Đánh giá đã được gửi
      </h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Chúng tôi sẽ xem xét đánh giá của bạn để không ngừng cải thiện chất
        lượng đào tạo.
      </p>
      <Button
        onClick={() => router.push(`/member/classes/${classId}`)}
        className="px-8 py-3 bg-primary hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      >
        Quay lại lớp học
      </Button>
    </div>
  );
}
