'use client';
import { useSideBarToggle } from '@/app/hooks/use-sidebar-toggle';
import { SideNavItem } from '@/app/types/type';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';

export const SideBarMenuItem = ({ item }: { item: SideNavItem }) => {
    const { toggleCollapse } = useSideBarToggle();
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    const inactiveLink = classNames(
        "flex items-center min-h-[40px] h-full py-2 px-4 rounded-md transition duration-200 ease-in-out",
        "text-gray-700 hover:text-gray-900 hover:bg-gray-200 hover:scale-105",
        { ["justify-center"]: toggleCollapse }
    );

    const activeLink = classNames("bg-gray-300 text-gray-900");

    const navMenuDropdownItem = "text-gray-600 py-2 px-4 hover:text-gray-800 hover:bg-gray-200 transition duration-200 rounded-md";

    const dropdownMenuHeaderLink = classNames(inactiveLink, {
        ["bg-gray-200 rounded-b-none"]: subMenuOpen,
    });

    return (
        <>
            {item.submenu ? (
                <div className="min-w-[18px]">
                    <a
                        className={`${dropdownMenuHeaderLink} ${pathname.includes(item.path) ? activeLink : ''}`}
                        onClick={toggleSubMenu}
                    >
                        <div className='min-w-[20px]'>{item.icon}</div>
                        {!toggleCollapse && (
                            <>
                                <span className='ml-3 text-base leading-6 font-semibold'>{item.title}</span>
                                <BsChevronRight className={`${subMenuOpen ? 'rotate-90' : ''} ml-auto stroke-2 text-xs`} />
                            </>
                        )}
                    </a>
                    {subMenuOpen && !toggleCollapse && (
                        <div className='bg-gray-100 border-l-4'>
                            <div className='grid gap-y-2 px-10 leading-5 py-3'>
                                {item.subMenuItems?.map((subItem, idx) => (
                                    <Link
                                        key={idx}
                                        href={subItem.path}
                                        className={`${navMenuDropdownItem} ${subItem.path === pathname ? ' font-medium text-gray-900 ' : ' text-gray-700'}`}
                                    >
                                        <span>{subItem.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Link href={item.path} className={`${inactiveLink} ${item.path === pathname ? activeLink : ''}`}>
                    <div className='min-w-[20px]'>{item.icon}</div>
                    {!toggleCollapse && <span className="ml-3 leading-6 font-semibold">{item.title}</span>}
                </Link>
            )}
        </>
    );
};