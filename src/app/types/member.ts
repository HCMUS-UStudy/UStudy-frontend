import { GenderType } from "./common";

export type MemberItem = {
  id: string;
  genId: string;
  name: string;
  email: string;
  address: string;
  birthday: string;
  phone: string;
  gender: GenderType;
};

export type MemberData = {
  content: MemberItem[];
  totalPages: number;
  pageNumber: number;
};
