import { BaseEntity, BaseUserInfo, BaseAccountInfo } from "./common";

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
