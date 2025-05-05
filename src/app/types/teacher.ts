import { GenderType } from "./common";

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

export type TeacherData = {
  content: TeacherAvalItem[];
  totalPages: number;
};

export type Teacher = {
  id: string;
  genId: string;
  email: string;
  name: string;
  avatar: string;
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
