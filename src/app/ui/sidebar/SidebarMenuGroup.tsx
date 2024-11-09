import { useSideBarToggle } from '@/app/hooks/use-sidebar-toggle';
import { SideNavItemGroup } from '@/app/types/type';
import { SideNavItem } from '@/app/types/type';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import '../style/SidebarMenu.css'; // Import file CSS

const getLinkClass = (isActive: boolean, toggleCollapse: boolean) =>
	classNames("inactive-link", {
		"active-link": isActive,
		"justify-center": toggleCollapse,
	});


const SidebarMenuItem = ({ item }: { item: SideNavItem }) => {
	const { toggleCollapse } = useSideBarToggle();
	const pathname = usePathname();

	const isActive = pathname.includes(item.path);

	return (
		<>
			<Link href={item.path} className={getLinkClass(isActive, toggleCollapse)}>
				<div className="icon-container">{item.icon}</div>
				{!toggleCollapse && <span className="inactive-text">{item.title}</span>}
			</Link>
		</>
	);
};

const SidebarMenuGroup = ({ menuGroup }: { menuGroup: SideNavItemGroup }) => {
    const { toggleCollapse } = useSideBarToggle();

    const menuGroupTitleStyle = classNames(
        'menu-group-title',
        { 'menu-group-title-centered': toggleCollapse }
    );

    return (
        <>
            <h3 className={menuGroupTitleStyle}>{!toggleCollapse ? menuGroup.title : '...'}</h3>
            {menuGroup.menuList?.map((item, index) => (
                <SidebarMenuItem key={index} item={item} />
            ))}
        </>
    );
};

export default SidebarMenuGroup;
