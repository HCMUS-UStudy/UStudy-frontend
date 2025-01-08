import React from "react";
import { FaSpinner } from "react-icons/fa";
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
    <FaSpinner
      className={cn("animate-spin text-primary h-8 w-8", customStyle?.spinner)}
    />
    {text && (
      <span className={cn("text-lg text-primary", customStyle?.text)}>
        {text}
      </span>
    )}
  </div>
);

export default Loading;
