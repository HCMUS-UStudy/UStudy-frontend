import { ChevronDown } from "lucide-react";
import React from "react";

type CollapsibleType = {
  title?: string;
  children?: React.ReactNode;
  secondaryColor?: string;
  primaryColor?: string;
  maxHeight?: string | null;
  defaultChecked?: boolean;
};

export default function Collapsible({
  title,
  children,
  secondaryColor,
  primaryColor,
  maxHeight,
  defaultChecked,
}: CollapsibleType) {
  return (
    <div id="generalInformation" className="mt-5 relative">
      <input
        defaultChecked={defaultChecked}
        type="checkbox"
        className="peer absolute inset-x-0 top-0 opacity-0 z-10 h-12 cursor-pointer"
      />
      <div
        className={`border-${primaryColor} border-b-2  rounded-t-xl h-12 w-full pl-5 flex items-center`}>
        <h1
          className={`text-2xl font-bold text-gray-700 tracking-wider flex items-center gap-2`}>
          {title}
        </h1>
      </div>
      <ChevronDown
        size={35}
        className="absolute top-1.5 left-64 transition-transform duration-300 rotate-0 peer-checked:rotate-180 text-"
      />

      <div
        className={`${secondaryColor} rounded-b-xl overflow-hidden transition-al duration-300 max-h-0 ${
          !maxHeight
            ? "peer-checked:max-h-96"
            : `peer-checked:max-h-[${maxHeight}]`
        }`}>
        {children}
      </div>
    </div>
  );
}
