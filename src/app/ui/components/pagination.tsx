"use client";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function Pagination({
  className,
  totalPages,
}: {
  className?: string;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  let currentPage = Number(searchParams.get("page")) || 0;

  const ArrowButton = ({
    direction,
    isDisabled,
    handleClick,
  }: {
    direction: string;
    isDisabled: boolean;
    handleClick: () => void;
  }) => {
    if (direction === "left") {
      return (
        <li>
          <div
            onClick={() => {
              handleClick();
            }}
            className={clsx(
              {
                "bg-gray-300 cursor-default": isDisabled,
                "bg-white hover:bg-gray-100 hover:text-gray-700": !isDisabled,
              },
              "flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 border border-e-0 border-gray-300 rounded-s-lg "
            )}>
            <span className="sr-only">Previous</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 1 1 5l4 4"
              />
            </svg>
          </div>
        </li>
      );
    } else {
      return (
        <li>
          <div
            onClick={handleClick}
            className={clsx(
              {
                "bg-gray-300 cursor-default": isDisabled,
                "bg-white hover:bg-gray-100 hover:text-gray-700": !isDisabled,
              },
              "flex items-center justify-center px-4 h-10 leading-tight text-gray-500 border border-gray-300 rounded-e-lg"
            )}>
            <span className="sr-only">Next</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 9 4-4-4-4"
              />
            </svg>
          </div>
        </li>
      );
    }
  };

  return (
    <nav aria-label="Page navigation example" className={className}>
      <ul className="flex items-center -space-x-px h-10 text-base">
        <ArrowButton
          direction="left"
          isDisabled={currentPage <= 0}
          handleClick={() => {
            if (currentPage > 0) {
              currentPage--;
              const params = new URLSearchParams();
              params.set("page", currentPage.toString());
              replace(`${pathname}?${params.toString()}`);
            }
          }}
        />
        <li className="cursor-default flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
          {currentPage + 1} / {totalPages === 0 ? currentPage + 1 : totalPages}
        </li>
        <ArrowButton
          direction="right"
          isDisabled={currentPage >= totalPages - 1}
          handleClick={() => {
            if (currentPage < totalPages - 1) {
              currentPage++;
              const params = new URLSearchParams();
              params.set("page", currentPage.toString());
              replace(`${pathname}?${params.toString()}`);
            }
          }}
        />
      </ul>
    </nav>
  );
}
