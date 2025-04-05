export type User = {
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  address: string;
  authorities: Authority[];
  avatar: string;
  birthday: string;
  branch: string | null;
  classesEnrolled: string | null;
  classesTaught: string | null;
  createdAt: string;
  credentialsNonExpired: boolean;
  email: string;
  enabled: boolean;
  genId: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  id: string;
  isActive: boolean;
  name: string;
  phone: string;
  role: string;
  updatedAt: string;
  username: string;
};

type Authority = {
  authority: string;
};

export type Permission = {
  [key: string]: string[];
};
