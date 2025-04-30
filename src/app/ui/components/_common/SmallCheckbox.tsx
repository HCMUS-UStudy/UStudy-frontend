import { FaCheck } from "react-icons/fa6";

type CheckboxVariant = "icon" | "label";

interface SmallCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: CheckboxVariant;
  labelText?: string;
  isLoading?: boolean;
}
/**
 * A reusable checkbox component with two visual variants: "icon" and "label".
 *
 * - `"icon"` variant: renders a small square checkbox with a centered check icon when selected.
 * - `"label"` variant: renders a full-width checkbox with custom text and an icon aligned to the right.
 *
 * Inherits all native `<input type="checkbox">` props, such as `checked`, `onChange`, `name`, `disabled`, etc.
 *
 * @param {CheckboxWithIconProps} props - Props for rendering the checkbox.
 * @param {"icon" | "label"} [props.variant="icon"] - Determines the style of the checkbox.
 * @param {string} [props.labelText] - Optional label text (only used when `variant` is `"label"`).
 * @returns {JSX.Element} A styled and accessible checkbox component.
 *
 * @example
 * // Icon variant (default):
 * <CheckboxWithIcon
 *   checked={selectedIds.includes(student.id)}
 *   onChange={() => handleSelection(student.id)}
 *   name="studentSelector"
 * />
 *
 * @example
 * // Label variant:
 * <CheckboxWithIcon
 *   variant="label"
 *   labelText="Monday - 07:00 - 09:00"
 *   name="ClassSessionSelector"
 *   onChange={() => handleSelectClassSession('monday', 'session-id')}
 * />
 */
const SmallCheckbox: React.FC<SmallCheckboxProps> = ({
  variant = "icon",
  className = "",
  labelText = "",
  isLoading = false,
  ...props
}) => {
  if (variant === "icon") {
    return (
      <label
        className={`relative w-5 h-5 border-2 rounded border-primary-darker flex items-center justify-center 
                hover:cursor-pointer hover:bg-primary ${className}`}
      >
        <input type="checkbox" className="hidden peer" {...props} />
        <FaCheck className="absolute size-3 text-primary-darkest opacity-0 peer-checked:opacity-100 transition-all" />
      </label>
    );
  }
  if (variant === "label") {
    return (
      <label
        className={`relative py-2 shrink-0 grow-0 flex items-center justify-start border-control-border text-md
        has-[:checked]:border-primary-darker has-[:checked]:bg-primary-lighter 
        ${!isLoading && "px-5 hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer"}
        transition-all ${className}`}
      >
        <input type="checkbox" className="hidden peer" {...props} />
        <span
          className={`text-sm pr-5 transition-colors ${isLoading ? "bg-gray-200 text-transparent w-full animate-pulse rounded" : "text-gray-700 peer-checked:text-primary-darkest"}`}
        >
          {labelText}
        </span>
        <FaCheck className="size-6 absolute right-3 text-primary-darkest opacity-0 peer-checked:opacity-70 transition-all" />
      </label>
    );
  }
};

export default SmallCheckbox;
