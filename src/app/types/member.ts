export type MemberItem = {
  id: string;
  genId: string;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
};

export type MemberData = {
  content: MemberItem[];
  totalPages: number;
  pageNumber: number;
};
