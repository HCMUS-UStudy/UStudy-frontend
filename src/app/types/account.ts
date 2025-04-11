export type AccountItem = {
  id: string;
  name: string;
  email: string;
  genId: string;
  role: { id: string; name: string };
  status: string;
  createdAt: string;
};

export type AccountDetailItem = {
  id: string;
  name: string;
  email: string;
  genId: string;
  avatar: string;
  gender: "MALE" | "FEMALE";
  status: "ACTIVE" | "DELETED" | "LOCKED";
  createdAt: string;
  role: { id: string; name: string };
};

export type AccountSchema = {
  email: string;
  name: string;
  phone: string;
  address: string;
  birthday: string;
  gender: "MALE" | "FEMALE";
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
  gender: string;
};
