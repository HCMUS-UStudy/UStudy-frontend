export interface Study {
  title: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  desc?: string;
}

const studySchedule: Study[] = [
  // Tháng 12 năm 2024
  {
    title: "Bài giảng Toán học",
    start: new Date(2024, 11, 2, 9, 0, 0),
    end: new Date(2024, 11, 2, 11, 0, 0),
    desc: "Giải tích và Đại số tuyến tính",
  },
  {
    title: "Nhóm học Vật lý",
    start: new Date(2024, 11, 3, 14, 0, 0),
    end: new Date(2024, 11, 3, 16, 0, 0),
    desc: "Cơ học và Nhiệt động lực học",
  },
  {
    title: "Thí nghiệm Hóa học",
    start: new Date(2024, 11, 4, 13, 0, 0),
    end: new Date(2024, 11, 4, 17, 0, 0),
    desc: "Thí nghiệm Hóa hữu cơ",
  },
  {
    title: "Kiểm tra giữa kỳ: Sinh học",
    start: new Date(2024, 11, 5, 10, 0, 0),
    end: new Date(2024, 11, 5, 12, 0, 0),
    desc: "Các chương 1-5",
  },
  {
    title: "Ôn tập Toán học",
    start: new Date(2024, 11, 6, 15, 0, 0),
    end: new Date(2024, 11, 6, 18, 0, 0),
    desc: "Giải bài tập và xem lại ghi chú",
  },
  {
    title: "Kỳ nghỉ đông",
    allDay: true,
    start: new Date(2024, 11, 24),
    end: new Date(2024, 11, 31),
    desc: "Nghỉ lễ",
  },

  // Tháng 1 năm 2025
  {
    title: "Nghỉ Tết Dương lịch",
    allDay: true,
    start: new Date(2025, 0, 1),
    end: new Date(2025, 0, 1),
    desc: "Chào đón năm mới!",
  },
  {
    title: "Bài giảng Vật lý",
    start: new Date(2025, 0, 3, 9, 0, 0),
    end: new Date(2025, 0, 3, 11, 0, 0),
    desc: "Điện từ và Quang học",
  },
  {
    title: "Nhóm học Hóa học",
    start: new Date(2025, 0, 5, 14, 0, 0),
    end: new Date(2025, 0, 5, 16, 0, 0),
    desc: "Thảo luận nhóm về cơ chế phản ứng",
  },
  {
    title: "Thi cuối kỳ: Toán học",
    start: new Date(2025, 0, 10, 10, 0, 0),
    end: new Date(2025, 0, 10, 13, 0, 0),
    desc: "Bài kiểm tra tổng hợp",
  },
  {
    title: "Ôn tập Vật lý",
    start: new Date(2025, 0, 12, 15, 0, 0),
    end: new Date(2025, 0, 12, 18, 0, 0),
    desc: "Xem lại các khái niệm và giải bài tập",
  },
  {
    title: "Kết thúc học kỳ",
    allDay: true,
    start: new Date(2025, 0, 15),
    end: new Date(2025, 0, 15),
    desc: "Hoạt động cuối học kỳ",
  },
];

export default studySchedule;
