import { twMerge } from "tailwind-merge";
import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className="flex gap-1 sm:gap-2 items-center">
      <Image
        className="object-contain size-8 sm:size-12"
        src={"/UStudyIcon.png"}
        width={38}
        height={38}
        alt="UStudyLogo"
      />
      <div
        className={twMerge(
          "text-2xl sm:text-[34px] font-extrabold mt-1",
          className,
        )}
      >
        <span className=" text-highlight-text">US</span>tudy
      </div>
    </div>
  );
};

export default Logo;
