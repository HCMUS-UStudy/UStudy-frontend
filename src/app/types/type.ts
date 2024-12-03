export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type SideNavItemGroup = {
  title?: string;
  menuList: SideNavItem[]
}

export type GradeItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  status: boolean;
  createdBy: {
    gen_id: string;
    email: string;
    name: string;
    role: string;
  };
  totalGrades: number;
};

export type TimeItem = {
  day: number;
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

export type ScheduleItem = {
  display: string;
  dataToSend: number;
  isChosen: boolean;
}

export const Schedule: ScheduleItem[] = [
  {
    display: 'Thứ hai',
    dataToSend: 1,
    isChosen: false 
  },
  {
    display: 'Thứ ba',
    dataToSend: 2,
    isChosen: false 
  },
  {
    display: 'Thứ tư',
    dataToSend: 3,
    isChosen: false 
  },
  {
    display: 'Thứ năm',
    dataToSend: 4,
    isChosen: false 
  },
  {
    display: 'Thứ sáu',
    dataToSend: 5,
    isChosen: false 
  },
  {
    display: 'Thứ bảy',
    dataToSend: 6,
    isChosen: false 
  },
  {
    display: 'Chủ nhật',
    dataToSend: 7,
    isChosen: false 
  },
]

export type Branch = {
  name: string;
  address: string;
  contactNumber: string;
  rooms: string;
}

export type Duration = {
  quantity: number;
  unit: string | null; 
}

export type ClassItem = {
  id: string;
  name: string;
  course: {
    name: string;
  };
  fee: number;
  room: {
    name: string;
  }
  grade: {
    name: string;
  }
}

export type ClassData = {
  content: ClassItem[],
  totalPages: number;
}

export type DurationUnit = 'Tuần' | 'Tháng' | 'Năm'

export type ScheduleType = 'Giờ cố định' | 'Giờ linh hoạt'

export type CustomError = {
  message?: string;
  status?: number;
  data?: string | unknown;
}