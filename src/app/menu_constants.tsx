import { SideNavItemGroup } from "@/app/types/type";
import {
  BsBook,
  BsGear,
  BsHouseDoor,
  BsPerson,
  // BsFillPeopleFill,
  BsQuestionCircle,
} from "react-icons/bs";

import { SiGoogleclassroom } from "react-icons/si";
import { GrMapLocation } from "react-icons/gr";

export const SIDENAV_ITEMS_ADMIN: SideNavItemGroup[] = [
  {
    title: "Thống kê",
    menuList: [
      {
        title: "Bảng thống kê",
        path: "/admin/dashboard",
        icon: <BsHouseDoor size={20} />,
      },
    ],
  },
  {
    title: "Quản lý",
    menuList: [
      {
        title: "Quản lý chi nhánh",
        path: "/admin/branches",
        icon: <GrMapLocation size={20} />,
      },
      {
        title: "Quản lý tài khoản",
        path: "/admin/accounts",
        icon: <BsPerson size={20} />,
      },
      {
        title: "Quản lý môn học",
        path: "/admin/courses",
        icon: <BsBook size={20} />,
      },
      {
        title: "Quản lý lớp học",
        path: "/admin/classes",
        icon: <SiGoogleclassroom size={20} />,
      },
    ],
  },
  {
    title: "Khác",
    menuList: [
      {
        title: "Cài đặt",
        path: "/setting",
        icon: <BsGear size={20} />,
      },
      {
        title: "Hỗ trợ",
        path: "/help",
        icon: <BsQuestionCircle size={20} />,
      },
    ],
  },
];

export const SIDENAV_ITEMS_STAFF: SideNavItemGroup[] = [
  {
    title: "Thống kê",
    menuList: [
      {
        title: "Bảng thống kê",
        path: "/staff",
        icon: <BsHouseDoor size={20} />,
      },
    ],
  },
  {
    title: "Quản lý",
    menuList: [
      {
        title: "Quản lý tài khoản",
        path: "/staff/accounts",
        icon: <BsPerson size={20} />,
      },
      {
        title: "Quản lý môn học",
        path: "/staff/courses",
        icon: <BsBook size={20} />,
      },
      {
        title: "Quản lý lớp học",
        path: "/staff/classes",
        icon: <SiGoogleclassroom size={20} />,
      },
    ],
  },
];
