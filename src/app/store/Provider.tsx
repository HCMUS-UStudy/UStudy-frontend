"use client";
import { Provider } from "react-redux";
import { branchStore } from "./store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={branchStore}>{children}</Provider>;
}
