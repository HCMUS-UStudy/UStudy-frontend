"use client";
import React, { createContext, useContext, useState } from "react";

interface BreadcrumbContext {
  dynamicBreadcrumbs: string[];
  setDynamicBreadcrumbs: React.Dispatch<React.SetStateAction<string[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContext | undefined>(
  undefined,
);

export const BreadcrumbProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState<string[]>([]);
  return (
    <BreadcrumbContext.Provider
      value={{ dynamicBreadcrumbs, setDynamicBreadcrumbs }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useSpecificNameContext error");
  }
  return context;
};
