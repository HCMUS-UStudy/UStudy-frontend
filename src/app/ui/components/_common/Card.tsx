import * as React from "react";

import { cn } from "@/app/lib/utils";

/**
 * Card component
 *
 * @param {string} className - Additional classes for the card
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Other props to pass to the card
 * @param {React.HTMLAttributes<HTMLDivElement>} ref - Reference to the card
 *
 * @example
 * ```tsx
 *  <Card>
 *    <CardHeader>
 *      <CardTitle>Title</CardTitle>
 *    </CardHeader>
 *    <CardContent>
 *      <CardDescription>Content</CardDescription>
 *    </CardContent>
 *   </Card>
 *  ```
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded border shadow-sm hover:shadow-md transition-shadow",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * CardHeader component
 *
 * @param {string} className - Additional classes for the card header
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Other props to pass to the card header
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 px-4 py-3 lg:px-6 lg:py-5",
      className,
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * CardTitle component
 *
 * @param {string} className - Additional classes for the card title
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Other props to pass to the card
 *
 * @example
 * ```tsx
 * <CardTitle>Title</CardTitle>
 * ```
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * CardDescription component
 *
 * @param {string} className - Additional classes for the card description
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Other props to pass to the card description
 *
 * @example
 * ```tsx
 * <CardDescription>Description</CardDescription>
 * ```
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

/**
 * CardContent component
 *
 * @param {string} className - Additional classes for the card content
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Other props to pass to the card
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <CardDescription>Description</CardDescription>
 * </CardContent>
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-3 lg:p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * CardFooter component
 *
 * @param {string} className - Additional classes for the card footer
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Other props to pass to the card
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   Footer
 * </CardFooter>
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
