'use client'
import { useSideBarToggle } from '@/app/hooks/use-sidebar-toggle';
import classNames from 'classnames';
import { ReactNode } from 'react';

//bọc nội dung trang
export default function PageWrapper({ children }: { children: ReactNode }) {
    
    const { toggleCollapse } = useSideBarToggle();
    const bodyStyle = classNames("bg-background flex flex-col mt-16 py-4 p-4 h-full overflow-y-auto",
        {
            ["sm:pl-[19rem]"]: !toggleCollapse, // side bar đang mở page rộng ra
            ["sm:pl-[8rem]"]: toggleCollapse, //side bar đóng page thu lại
        });

    return (
        <div className={bodyStyle}>
            {children}
        </div>
    );
}