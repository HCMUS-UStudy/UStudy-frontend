import { useSideBarToggle } from '@/app/hooks/use-sidebar-toggle';
import { SideNavItemGroup } from '@/app/types/type';
import React from 'react';
import { SidebarMenuItem } from './SidebarMenuItem';
import classNames from 'classnames';
import '../style/SidebarMenuGroup.css'; // Import file CSS

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
