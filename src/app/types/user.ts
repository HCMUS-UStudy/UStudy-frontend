import {
  BaseEntity,
  BaseUserInfo,
  BaseAccountInfo,
  GenderType,
} from "./common";
import { Child } from "../store/ChildrenSlice";

export type User = BaseEntity &
  BaseUserInfo &
  BaseAccountInfo & {
    authorities: Authority[];
    branch: string | null;
    classesEnrolled: string | null;
    classesTaught: string | null;
  };

type Authority = {
  authority: string;
};

export type Permission = {
  data: string[];
};

export type UserProfile = {
  id: string;
  genId: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  address: string;
  gender: GenderType;
  birthday: string;
  children?: Child[];
};

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  birthday?: string; // ISO format: "2025-06-07T05:12:54.368Z"
  gender?: "MALE" | "FEMALE" | string;
}
