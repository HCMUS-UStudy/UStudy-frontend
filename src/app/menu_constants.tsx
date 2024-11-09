import { SideNavItemGroup } from "@/app/types/type";
import {
  BsBook,
  BsGear,
  BsHouseDoor,
  BsPerson,
  BsFillPeopleFill,
  BsQuestionCircle,
  BsArrowClockwise,
} from "react-icons/bs";

export const SIDENAV_ITEMS_ADMIN: SideNavItemGroup[] = [
  {
    title: "Thống Kê",
    menuList: [
      {
        title: "Bảng Thống Kê",
        path: "/admin/dashboard",
        icon: <BsHouseDoor size={20} />,
      },
    ],
  },
  {
    title: "Quản lý",
    menuList: [
      {
        // title: 'Products',
        // path: '/products',
        // icon: <BsKanban size={20} />,
        // submenu: true,
        // subMenuItems: [
        //     { title: 'All', path: '/products' },
        //     { title: 'New', path: '/products/new' },
        // ],
        title: "Quản lý tài khoản",
        path: "/admin/accounts",
        icon: <BsPerson size={20} />,
      },
      {
        title: "Quản lý môn học",
        path: "/courses",
        icon: <BsBook size={20} />,
      },
      {
        title: "Quản lý lớp học",
        path: "/class",
        icon: <BsFillPeopleFill size={20} />,
      },
      {
        title: "Khôi phục & Sao lưu",
        path: "/backup",
        icon: <BsArrowClockwise size={20} />,
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
    title: "Thống Kê",
    menuList: [
      {
        title: "Bảng Thống Kê",
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
        icon: <BsFillPeopleFill size={20} />,
      },
    ],
  },
];
