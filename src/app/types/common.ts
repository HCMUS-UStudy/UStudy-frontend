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

export type Duration = {
  quantity: number;
  unit: string | null;
};

export type DurationUnit = "Tuần" | "Tháng" | "Năm";

export type CustomError = {
  message?: string;
  status?: number;
  data?: string | unknown;
};

export type GenderType = "MALE" | "FEMALE";

export type DefaultRoute = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

export type AccountStatus = "ACTIVE" | "DELETED" | "LOCKED";

export type UserSummary = {
  id: string;
  genId: string;
  email: string;
  name: string;
  avatar: string;
};

export interface BaseEntity {
  id: string;
  genId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BaseUserInfo {
  name: string;
  email: string;
  avatar: string;
  phone: string;
  address: string;
  gender: GenderType;
  birthday: string;
}

export interface BaseAccountInfo {
  username: string;
  role: string;
  isActive: boolean;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

export interface BaseClassInfo {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface BaseGradeInfo {
  id: string;
  name: string;
}

export interface BaseCourseInfo {
  id: string;
  name: string;
}

export interface BaseScheduleInfo {
  dayOfWeek: string;
  roomName: string;
  startTime: string;
  endTime: string;
}

export interface BasePaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
}

export interface BaseResponse {
  message: string;
  statusCode: string;
}
