"use client";

import React from "react";
import { useSelector } from "react-redux";
import { BranchRootState } from "@/app/store/store";

const ClassPage: React.FC = () => {
  const { branches, selectedBranchId } = useSelector(
    (state: BranchRootState) => state.branch,
  );
  return (
    <>
      <h1>Hello</h1>
      <h2>Branches</h2>
      <ul>
        {branches.map((branch) => (
          <li key={branch.id}>{branch.name}</li>
        ))}
      </ul>
      <h2>Selected Branch</h2>
      <p>{selectedBranchId}</p>
    </>
  );
};

export default ClassPage;
