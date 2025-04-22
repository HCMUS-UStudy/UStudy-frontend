import { AccountStatus, GenderType } from "./common";
import { RoleItem } from "./role";

export type AccountItem = {
  id: string;
  name: string;
  email: string;
  genId: string;
  role: RoleItem;
  status: string;
  createdAt: string;
};

export type AccountDetailItem = {
  id: string;
  genId: string;
  email: string;
  name: string;
  avatar: string;
  gender: GenderType;
  createdAt: string;
  status: AccountStatus;
  role: RoleItem;
};

export type AccountSchema = {
  email: string;
  name: string;
  phone: string;
  address: string;
  birthday: string;
  gender: GenderType;
  roleId: string;
};

export type AccountData = {
  content: AccountItem[];
  totalPages: number;
};

export type RegisterAccountData = {
  content: RegisterItem[];
  totalPages: number;
};

export type RegisterItem = {
  id: string;
  name: string;
  email: string;
  address: string;
  birthday: string;
  phone: string;
  gender: GenderType;
};

export type DeleteAccountResponse = {
  message: string;
  statusCode: string;
  data: AccountDetailItem;
};
