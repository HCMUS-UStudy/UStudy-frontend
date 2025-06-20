"use client";
import dynamic from "next/dynamic";
import verifyTokenAnimation from "@/app/ui/lotties/verifyToken.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function VerifyTokenAnimation({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Lottie animationData={verifyTokenAnimation} className={className} loop />
  );
}
