import { twMerge } from "tailwind-merge";
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={twMerge("text-3xl font-extrabold", className)}>
      <span className=" text-highlight-text">US</span>tudy
    </div>
  );
};

export default Logo;
