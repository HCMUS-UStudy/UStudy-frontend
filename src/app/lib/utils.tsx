import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wrapPromise = (promise: Promise<any>) => {
  type Status = "pending" | "success" | "error";
  let status: Status = "pending";
  let response: any;
  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );
  const handler = {
    pending: () => {
      throw suspender;
    },
    error: () => {
      throw response;
    },
    default: () => response,
  };
  const read = () => {
    const result = handler[status] ? handler[status]() : handler.default();
    return result;
  };
  return { read };
};
