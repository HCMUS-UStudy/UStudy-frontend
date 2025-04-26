"use client";

import * as React from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/app/lib/utils";
import { IoSearchOutline } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onSearch?: (term: string) => void;
  queryKey?: string;
}

/**
 * SearchField component
 *
 * @param className - SearchField classes name
 * @param onSearch - Function to handle search
 * @param queryKey - Custom query key to use in URL (default: 'query')
 * @param props - Other input props
 * @returns {React.JSX.Element}
 *s
 * @example
 * ```tsx
 * <SearchField
 *   className="w-full"
 *   placeholder="Search..."
 *   queryKey="searchTerm..."
 *   onSearch={(term) => console.log(term)}
 * />
 * ```
 */
const SearchField = ({
  className,
  onSearch,
  queryKey = "query",
  ...props
}: SearchProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch?.(term);
    // console.log(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(queryKey, term);
    } else {
      params.delete(queryKey);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);
  return (
    <div
      className={cn(
        "flex items-center w-full rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-control-ring focus-within:shadow-sm border-input border border-slate-300 bg-primary-lighter",
        className,
      )}
    >
      <div className="pl-3">
        <IoSearchOutline size={20} className="text-primary-darkest" />
      </div>
      <input
        type="text"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        className="w-full rounded-lg px-3 py-2 text-sm text-ellipsis outline-none placeholder-gray-600 bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
    </div>
  );
};
export default SearchField;
