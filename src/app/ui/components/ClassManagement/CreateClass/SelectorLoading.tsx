import React from "react";

export default function SelectorLoading() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="relative px-4 py-6 shrink-0 grow-0 animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 h-24 w-24 border-2 border-sla`te-200 rounded transition-all"
        ></div>
      ))}
    </>
  );
}
