import { GenderType } from "./common";
import { Branch } from "./branch";

export type AuthResponse = {
  message: string;
  statusCode: string;
  data: {
    user: UserData;
    screens: string[];
    refresh_token: string;
    access_token: string;
    children: string[] | null;
  };
};

export type UserData = {
  avatar: string;
  email: string;
  genId: string;
  gender: GenderType;
  name: string;
  role: {
    createdAt: string;
    defaultRoute: "ADMIN" | "STUDENT" | "TEACHER" | "PARENT";
    description: string;
    id: string;
    isDeleted: boolean;
    name: string;
    updatedAt: string;
  };
  branch: Branch[];
};
