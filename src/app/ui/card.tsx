import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      {children}
    </div>
  );
};
