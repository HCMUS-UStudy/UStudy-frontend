import React from "react";
import { CgSpinner } from "react-icons/cg";

import { cn } from "@/app/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string; // className for the container
  customStyle?: {
    spinner?: string; // className for the spinner
    text?: string; // className for the text
  };
}

/**
 * Loading component
 *
 * @param text - The text to display
 * @param className - The className for the container
 * @param customStyle - The custom styles for the spinner and text
 *
 * @example
 * ```tsx
 *  <Loading text="Loading..." />
 * ```
 */
const Loading = ({ text, className, customStyle }: LoadingProps) => (
  <div className={cn("flex items-center justify-center gap-4", className)}>
    <CgSpinner
      className={cn(
        "animate-spin text-primary-darkest h-8 w-8",
        customStyle?.spinner,
      )}
    />
    {text && <span className={cn("text-sm", customStyle?.text)}>{text}</span>}
  </div>
);

export default Loading;
