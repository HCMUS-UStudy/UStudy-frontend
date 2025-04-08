export interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: 'teacher' | 'student' | 'admin';
  status: 'online' | 'offline' | 'busy' | 'away';
  lastMessage?: {
    content: string;
    timestamp: Date;
    isRead: boolean;
  };
  unreadCount?: number;
  lastSeen?: Date;
}

export const mockTeachers: Contact[] = [
  {
    id: "teacher1",
    name: "Nguyễn Văn Thành",
    avatar: "https://i.pravatar.cc/150?img=11",
    role: "teacher",
    status: "online",
    lastMessage: {
      content: "Bài tập thực hành đã được gửi vào email của em. Nhớ nộp trước thứ 5 nhé!",
      timestamp: new Date(Date.now() - 30 * 60000),
      isRead: false
    },
    unreadCount: 1,
    lastSeen: new Date()
  },
  {
    id: "teacher2",
    name: "Trần Thị Hương",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "teacher",
    status: "online",
    lastMessage: {
      content: "Ngày mai học chương mới, em nhớ xem trước tài liệu nhé",
      timestamp: new Date(Date.now() - 2 * 3600000),
      isRead: true
    },
    lastSeen: new Date(Date.now() - 10 * 60000)
  },
  {
    id: "teacher3",
    name: "Phạm Minh Tuấn",
    avatar: "https://i.pravatar.cc/150?img=12",
    role: "teacher",
    status: "busy",
    lastMessage: {
      content: "Bài kiểm tra cuối kỳ sẽ gồm 3 phần với tổng thời gian là 90 phút",
      timestamp: new Date(Date.now() - 24 * 3600000),
      isRead: true
    },
    lastSeen: new Date(Date.now() - 3 * 3600000)
  }
];

export const mockStudents: Contact[] = [
  {
    id: "student1",
    name: "Lê Hoàng Nam",
    avatar: "https://i.pravatar.cc/150?img=8",
    role: "student",
    status: "online",
    lastMessage: {
      content: "Bài tập 5 em chưa hiểu lắm, thầy có thể giải thích lại được không ạ?",
      timestamp: new Date(Date.now() - 45 * 60000),
      isRead: true
    },
    lastSeen: new Date(Date.now() - 2 * 60000)
  },
  {
    id: "student2",
    name: "Nguyễn Thị Linh",
    avatar: "https://i.pravatar.cc/150?img=9",
    role: "student",
    status: "offline",
    lastMessage: {
      content: "Em xin phép nghỉ học ngày mai vì lý do sức khỏe ạ",
      timestamp: new Date(Date.now() - 5 * 3600000),
      isRead: true
    },
    lastSeen: new Date(Date.now() - 12 * 3600000)
  },
  {
    id: "student3",
    name: "Trần Quốc Bảo",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "student",
    status: "away",
    lastMessage: {
      content: "Em đã hoàn thành bài tập và gửi qua email cho thầy rồi ạ",
      timestamp: new Date(Date.now() - 8 * 3600000),
      isRead: true
    },
    lastSeen: new Date(Date.now() - 4 * 3600000)
  }
];

export const mockAdmins: Contact[] = [
  {
    id: "admin1",
    name: "Hoàng Minh Tâm",
    avatar: "https://i.pravatar.cc/150?img=10",
    role: "admin",
    status: "online",
    lastMessage: {
      content: "Thông báo: Sẽ có buổi họp toàn trường vào thứ 6 tuần này",
      timestamp: new Date(Date.now() - 60 * 60000),
      isRead: false
    },
    unreadCount: 1,
    lastSeen: new Date()
  }
];

export const allContacts: Contact[] = [
  ...mockTeachers,
  ...mockStudents,
  ...mockAdmins
]; 