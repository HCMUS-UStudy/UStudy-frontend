import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  text: string;
  label: string;
}

const ReadonlyTextField = ({ text, label, className, ...props }: Props) => {
  return (
    <div className="relative">
      <div className="absolute text-xs left-4 -top-2.5 bg-white text-primary-darkest">
        {label}
      </div>
      <div
        className={`px-3 py-2 border border-control-border text-sm rounded-md bg-slate-100 ${className || ""}`}
        {...props}
      >
        {text}
      </div>
    </div>
  );
};

export { ReadonlyTextField };
