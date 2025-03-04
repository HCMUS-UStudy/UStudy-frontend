"use client";

import Image from "next/image";
import { SIDENAV_ITEMS_STUDENT } from "@/app/menu-constants";
import { useRouter, usePathname } from "next/navigation";

const SidebarStu = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed transition-all duration-300 w-sidebar-width bg-foreground h-full">
      <div className="flex items-center justify-center py-11">
        <Image src="/logo.png" alt="Logo" width={135} height={135} />
      </div>
      {/* menu */}
      <div className="flex flex-col gap-[16px] px-4">
        {SIDENAV_ITEMS_STUDENT.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold text-gray-600 mb-2">
              {group.title}
            </h3>
            <div className="flex flex-col gap-1 mb-4">
              {group.menuList.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-[14px] py-[10px] rounded-2xl cursor-pointer transition-colors ${
                    pathname.includes(item.path)
                      ? "bg-primary text-white hover:bg-hover-primary"
                      : "hover:bg-primary-light text-gray-800"
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  <div className="mt-[2px] w-6 h-6">{item.icon}</div>
                  <div className="text-[14px] font-[500]">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarStu;
