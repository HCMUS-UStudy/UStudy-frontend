import React from "react";
import { UseFormRegister } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import SelectorLoading from "./loading/SelectorLoading";

interface SelectorProps<T> {
  data: T[];
  status: "pending" | "success" | "error";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  name: string;
  type?: "radio" | "checkbox";
}

export default function Selector<T extends { id: string; name: string }>({
  data,
  status,
  register,
  name,
  type = "radio",
}: SelectorProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {status === "pending" ? (
        <SelectorLoading size="sm" numberOfItems={5} />
      ) : (
        <>
          {data.map((item) => (
            <label
              htmlFor={item.id}
              key={item.id}
              className="relative h-16 w-16 md:h-20 md:w-20 px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center border-2 border-slate-200 text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
            >
              <input
                type={type}
                id={item.id}
                className="hidden peer"
                value={item.id}
                {...register(name)}
              />
              <span className="peer-checked:text-primary-darkest truncate text-black text-xs md:text-sm peer-checked:font-bold transition-all">
                {item.name}
              </span>
              <FaCheck className="size-12 md:size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
            </label>
          ))}
        </>
      )}
    </div>
  );
}
