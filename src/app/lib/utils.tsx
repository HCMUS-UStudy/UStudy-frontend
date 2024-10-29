import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Type definition for the inputs parameter
export function cn(...inputs: (string | undefined | null)[]): string {
  return twMerge(clsx(inputs));
}
