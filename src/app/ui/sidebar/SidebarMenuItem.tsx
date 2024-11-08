'use client';
import { useSideBarToggle } from '@/app/hooks/use-sidebar-toggle';
import { SideNavItem } from '@/app/types/type';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import '../style/SidebarMenuItem.css';

// Helper functions for class names
const getLinkClass = (isActive: boolean, toggleCollapse: boolean) =>
	classNames("inactive-link", {
		"active-link": isActive,
		"justify-center": toggleCollapse,
	});

const getDropdownHeaderClass = (subMenuOpen: boolean) =>
	classNames("dropdown-menu-header-link", {
		"bg-active": subMenuOpen,
	});

export const SidebarMenuItem = ({ item }: { item: SideNavItem }) => {
	const { toggleCollapse } = useSideBarToggle();
	const pathname = usePathname();
	const [subMenuOpen, setSubMenuOpen] = useState(false);

	const toggleSubMenu = () => setSubMenuOpen(!subMenuOpen);

	const isActive = pathname.includes(item.path);

	return (
		<>
			{item.submenu ? (
				<div className="menu-container">
					<a className={getDropdownHeaderClass(subMenuOpen)} onClick={toggleSubMenu}>
						<div className="icon-container">{item.icon}</div>
						{!toggleCollapse && (
							<>
								<span className="menu-title">{item.title}</span>
								<BsChevronRight className={`${subMenuOpen ? 'rotate-icon' : ''} icon-spacing`} />
							</>
						)}
					</a>
					{subMenuOpen && !toggleCollapse && (
						<div className="sub-menu">
							{item.subMenuItems?.map((subItem, idx) => (
								<Link
									key={idx}
									href={subItem.path}
									className={classNames("nav-menu-dropdown-item", {
										"active-dropdown-item": subItem.path === pathname,
									})}
								>
									<span>{subItem.title}</span>
								</Link>
							))}
						</div>
					)}
				</div>
			) : (
				<Link href={item.path} className={getLinkClass(isActive, toggleCollapse)}>
					<div className="icon-container">{item.icon}</div>
					{!toggleCollapse && <span className="inactive-text">{item.title}</span>}
				</Link>
			)}
		</>
	);
};
