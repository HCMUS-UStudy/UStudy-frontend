"use client";

import Image from "next/image";
import { SIDENAV_ITEMS_STUDENT } from "@/app/menu-constants";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed transition-all duration-300 w-sidebar-width bg-foreground h-full">
      <div className="flex items-center justify-center py-11">
        <Image src="/logo.png" alt="Logo" width={135} height={135} />
      </div>
      {/* menu */}
      <div className="flex flex-col gap-[11px] px-4">
        {SIDENAV_ITEMS_STUDENT.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 px-[14px] py-[10px] rounded-2xl cursor-pointer ${
              pathname.includes(item.path)
                ? "bg-primary hover:bg-hover-primary"
                : "hover:bg-primary-light"
            }`}
            onClick={() => router.push(item.path)}
          >
            <div className="mt-[2px] w-6 h-6">{item.icon}</div>
            <div className="text-[14px] font-[500]">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
