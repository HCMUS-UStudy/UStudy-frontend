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
