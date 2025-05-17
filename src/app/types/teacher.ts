import { GenderType, UserSummary } from "./common";

export type TeacherItem = Pick<UserSummary, "email" | "genId" | "id" | "name">;

export type TeacherAvalItem = TeacherItem & {
  gender: string;
};

export type TeacherData = {
  content: TeacherAvalItem[];
  totalPages: number;
};

export type Teacher = UserSummary & {
  role: string;
  gender: GenderType;
  createdAt: string;
  active: boolean;
};

export type TeacherRegister = {
  name: string;
  email: string;
  birthday: string;
  phone: string;
  address: string;
  courses: string[];
  grades: string[];
  gender: GenderType;
};
