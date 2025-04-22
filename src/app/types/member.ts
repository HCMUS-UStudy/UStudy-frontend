import { GenderType } from "./common";

export type MemberItem = {
  id: string;
  genId: string;
  name: string;
  email: string;
  gender: GenderType;
};

export type MemberData = {
  content: MemberItem[];
  totalPages: number;
  pageNumber: number;
};
