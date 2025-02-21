export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type SideNavItemGroup = {
  title?: string;
  menuList: SideNavItem[];
};

export type AccountItem = {
  id: string;
  name: string;
  email: string;
  genId: string;
  role: { id: string; name: string };
  isActive: boolean;
  createdAt: string;
};

export type MemberItem = {
  id: string;
  name: string;
  email: string;
  gender: string;
};

export type RegisterItem = {
  id: string;
  name: string;
  email: string;
  address: string;
  birthday: string;
  phone: string;
  gender: string;
};

export type RegisterClassItem = {
  id: string;
  name: string;
  email: string;
  genId: string;
  gender: string;
};

export type GradeItem = {
  id: string;
  name: string;
};

export type ChapterItem = {
  id: string;
  name: string;
  description: string;
};

export type MaterialItem = {
  id: string;
  fileName: string;
  filePath: string;
};

export type CourseItem = {
  id: string;
  name: string;
  description: string;
  createdBy: {
    name: string;
  };
  createdAt: string;
  status: boolean;
  totalGrades: string;
};

export type TimeItem = {
  day: number;
  startTime: string;
  endTime: string;
};

export type SessionTimeItem = {
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  branchSessionId: string;
};

export type SessionItem = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export type RoomItem = {
  id: string;
  name: string;
};

export type TeacherItem = {
  email: string;
  genId: string;
  id: string;
  name: string;
};

export type TeacherAvalItem = {
  email: string;
  genId: string;
  id: string;
  name: string;
  gender: string;
};

export type ClassSchema = {
  name: string;
  courseId: string;
  gradeId: string;
  startDate: string;
  endDate: string;
  description: string;
  fee: number;
  branchId: string;
  classTimes: TimeItem[];
  roomId: string;
};

export type AccountSchema = {
  email: string;
  name: string;
  phone: string;
  address: string;
  birthday: string;
  gender: "MALE" | "FEMALE";
  role: "STUDENT" | "TEACHER" | "STAFF";
  permissions: Array<string>;
};

export type ScheduleItem = {
  display: string;
  dataToSend: number;
  isChosen: boolean;
};

export type CourseSchema = {
  name: string;
  description: string;
};

export const Schedule: ScheduleItem[] = [
  {
    display: "Thứ hai",
    dataToSend: 1,
    isChosen: false,
  },
  {
    display: "Thứ ba",
    dataToSend: 2,
    isChosen: false,
  },
  {
    display: "Thứ tư",
    dataToSend: 3,
    isChosen: false,
  },
  {
    display: "Thứ năm",
    dataToSend: 4,
    isChosen: false,
  },
  {
    display: "Thứ sáu",
    dataToSend: 5,
    isChosen: false,
  },
  {
    display: "Thứ bảy",
    dataToSend: 6,
    isChosen: false,
  },
  {
    display: "Chủ nhật",
    dataToSend: 7,
    isChosen: false,
  },
];

export type Branch = {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  rooms: string;
  sessions: [string];
};

export type Duration = {
  quantity: number;
  unit: string | null;
};

export type ClassItem = {
  id: string;
  name: string;
  course: {
    name: string;
  };
  fee: number;
  room: {
    name: string;
  };
  grade: {
    name: string;
  };
};

export type ClassData = {
  content: ClassItem[];
  totalPages: number;
};

export type MemberData = {
  content: MemberItem[];
  totalPages: number;
};

export type TeacherData = {
  content: TeacherAvalItem[];
  totalPages: number;
};

export type DurationUnit = "Tuần" | "Tháng" | "Năm";

export type ScheduleType = "Giờ cố định" | "Giờ linh hoạt";

export type CustomError = {
  message?: string;
  status?: number;
  data?: string | unknown;
};

type Authority = {
  authority: string;
};

export type User = {
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  address: string;
  authorities: Authority[];
  avatar: string;
  birthday: string;
  branch: string | null;
  classesEnrolled: string | null;
  classesTaught: string | null;
  createdAt: string;
  credentialsNonExpired: boolean;
  email: string;
  enabled: boolean;
  genId: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  id: string;
  isActive: boolean;
  name: string;
  phone: string;
  role: string;
  updatedAt: string;
  username: string;
};

export type Classroom = {
  id: string;
  name: string;
  description: string;
  fee: number;
  grade: {
    id: string;
    name: string;
  };
  room: {
    id: string;
    name: string;
  };
  status: boolean;
  teacher: {
    avatar: string;
    email: string;
    genId: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    id: string;
    name: string;
  } | null;
  students: null;
  course: {
    createdAt: string;
    createdBy: {
      active: boolean;
      avatar: string;
      createdAt: string;
      email: string;
      genId: string;
      gender: string;
      id: string;
      name: string;
      role: string;
    };
    description: string;
    id: string;
    name: string;
    status: boolean;
    totalGrades: number;
  };
};

export type AllChapter = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  course: null;
  grade: null;
};

export type CourseData = {
  content: CourseItem[];
  totalPages: number;
};

export type AccountData = {
  content: AccountItem[];
  totalPages: number;
};

export type RegisterAccountData = {
  content: RegisterItem[];
  totalPages: number;
};

export type RegisterClassData = {
  content: RegisterClassItem[];
  totalPages: number;
};

export type GradeData = {
  content: GradeItem[];
  totalPages: number;
};

export type ChapterData = {
  content: ChapterItem[];
  totalPages: number;
};

export type MaterialData = {
  content: MaterialItem[];
  totalPages: number;
};

type Grade = {
  id: string;
  name: string;
};

export type Course = {
  id: string;
  name: string;
  description: string;
  totalGrades: number;
  status: boolean;
  createdBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
    role: string;
    gender: string;
    createdAt: string;
    active: boolean;
  };
  createdAt: string;
};

type Room = {
  id: string;
  name: string;
};

export type Teacher = {
  id: string;
  genId: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  gender: "MALE" | "FEMALE";
  createdAt: string;
  active: boolean;
};

type UserForTeacher = {
  gender: string;
  createdAt: string;
  active: boolean;
};

export type ClassTime = {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
};

export type ClassTeacher = {
  id: string;
  name: string;
  description: string;
  grade: Grade;
  course: Course;
  room: Room;
  fee: number;
  teacher: UserForTeacher;
  students: UserForTeacher[];
  classTimes: ClassTime[];
  status: string | null; // Status can be null
};

export type TeacherRegister = {
  name: string;
  email: string;
  birthday: string;
  phone: string;
  address: string;
  courses: string[];
  grades: string[];
  gender: "MALE" | "FEMALE";
};

export type RoleItem = {
  id: string;
  name: string;
};

export type Session = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
};
