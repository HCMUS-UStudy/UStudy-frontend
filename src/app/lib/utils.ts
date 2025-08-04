import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DaysInWeek } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const roleMap: Record<string, string> = {
  STUDENT: "Học sinh",
  TEACHER: "Giáo viên",
  PARENT: "Phụ huynh",
  ADMIN: "Admin",
};

export const convertToVietnameseText = (num: number): string => {
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
  const digits = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const teens = [
    "mười",
    "mười một",
    "mười hai",
    "mười ba",
    "mười bốn",
    "mười lăm",
    "mười sáu",
    "mười bảy",
    "mười tám",
    "mười chín",
  ];

  if (num === 0) return "";

  let result = "";
  let unitIndex = 0;

  while (num > 0) {
    let group = num % 1000;
    if (group !== 0) {
      let groupText = "";

      if (group >= 100) {
        groupText += digits[Math.floor(group / 100)] + " trăm ";
        group %= 100;
      }

      if (group >= 10) {
        if (group < 20) {
          groupText += teens[group - 10];
        } else {
          groupText += digits[Math.floor(group / 10)] + " mươi ";
          if (group % 10 > 0) {
            if (group % 10 === 1) {
              groupText += "mốt";
            } else if (group % 10 === 5) {
              groupText += "lăm";
            } else {
              groupText += digits[group % 10];
            }
          }
        }
      } else if (group > 0) {
        groupText += digits[group];
      }

      result = groupText + " " + units[unitIndex] + " " + result;
    }
    num = Math.floor(num / 1000);
    unitIndex++;
  }

  const str = result.trim() + " VNĐ";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const accountStatus: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Đang hoạt động", color: "text-green-600" },
  DELETED: { label: "Đã xóa", color: "text-red-600" },
  LOCKED: { label: "Đã khóa", color: "text-yellow-600" },
};

export const daysInWeekMap: Record<DaysInWeek, string> = {
  MONDAY: "Thứ hai",
  TUESDAY: "Thứ ba",
  WEDNESDAY: "Thứ tư",
  THURSDAY: "Thứ năm",
  FRIDAY: "Thứ sáu",
  SATURDAY: "Thứ bảy",
  SUNDAY: "Chủ Nhật",
};

export function safeSliceMathMarkdown(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  let sliceEnd = maxLength;
  const openIndexes = [...text.matchAll(/\$/g)].map((m) => m.index || 0);

  // Đếm số dấu $ trong khoảng từ đầu đến sliceEnd
  const dollarCountInSlice = openIndexes.filter((i) => i < sliceEnd).length;

  // Nếu có dấu $ lẻ → đang cắt giữa biểu thức → mở rộng đến dấu $ tiếp theo
  if (dollarCountInSlice % 2 !== 0) {
    const nextDollar = text.indexOf("$", sliceEnd);
    if (nextDollar !== -1) {
      sliceEnd = nextDollar + 1;
    }
  }

  return text.slice(0, sliceEnd);
}
