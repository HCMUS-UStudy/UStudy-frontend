import React from "react";

export default function RegisterClassesLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse relative overflow-hidden bg-white border-2 border-slate-200 flex flex-col justify-between gap-3 px-9 py-5 space-y-3 rounded-lg"
        >
          <div className="w-24 h-24 bg-slate-300 rounded-full absolute -right-5 -top-7" />
          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 bg-slate-300 rounded" />
            <div className="h-6 bg-slate-300 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
