import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
