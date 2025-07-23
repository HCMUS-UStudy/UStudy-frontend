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
  const [show, setShow] = React.useState(false);
  const [coords, setCoords] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (show && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      let top = rect.top;
      let left = rect.left;
      switch (position) {
        case "top":
          top = rect.top - 8;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + 6;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - 8;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + 8;
          break;
        default:
          break;
      }
      setCoords({ top, left });
    }
  }, [show, position]);

  return (
    <div
      className="relative inline-block select-none"
      ref={wrapperRef}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && coords && (
        <span
          className={`fixed bg-gray-700 text-white text-[12px] rounded py-1 px-2 z-[9999] ${
            text.length > 20
              ? "max-w-xs break-words whitespace-pre-line text-left"
              : "whitespace-nowrap"
          }`}
          style={{
            top: coords.top,
            left: coords.left,
            transform:
              position === "top"
                ? "translate(-50%, -100%)"
                : position === "bottom"
                  ? "translate(-50%, 0)"
                  : "translateY(-50%)",
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Tooltip;
