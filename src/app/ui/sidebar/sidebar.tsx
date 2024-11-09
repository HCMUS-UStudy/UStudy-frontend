'use client';
import { SIDENAV_ITEMS_ADMIN } from '@/app/menu_constants';
import classNames from 'classnames';
// import React, { useEffect, useState } from 'react';
import { useSideBarToggle } from '@/app/hooks/use-sidebar-toggle';
import SidebarMenuGroup from './SidebarMenuGroup';
import '../style/Sidebar.css'; // Import file CSS
// import { BsList } from 'react-icons/bs';
import { RiArrowLeftSLine } from "react-icons/ri";


export const Sidebar = () => {
    // const [mounted, setMounted] = useState(false);
    // const { toggleCollapse } = useSideBarToggle();
    const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle();
    const sidebarToggle = () => {
        invokeToggleCollapse();
    }

    const asideStyle = classNames(
        "sidebar",
        { "wide": !toggleCollapse, "narrow": toggleCollapse }
    );

    const sidebarToggleStyle = classNames(
        "sidebar-toggle",
        {
            "isLeft": !toggleCollapse,
            "isRight": toggleCollapse
        }
    );
    // useEffect(() => setMounted(true), []);

    return (
        <>
            <aside className={asideStyle}>
                <div className="sidebar-top justify-center">
                    {/* {<SidebarLogo />} */}
                    <h3 className={classNames("sidebar-title", { hidden: toggleCollapse })}>
                        <div className='US'>
                            US
                        </div>
                        <div>
                            tudy
                        </div>
                    </h3>
                </div>
                <nav className="flex flex-col gap-2 px-4"> {/* Adjusted gap for spacing */}
                    {SIDENAV_ITEMS_ADMIN.map((item, idx) => (
                        <SidebarMenuGroup key={idx} menuGroup={item} />
                    ))}
                </nav>
            </aside>
            <button
                className={sidebarToggleStyle}
                onClick={sidebarToggle}
                >
                <RiArrowLeftSLine size={14}  />
            </button>
        </>
    );
};
