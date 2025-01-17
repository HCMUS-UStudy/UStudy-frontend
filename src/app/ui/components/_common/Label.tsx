import { cn } from "@/app/lib/utils";
import React from "react";

// const labelVariants = cva(
//   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
// );
//
// interface LabelProps
//   extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
//   className?: string;
// }
//
// const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
//   ({ className, ...props }, ref) => (
//     <LabelPrimitive.Root
//       ref={ref}
//       className={cn(labelVariants(), className)}
//       {...props}
//     />
//   ),
// );
// Label.displayName = LabelPrimitive.Root.displayName;

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

/**
 * Label component
 *
 * @param {string} className - the class name of the label
 * @param {React.LabelHTMLAttributes<HTMLLabelElement>} props - the props of the label
 *
 * @example
 * ```tsx
 * <Label className="text-gray-500">Label</Label>
 * ```
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  ),
);

Label.displayName = "Label";

export { Label };
