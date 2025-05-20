import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const roleMap: Record<string, string> = {
  Student: "Học sinh",
  Teacher: "Giáo viên",
  Parent: "Phụ huynh",
  Admin: "Admin",
};

export const accountStatus: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Đang hoạt động", color: "text-green-600" },
  DELETED: { label: "Đã xóa", color: "text-red-600" },
  LOCKED: { label: "Đã khóa", color: "text-yellow-600" },
};
