"use client";

import { getSubmissionByAssignmentId } from "@/app/lib/services/submission";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../_common/loading/Loading";
import { SubmissionItem } from "@/app/types";

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const SubmissionList = ({
  assignmentId,
  setGradingItem,
  isAdmin,
}: {
  assignmentId: string;
  setGradingItem: (submissionItem: SubmissionItem) => void;
  isAdmin?: boolean;
}) => {
  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ["submissions", assignmentId],
    queryFn: () => getSubmissionByAssignmentId(assignmentId, 0, 10),
  });

  const submissions = (submissionsData?.content || []).sort(
    (a, b) =>
      new Date(b.submissionDate).getTime() -
      new Date(a.submissionDate).getTime(),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="mt-8 px-5">
      <h2 className="text-lg font-bold text-primary-darker mb-4">
        Danh sách bài nộp
      </h2>
      {submissions.length === 0 ? (
        <div className="text-gray-500">Chưa có học sinh nào nộp bài.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm rounded-lg">
            <thead className="bg-primary-light">
              <tr>
                <th className="px-3 py-2">STT</th>
                <th className="px-3 py-2">Học sinh</th>
                <th className="px-3 py-2">Ngày nộp</th>
                <th className="px-3 py-2">Điểm</th>
                <th className="px-3 py-2">Nhận xét</th>
                <th className="px-3 py-2">Trạng thái</th>
                {!isAdmin && <th className="px-3 py-2">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr key={sub.id} className="text-center">
                  <td className=" px-2 py-2">{idx + 1}</td>
                  <td className=" px-2 py-2">{sub.student.name}</td>
                  <td className=" px-2 py-2">
                    {formatDateTime(sub.submissionDate)}
                  </td>
                  <td className=" px-2 py-2">
                    {sub.gradedBy ? sub.score : "-"}
                  </td>
                  <td className=" px-2 py-2">
                    {sub.feedback ? sub.feedback : "-"}
                  </td>
                  <td className=" px-2 py-2">
                    {sub.gradedBy ? (
                      <span className="text-green-700 font-semibold">
                        Đã chấm
                      </span>
                    ) : (
                      <span className="text-yellow-700">Chưa chấm</span>
                    )}
                  </td>
                  {!isAdmin && (
                    <td className="px-2 py-2">
                      {sub.gradedBy ? (
                        <button
                          className="px-2 py-1 bg-primary-lighter hover:bg-primary-light rounded"
                          onClick={() => {
                            setGradingItem(sub);
                          }}
                        >
                          Xem chi tiết
                        </button>
                      ) : (
                        <button
                          className="px-2 py-1 bg-primary-lighter hover:bg-primary-light rounded"
                          onClick={() => {
                            setGradingItem(sub);
                          }}
                        >
                          Chấm điểm
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
