"use client";
import React, { useState } from "react";
import { Button } from "../components/common/Button";
import { FaBars, FaUser, FaX } from "react-icons/fa6";
import clsx from "clsx";

const LandingPageSideBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Button
        onClick={toggleSideBar}
        className="w-12 h-12 min-[320px]:flex md:hidden"
      >
        <FaBars />
      </Button>
      <div
        onClick={toggleSideBar}
        className={clsx(
          {
            hidden: !isOpen,
            visible: isOpen,
          },
          "bg-black opacity-50 fixed inset-0 z-40 transition-opacity",
        )}
      ></div>
      <div
        className={clsx(
          "fixed top-0 right-0 z-50 w-[70vw] py-2.5 px-4 bg-background h-screen overflow-y-auto tranform transition-transform",
          { "translate-x-0": isOpen, "translate-x-full": !isOpen },
        )}
      >
        <div>
          <div className="flex flex-row justify-between">
            <Button className="font-thin text-base h-[8vh]">
              <FaUser className=" mr-3" /> Đăng nhập
            </Button>
            <button className=" mr-3" onClick={toggleSideBar} type="button">
              <FaX className="h-5 w-5" />
            </button>
          </div>
          <br />
          <div className="flex flex-col gap-5">
            <div className="border-b-2 border-gray-300 px-2 py-1 font-bold bg-background hover:bg-sky-200 transition-colors rounded">
              Trang chủ
            </div>
            <div className="border-b-2 border-gray-300 px-2 py-1 font-bold bg-background hover:bg-sky-200 transition-colors rounded">
              Trang chủ
            </div>
            <div className="border-b-2 border-gray-300 px-2 py-1 font-bold bg-background hover:bg-sky-200 transition-colors rounded">
              Trang chủ
            </div>
            <div className="border-b-2 border-gray-300 px-2 py-1 font-bold bg-background hover:bg-sky-200 transition-colors rounded">
              Trang chủ
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPageSideBar;
