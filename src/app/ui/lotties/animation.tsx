"use client";
import dynamic from "next/dynamic";
import React, { memo, useMemo } from "react";
import books from "./books.json";
import contacts from "./contacts.json";
import forgetPassword from "./forgetPassword.json";
import learningSystem from "./learningSystem.json";
import registering from "./registering.json";
import resetPassword from "./resetPassword.json";
import success from "./success.json";
import verifyToken from "./verifyToken.json";
import xIcon from "./xIcon.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface Props {
  loop?: boolean;
  animationKey: string;
}

// Animation data mapping
const animationDataMap = {
  books,
  contacts,
  forgetPassword,
  learningSystem,
  registering,
  resetPassword,
  success,
  verifyToken,
  xIcon,
} as const;

function PlayAnimation({ loop = true, animationKey }: Props) {
  const animationData = useMemo(() => {
    return animationDataMap[animationKey as keyof typeof animationDataMap];
  }, [animationKey]);

  return (
    <Lottie
      width={400}
      height={400}
      animationData={animationData}
      loop={loop}
    />
  );
}

export default memo(PlayAnimation);
