import clsx from "clsx";
import React from "react";

type SIZE_TYPE = "sm" | "md" | "lg";

export default function SelectorLoadingHorizon({
  numberOfItems = 5,
}: {
  size?: SIZE_TYPE;
  numberOfItems?: number;
}) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "relative px-3 py-4 shrink-0 grow-0 animate-pulse bg-gradient-to-br from-primary via-primary-light to-primary border-2 border-primary rounded transition-all",
          )}
        ></div>
      ))}
    </div>
  );
}
