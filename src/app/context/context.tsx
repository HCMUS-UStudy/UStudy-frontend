"use client";
import React, { createContext, useContext, useState } from "react";

interface SpecificNameBreadCrumbContext {
  specificName: string | null;
  setSpecificName: (name: string | null) => void;
}

const SpecificNameContext = createContext<
  SpecificNameBreadCrumbContext | undefined
>(undefined);

export const SpecificNameProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [specificName, setSpecificName] = useState<string | null>(null);
  return (
    <SpecificNameContext.Provider value={{ specificName, setSpecificName }}>
      {children}
    </SpecificNameContext.Provider>
  );
};

export const useSpecificNameContext = () => {
  const context = useContext(SpecificNameContext);
  if (!context) {
    throw new Error("useSpecificNameContext error");
  }
  return context;
};
