import clsx from "clsx";
import React from "react";

type SIZE_TYPE = "sm" | "md" | "lg";

export default function SelectorLoading({
  size,
  numberOfItems = 5,
}: {
  size?: SIZE_TYPE;
  numberOfItems?: number;
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            {
              "h-24 w-24": size === "md",
              "h-20 w-20": size === "sm",
              "h-28 w-28": size === "lg",
            },
            "relative px-4 py-6 shrink-0 grow-0 animate-pulse bg-gradient-to-br from-primary via-primary-light to-primary border-2 border-primary rounded transition-all",
          )}
        ></div>
      ))}
    </div>
  );
}
