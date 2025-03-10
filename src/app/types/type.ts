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

export type UserData = {
  avatar: string;
  email: string;
  genId: string;
  gender: "MALE" | "FEMALE";
  name: string;
  role: {
    createdAt: string;
    defaultRoute: "ADMIN" | "STUDENT" | "TEACHER" | "PARENT";
    description: string;
    id: string;
    isDeleted: boolean;
    name: string;
    updatedAt: string;
  };
};

export type AuthResponse = {
  message: string;
  statusCode: string;
  data: {
    user: UserData;
    refresh_token: string;
    access_token: string;
  };
};

export type AccountItem = {
  id: string;
  name: string;
  email: string;
  genId: string;
  role: { id: string; name: string };
  status: string;
  createdAt: string;
};

export type AccountDetailItem = {
  id: string;
  name: string;
  email: string;
  genId: string;
  avatar: string;
  gender: "MALE" | "FEMALE";
  status: "ACTIVE" | "DELETED" | "LOCKED";
  createdAt: string;
  role: { id: string; name: string };
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
  description: string;
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

export type CourseDto = {
  id: string;
  name: string;
  createdBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
  };
};

export type CourseItem = {
  totalGrades: number;
  courseDto: CourseDto;
};

export type ClassSessionItem = {
  day: DaysInWeek;
  startTime: string;
  endTime: string;
  branchSessionId: string;
};

export type DaysInWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type SessionTimeItem = {
  day: DaysInWeek;
  branchSessionId: string;
};

export type DayRoomSessionItem = {
  day: DaysInWeek;
  branchSessionId: string;
  roomId: string;
};

export type SessionBranchItem = {
  id: string;
  name: string;
};

export type SessionItem = {
  id: string;
  branch: {
    id: string;
    name: string;
    address: string;
    contactNumber: string;
    status: "ACTIVE" | "INACTIVE" | "DELETED";
    rooms: number;
    sessions: Session[];
  };
  session: Session;
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
  classTimes: ClassSessionItem[];
  roomId: string;
};

export type AccountSchema = {
  email: string;
  name: string;
  phone: string;
  address: string;
  birthday: string;
  gender: "MALE" | "FEMALE";
  roleId: string;
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

export type GradeSchema = {
  name: string;
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
  status: "ACTIVE" | "INACTIVE";
  sessions: Session[];
};

export type BranchData = {
  content: Branch[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
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

export type ClassChooseItem = {
  id: string;
  name: string;
  description: string;
};

export type ClassData = {
  content: ClassItem[];
  totalPages: number;
};

export type ClassChooseData = {
  content: ClassChooseItem[];
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
  content: CourseDto[];
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
  startTime: string;
  endTime: string;
};

export type ClassUserItem = {
  id: string;
  name: string;
  description: string;
  course: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  };
};

export type UserClassData = {
  content: ClassUserItem[];
  totalPages: number;
};
