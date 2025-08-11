"use client";
import { Rate } from "antd";
import React, { memo } from "react";
import ReactMultiCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface DummyCourse {
  id: number;
  title: string;
  subject: string;
  grade: string;
  teacher: string;
  rating: number;
  review: string;
  students: number;
}
const dummy: DummyCourse[] = [
  {
    id: 1,
    title: "Toán nâng cao",
    subject: "Toán học",
    grade: "Khối 9",
    teacher: "Nguyễn Văn A",
    rating: 4.5,
    review: "Bài giảng dễ hiểu, phù hợp luyện thi vào 10",
    students: 28,
  },
  {
    id: 2,
    title: "Tiếng Anh giao tiếp",
    subject: "Tiếng Anh",
    grade: "Khối 11",
    teacher: "Trần Thị B",
    rating: 4,
    review: "Tương tác tốt, nhiều hoạt động nhóm",
    students: 15,
  },
  {
    id: 3,
    title: "Vật lý cơ bản",
    subject: "Vật lý",
    grade: "Khối 10",
    teacher: "Lê Văn C",
    rating: 5,
    review: "Giảng viên nhiệt tình, minh họa sinh động",
    students: 22,
  },
  {
    id: 4,
    title: "Hóa học ứng dụng",
    subject: "Hóa học",
    grade: "Khối 12",
    teacher: "Phạm Thị D",
    rating: 4.8,
    review: "Bài tập sát đề thi, kiến thức hệ thống rõ ràng",
    students: 18,
  },
  {
    id: 5,
    title: "Lập trình Python cơ bản",
    subject: "Tin học",
    grade: "Khối 10",
    teacher: "Ngô Văn E",
    rating: 4.2,
    review: "Hướng dẫn từng bước, dễ áp dụng vào thực tế",
    students: 30,
  },
  {
    id: 6,
    title: "Ngữ văn nâng cao",
    subject: "Ngữ văn",
    grade: "Khối 12",
    teacher: "Lý Thị F",
    rating: 3.9,
    review: "Cần thêm ví dụ thực tế, nhưng kiến thức sâu",
    students: 12,
  },
  {
    id: 7,
    title: "Lịch sử hiện đại Việt Nam",
    subject: "Lịch sử",
    grade: "Khối 8",
    teacher: "Hoàng Văn G",
    rating: 4.7,
    review: "Giảng sinh động, nhiều hình ảnh minh họa",
    students: 25,
  },
  {
    id: 8,
    title: "Kỹ năng sống cho học sinh",
    subject: "Kỹ năng sống",
    grade: "Khối 7",
    teacher: "Đinh Thị H",
    rating: 4.3,
    review: "Hoạt động nhóm thú vị, rèn luyện kỹ năng giao tiếp",
    students: 20,
  },
  {
    id: 9,
    title: "Địa lý tự nhiên",
    subject: "Địa lý",
    grade: "Khối 9",
    teacher: "Vũ Văn I",
    rating: 4.1,
    review: "Nhiều kiến thức thực tế, dễ nhớ",
    students: 17,
  },
  {
    id: 10,
    title: "Sinh học nâng cao",
    subject: "Sinh học",
    grade: "Khối 11",
    teacher: "Nguyễn Thị J",
    rating: 4.9,
    review: "Thí nghiệm trực quan, kiến thức chuyên sâu",
    students: 26,
  },
];

const Carousel = () => {
  // const Element = () => {
  //   return <></>;
  // };
  return (
    <>
      <ReactMultiCarousel
        additionalTransfrom={0}
        arrows
        autoPlay
        autoPlaySpeed={3000}
        centerMode={false}
        containerClass="container-with-dots"
        className="my-5 py-3"
        dotListClass=""
        draggable={false}
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 4,
            partialVisibilityGutter: 40,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
            partialVisibilityGutter: 30,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={2}
        swipeable
      >
        {dummy.map((course) => (
          <div
            key={course.id}
            className="p-4 mx-3 border rounded-lg shadow-sm bg-white h-full flex flex-col 
                duration-300 ease-in-out 
               hover:shadow-lg hover:border-primary-darkest transition-all"
          >
            <h3 className="text-lg font-bold text-primary-darkest mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              Giảng viên: {course.teacher}
            </p>
            <p className="text-xs text-gray-400 mb-1">
              Môn: {course.subject} | {course.grade}
            </p>
            <Rate
              disabled
              allowHalf
              defaultValue={course.rating}
              style={{ fontSize: 16 }}
            />
            <p className="text-xs text-gray-400 mb-3">
              {course.students} học viên
            </p>
            <p className="text-sm text-gray-600 flex-grow">{course.review}</p>
          </div>
        ))}
      </ReactMultiCarousel>
    </>
  );
};

export default memo(Carousel);
