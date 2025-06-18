"use client";

import * as React from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/app/lib/utils";
import { IoSearchOutline } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading/Loading";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onSearch?: (term: string) => void;
  queryKey?: string | string[];
  isLoading?: boolean;
}

/**
 * SearchField component
 *
 * @param className - SearchField classes name
 * @param onSearch - Function to handle search
 * @param queryKey - Custom query key(s) to use in URL (default: 'query'). Can be a single string or array of strings
 * @param props - Other input props
 * @returns {React.JSX.Element}
 *
 * @example
 * ```tsx
 * <SearchField
 *   className="w-full"
 *   placeholder="Search..."
 *   queryKey={["searchTerm", "filter"]}
 *   onSearch={(term) => console.log(term)}
 * />
 * ```
 */
const SearchField = ({
  className,
  onSearch,
  queryKey = "query",
  isLoading = false,
  ...props
}: SearchProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch?.(term);
    if (!searchParams) {
      return null;
    }
    const params = new URLSearchParams(searchParams);

    // Convert queryKey to array if it's a single string
    const queryKeys = Array.isArray(queryKey) ? queryKey : [queryKey];

    // Set or delete the term for each query key
    queryKeys.forEach((key) => {
      if (term) {
        params.set(key, term);
      } else {
        params.delete(key);
      }
    });

    replace(`${pathname}?${params.toString()}`);
  }, 500);

  // Handle the case where the component is rendered on the server
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center px-3 w-full rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-control-ring focus-within:shadow-sm border-input border border-slate-300 bg-primary-lighter",
          className,
        )}
      >
        <div>
          <IoSearchOutline className="text-primary-darkest size-3 md:size-5" />
        </div>
        <input
          type="text"
          className="w-full rounded-lg px-3 py-2 text-xs md:text-sm text-ellipsis outline-none placeholder-gray-600 bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        {isLoading && <Loading className="size-7" />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center px-3 w-full rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-control-ring focus-within:shadow-sm border-input border border-slate-300 bg-primary-lighter",
        className,
      )}
    >
      <div>
        <IoSearchOutline className="text-primary-darkest size-3 md:size-5" />
      </div>
      <input
        type="text"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        className="w-full rounded-lg px-3 py-2 text-xs md:text-sm text-ellipsis outline-none placeholder-gray-600 bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      {isLoading && <Loading className="size-7" />}
    </div>
  );
};
export default SearchField;
