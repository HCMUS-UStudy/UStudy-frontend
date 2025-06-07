import React from "react";
interface TooltipProps {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

/**
 * Tooltip component that displays a text label when the user hovers over the wrapped element.
 * @param {string} props.text - The text content to display inside the tooltip.
 * @param {'top' | 'bottom' | 'left' | 'right'} [props.position='top'] - The position of the tooltip relative to the child element.
 * @param {React.ReactNode} props.children  - The child element that the tooltip is attached to.
 * @returns {JSX.Element} A tooltip-wrapped React element.
 * @example
 * ```tsx
 * <Tooltip text="Edit item" position="right">
 *   <button>Edit</button>
 * </Tooltip>
 * ```
 */

const Tooltip: React.FC<TooltipProps> = ({
  text,
  position = "top",
  children,
}) => {
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block group select-none">
      {children}
      <span
        className={`absolute hidden group-hover:block bg-gray-700 text-white text-[12px] rounded py-1 px-2 
          z-[999] whitespace-nowrap ${positionClasses[position]}`}
      >
        {text}
        {/* <span
          className={`absolute w-2 h-2 bg-gray-700 transform rotate-45 ${
            position === "top"
              ? "bottom-[-4px] left-1/2 transform -translate-x-1/2"
              : position === "bottom"
                ? "top-[-4px] left-1/2 transform -translate-x-1/2"
                : position === "left"
                  ? "right-[-4px] top-1/2 transform -translate-y-1/2"
                  : "left-[-4px] top-1/2 transform -translate-y-1/2"
          }`}
        /> */}
      </span>
    </div>
  );
};

export default Tooltip;
