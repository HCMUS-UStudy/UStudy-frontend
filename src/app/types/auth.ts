import { StudentRegisterInputs } from "../register/page";
import { GenderType } from "./common";
import { Branch } from "./branch";
import { Child } from "../store/ChildrenSlice";

export type AuthResponse = {
  message: string;
  statusCode: string;
  data: {
    user: UserData;
    screens: string[];
    refresh_token: string;
    access_token: string;
    children: Child[] | null;
  };
};

export type RegisterResponse = {
  message: string;
  statusCode: string;
  data: StudentRegisterInputs;
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
  isVerified: boolean;
  branches: Branch[];
  hadClass: boolean;
};

export type VerifyTokenResponse = {
  message: string;
  status: string;
  data: null;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type GenerateOtpPayload = {
  email: string;
};

export type ForgotPasswordWithOtpPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export type SimpleApiResponse = {
  message: string;
  status: string;
  data: null;
};
