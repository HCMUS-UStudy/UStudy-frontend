"use client";

import * as React from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/app/lib/utils";
import { IoSearchOutline } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onSearch?: (term: string) => void;
}

/**
 * SearchField component
 *
 * @param className - SearchField classes name
 * @param onSearch - Function to handle search
 * @param props - Other input props
 * @returns {React.JSX.Element}
 *
 * @example
 * ```tsx
 * <SearchField
 *   className="w-full"
 *   placeholder="Search..."
 *   onSearch={(term) => console.log(term)}
 * />
 * ```
 */
const SearchField = ({
  className,
  onSearch,
  ...props
}: SearchProps): React.JSX.Element => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch?.(term);
    console.log(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);
  return (
    <div
      className={cn(
        "flex items-center w-full rounded-md focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-control-ring focus-within:shadow-sm border-input border-gray-400 border",
        className,
      )}
    >
      <div className="pl-3">
        <IoSearchOutline size={20} />
      </div>
      <input
        type="text"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        className="w-full rounded-md px-3 py-2 text-sm text-ellipsis outline-none placeholder-gray-600 bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
    </div>
  );
};
export default SearchField;
