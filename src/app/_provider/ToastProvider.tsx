import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

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
