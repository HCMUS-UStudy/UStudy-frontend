import { twMerge } from "tailwind-merge";
import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className="flex gap-3 items-center">
      <Image
        className="object-contain"
        src={"/UStudyIcon.png"}
        width={35}
        height={35}
        alt="UStudyLogo"
      />
      <div className={twMerge("text-3xl font-extrabold", className)}>
        <span className=" text-highlight-text">US</span>tudy
      </div>
    </div>
  );
};

export default Logo;
