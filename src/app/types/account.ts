import { AccountStatus, GenderType, UserSummary } from "./common";
import { RoleItem } from "./role";

export type AccountItem = {
  id: string;
  genId: string;
  email: string;
  name: string;
  avatar: string;
  gender: GenderType;
  createdAt: string;
  status: AccountStatus;
  role: RoleItem;
  address: string;
  phone: string;
  birthday: string;
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
  address: string;
  phone: string;
  birthday: string;
};

export type AccountData = {
  user: UserSummary;
  isAvailable: boolean;
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
