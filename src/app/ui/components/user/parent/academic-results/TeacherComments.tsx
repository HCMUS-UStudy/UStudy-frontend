import { FaCommentDots } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";

export const TeacherComments = () => {
  // Nhận xét từ các giáo viên
  const teacherComments = [
    {
      teacher: "Cô Nguyễn Thị Hương",
      role: "Giáo viên chủ nhiệm",
      comment:
        "Em An có khả năng học tập tốt, đặc biệt trong các môn khoa học tự nhiên. Cần cố gắng hơn trong môn Ngữ văn và tích cực tham gia các hoạt động nhóm. Tinh thần học tập nghiêm túc, có tiềm năng phát triển tốt trong tương lai.",
      date: "20/10/2023",
    },
    {
      teacher: "Thầy Trần Văn Bình",
      role: "Giáo viên Toán",
      comment:
        "Em An có năng lực tư duy logic tốt, giải quyết bài tập nhanh và chính xác. Tuy nhiên, cần chú ý hơn đến việc trình bày bài tập và làm thêm các dạng bài tập nâng cao.",
      date: "18/10/2023",
    },
  ];
  return (
    <>
      <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Nhận xét của giáo viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {teacherComments.map((comment, index) => (
              <div
                key={index}
                className="p-4 bg-primary-lighter rounded-lg border border-primary-light"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary-darker rounded-full h-fit">
                    <FaCommentDots className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-4 italic">
                      &quot;{comment.comment}&quot;
                    </p>
                    <div className="flex flex-wrap justify-between items-end">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{comment.teacher}</p>
                        <p>{comment.role}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Ngày: {comment.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Phụ huynh có thể liên hệ trực tiếp với giáo viên bộ môn hoặc giáo
              viên chủ nhiệm để biết thêm thông tin chi tiết về kết quả học tập
              của con.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
