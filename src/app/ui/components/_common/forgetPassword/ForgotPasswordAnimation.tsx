"use client";
import dynamic from "next/dynamic";
import forgetPasswordAnimation from "@/app/ui/lotties/forgetPassword.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ForgotPasswordAnimation({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Lottie
      animationData={forgetPasswordAnimation}
      className={className}
      loop
    />
  );
}
