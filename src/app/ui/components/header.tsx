'use client';
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { BsList } from "react-icons/bs";
import { UserNav } from "./usernav";

export default function Header() {
    const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle();
    const sidebarToggle = () => {
        invokeToggleCollapse();
    }

    const headerStyle = classNames(
        "bg-[#D5E9F6] fixed w-[calc(100%-1rem)] ml-4 z-[99997] px-6 py-1 shadow-md shadow-slate-500/30 rounded-2xl transition-all duration-300 ease-in-out", 
        {
            ["sm:pl-[16rem]"]: !toggleCollapse,
            ["sm:pl-[5.6rem]"]: toggleCollapse,
        }
    );

    return (
        <header className={headerStyle}>
            <div className="h-12 flex items-center justify-between">
                <button
                    onClick={sidebarToggle}
                    className="order-2 sm:order-1 bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 rounded-lg w-8 h-8 flex items-center justify-center shadow-md shadow-gray-400/20 transition duration-300 ease-in-out"
                >
                    <BsList size={18}  />
                </button>

                <div className="flex items-center justify-between sm:order-2 order-1">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shadow-inner text-gray-700 mr-3">
                        <UserNav />
                    </div>
                </div>
            </div>
        </header>
    );
}
