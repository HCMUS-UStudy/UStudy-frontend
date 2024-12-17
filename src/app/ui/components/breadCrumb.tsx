"use client";

interface BreadCrumbProps {
  courseId: string | null;
  subject: string | null;
  grade?: string | null;
  gradeId?: string | null;
  chapter?: string | null;
  chapterId?: string | null;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({
  courseId,
  subject,
  grade,
  gradeId,
  chapter,
  chapterId,
}) => {
  if (!subject || !courseId) return null;

  return (
    <div className="mb-4 text-gray-700">
      <span className="text-sm">
        <a
          href="/admin/courses"
          className="text-black hover:text-blue-600 hover:underline mr-2">
          Quản lý môn học
        </a>
        {" > "}
        <a
          href={`/admin/courses/course-documents/${courseId}/${subject}`}
          className={`text-${
            grade ? "black" : "blue-600"
          } hover:underline ml-2 mr-2`}>
          {decodeURIComponent(subject)}
        </a>
        {grade && gradeId && (
          <>
            {" > "}
            <a
              href={`/admin/courses/course-documents/${courseId}/${subject}/${gradeId}/${grade}`}
              className={`text-${
                chapter ? "black" : "blue-600"
              } hover:underline ml-2 mr-2`}>
              {decodeURIComponent(grade)}
            </a>
          </>
        )}
        {chapter && chapterId && (
          <>
            {" > "}
            <a
              href={`/admin/courses/course-documents/${courseId}/${subject}/${gradeId}/${grade}/${chapterId}/${chapter}`}
              className="text-blue-600 hover:underline ml-2">
              {decodeURIComponent(chapter)}
            </a>
          </>
        )}
      </span>
    </div>
  );
};

export default BreadCrumb;
