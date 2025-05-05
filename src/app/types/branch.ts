import { Session } from "./session";

export type Branch = {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  rooms: number;
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
