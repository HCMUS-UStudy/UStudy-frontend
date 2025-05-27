import React from "react";
import { FaCheck } from "react-icons/fa6";
import SelectorLoadingHorizon from "./loading/SelectorLoadingHorizon";

export type SelectorItem<T = unknown> = {
  id: string;
  label: string;
  value: T;
};

interface SelectorProps<T = unknown> {
  items: SelectorItem<T>[];
  type?: "radio" | "checkbox";
  name?: string;
  loading?: boolean;
  selectedValue?: T;
  onChange?: (value: T) => void;
  className?: string;
  itemClassName?: string;
  loadingItems?: number;
}

export default function Selector<T = unknown>({
  items,
  type = "radio",
  name,
  loading = false,
  selectedValue,
  onChange,
  className = "",
  itemClassName = "",
  loadingItems = 2,
}: SelectorProps<T>) {
  if (loading) {
    return <SelectorLoadingHorizon numberOfItems={loadingItems} />;
  }

  return (
    <div className={`flex flex-col mt-2 overflow-auto gap-2 ${className}`}>
      {items.map((item) => (
        <label
          key={item.id}
          htmlFor={item.id}
          className={`relative px-3 py-2 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center border-2 border-slate-200
                     text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all ${itemClassName}`}
        >
          <input
            type={type}
            className="hidden peer"
            name={name}
            id={item.id}
            checked={selectedValue === item.value}
            onChange={() => onChange?.(item.value)}
          />
          <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all">
            {item.label}
          </span>
          <FaCheck className="size-6 absolute right-3 text-primary-darkest opacity-0 peer-checked:opacity-70 transition-all" />
        </label>
      ))}
    </div>
  );
}
