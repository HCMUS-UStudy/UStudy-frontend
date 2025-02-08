"use client";
import React, { createContext, useContext, useState } from "react";

type SliderContextType = {
  curr: number;
  nextStep: () => void;
  prevStep: () => void;
};

const SliderContext = createContext<SliderContextType | null>(null);

export const useSlider = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw Error("Slider context used incorrectly");
  }
  return context;
};

export const Slider = ({ children }: { children: React.ReactNode }) => {
  const [curr, setCurr] = useState<number>(0);
  const nextStep = () => {
    setCurr((curr) =>
      curr < React.Children.count(children) - 1 ? curr + 1 : curr,
    );
  };
  const prevStep = () => {
    setCurr((curr) => (curr > 0 ? curr - 1 : curr));
  };
  return (
    <SliderContext.Provider value={{ curr, nextStep, prevStep }}>
      <div className="overflow-hidden">
        <div
          className={`h-full flex transition-transform ease-in-out duration-300`}
          style={{
            transform: `translateX(-${curr * 100}%)`,
          }}
        >
          {React.Children.map(children, (child) => (
            <div className="w-full h-full shrink-0 grow-0">{child}</div>
          ))}
        </div>
        {/* progress bar */}
        <div className="w-full h-1 bg-slate-100 mt-10">
          <div
            className={`h-full bg-blue-600 transition-[width] ease-in-out duration-300`}
            style={{
              width: `${(curr / (React.Children.count(children) - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </SliderContext.Provider>
  );
};

export const SliderPage = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
