"use client";
// import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
// import React, { useEffect } from "react";
// import SidebarMenu from "./SidebarMenu";
// import { SideNavItemGroup } from "@/app/types/type";
// import { RiArrowLeftSLine } from "react-icons/ri";
// import Image from "next/image";

// const Sidebar = ({ menuItems }: { menuItems: SideNavItemGroup[] }) => {
//   const { toggleCollapse, setToggleCollapse, invokeToggleCollapse } =
//     useSideBarToggle();

//   // Auto-collapse sidebar on screens smaller than 1024px
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setToggleCollapse(true);
//       } else {
//         setToggleCollapse(false);
//       }
//     };

//     handleResize(); // Set initial state based on screen width
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [setToggleCollapse]);

//   const sidebarToggle = () => {
//     invokeToggleCollapse();
//   };

//   return (
//     <>
//       <aside
//         className={`fixed top-4 left-4 bottom-4 shadow-lg rounded-3xl border-r border-l border-gray-300 transition-all duration-300 overflow-y-auto ${
//           toggleCollapse ? "w-[90px]" : "w-[220px]"
//         } bg-blue-200`}
//       >
//         <div className="flex items-center justify-center gap-2 pt-12 pb-8">
//           <Image
//             src="/UStudyIcon.png"
//             alt="Logo"
//             className="w-[45px] h-[45px]"
//             width={45}
//             height={45}
//           />
//           <h3
//             className={`font-bold text-2xl flex ${
//               toggleCollapse ? "hidden" : "min-w-max"
//             }`}
//           >
//             <span className="text-blue-800">US</span>
//             <span>tudy</span>
//           </h3>
//         </div>
//         <nav className="flex flex-col gap-2 px-5">
//           {menuItems.map((item, idx) => (
//             <SidebarMenu key={idx} menuGroup={item} />
//           ))}
//         </nav>
//       </aside>
//       <button
//         onClick={sidebarToggle}
//         className={`fixed top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow transition-all duration-300 bg-gray-200 text-black ${
//           toggleCollapse ? "left-[calc(92px)] rotate-180" : "left-[calc(222px)]"
//         }`}
//       >
//         <RiArrowLeftSLine size={14} />
//       </button>
//     </>
//   );
// };

// export default Sidebar;

import Image from "next/image";
import { SIDENAV_ITEMS_ADMIN } from "@/app/menu-constants";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed transition-all duration-300 w-[230px] bg-foreground h-full">
      <div className="flex items-center justify-center pt-12 pb-12">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
      </div>
      {/* menu */}
      <div className="flex flex-col gap-[18px] px-5">
        {SIDENAV_ITEMS_ADMIN.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 px-4 py-[10px] rounded-2xl cursor-pointer ${
              pathname.includes(item.path)
                ? "bg-primary hover:bg-hover-primary"
                : "hover:bg-primary-light"
            }`}
            onClick={() => router.push(item.path)}
          >
            <div className="w-6 h-6">{item.icon}</div>
            <div className="text-[14px] font-[500]">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
