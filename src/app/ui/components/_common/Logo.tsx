import { twMerge } from "tailwind-merge";
import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className="flex gap-2 items-center">
      <Image
        className="object-contain"
        src={"/UStudyIcon.png"}
        width={38}
        height={38}
        alt="UStudyLogo"
      />
      <div className={twMerge("text-[34px] font-extrabold mt-1", className)}>
        <span className=" text-highlight-text">US</span>tudy
      </div>
    </div>
  );
};

export default Logo;
