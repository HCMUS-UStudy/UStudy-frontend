import { useSideBarToggle } from '@/app/hooks/use-sidebar-toggle';
import { SideNavItemGroup } from '@/app/types/type';
import React from 'react';
import { SideBarMenuItem } from './sidebar-menu-item';
import classNames from 'classnames';

const SideBarMenuGroup = ({ menuGroup }: { menuGroup: SideNavItemGroup }) => {
    const { toggleCollapse } = useSideBarToggle();

    const menuGroupTitleStyle = classNames(
        'py-4 tracking-[.1rem] font-medium uppercase text-xs text-gray-500 transition duration-300',
        { 'text-center': toggleCollapse }
    );

    return (
        <>
            <h3 className={menuGroupTitleStyle}>{!toggleCollapse ? menuGroup.title : '...'}</h3>
            {menuGroup.menuList?.map((item, index) => (
                <SideBarMenuItem key={index} item={item} />
            ))}
        </>
    );
};

export default SideBarMenuGroup;