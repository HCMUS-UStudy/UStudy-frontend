"use client";
import dynamic from "next/dynamic";
import resetPasswordAnimation from "@/app/ui/lotties/resetPassword.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ForgotPasswordAnimation({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Lottie animationData={resetPasswordAnimation} className={className} loop />
  );
}
