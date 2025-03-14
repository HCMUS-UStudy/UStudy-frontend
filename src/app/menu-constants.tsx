import { SideNavItem, SideNavItemGroup } from "@/app/types/type";
import {
  BsBook,
  BsCalendar,
  // BsCardChecklist,
  BsCreditCard,
  BsHouseDoor,
  BsLayers,
  BsPerson,
  BsPersonWorkspace,
  BsShieldLock,
  // BsFillPeopleFill,
  // BsQuestionCircle,
  // BsWallet2,
} from "react-icons/bs";

import { SiGoogleclassroom } from "react-icons/si";
import { GiMoneyStack } from "react-icons/gi";
import { RiDashboard2Line } from "react-icons/ri";
import { GrMapLocation } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";

export const SIDENAV_ITEMS_ADMIN: SideNavItem[] = [
  {
    title: "Thống kê",
    path: "/admin/dashboard",
    icon: <RiDashboard2Line size={20} />,
  },
  {
    title: "Quản lý chi nhánh",
    path: "/admin/branches",
    icon: <GrMapLocation size={20} />,
  },
  {
    title: "Quản lý ca học",
    path: "/admin/sessions",
    icon: <AiOutlineSchedule size={20} />,
  },
  {
    title: "Quản lý tài khoản",
    path: "/admin/accounts",
    icon: <BsPerson size={20} />,
  },
  {
    title: "Quản lý chức vụ",
    path: "/admin/roles",
    icon: <BsShieldLock size={20} />,
  },
  {
    title: "Quản lý môn học",
    path: "/admin/courses",
    icon: <BsBook size={20} />,
  },
  {
    title: "Quản lý khối học",
    path: "/admin/grades",
    icon: <BsLayers size={20} />,
  },
  {
    title: "Quản lý lớp học",
    path: "/admin/classes",
    icon: <SiGoogleclassroom size={20} />,
  },
  {
    title: "Quản lý học phí",
    path: "/admin/fees",
    icon: <GiMoneyStack size={20} />,
  },
];

export const SIDENAV_ITEMS_CLERK: SideNavItemGroup[] = [
  {
    title: "Thống kê",
    menuList: [
      {
        title: "Bảng thống kê",
        path: "/clerk/dashboard",
        icon: <BsHouseDoor size={20} />,
      },
    ],
  },
  {
    title: "Quản lý",
    menuList: [
      {
        title: "Quản lý tài khoản",
        path: "/clerk/accounts",
        icon: <BsPerson size={20} />,
      },
      {
        title: "Quản lý môn học",
        path: "/clerk/courses",
        icon: <BsBook size={20} />,
      },
      {
        title: "Quản lý lớp học",
        path: "/clerk/classes",
        icon: <SiGoogleclassroom size={20} />,
      },
    ],
  },
];

export const SIDENAV_ITEMS_TEACHER: SideNavItem[] = [
  {
    title: "Trang chủ",
    path: "/teacher/home",
    icon: <BsHouseDoor size={20} />,
  },
  {
    title: "Lớp học",
    path: "/teacher/classes",
    icon: <SiGoogleclassroom size={20} />,
  },
  {
    title: "Lịch học",
    path: "/teacher/schedule",
    icon: <BsCalendar size={20} />,
  },
  {
    title: "Học phí",
    path: "/teacher/tuition",
    icon: <BsCreditCard size={20} />,
  },
  {
    title: "Kết quả học tập",
    path: "/teacher/results",
    icon: <BsPersonWorkspace size={20} />,
  },
];

export const SIDENAV_ITEMS_STUDENT: SideNavItem[] = [
  {
    title: "Trang chủ",
    path: "/student/home",
    icon: <BsHouseDoor size={20} />,
  },
  {
    title: "Lớp học",
    path: "/student/classes",
    icon: <SiGoogleclassroom size={20} />,
  },
  {
    title: "Lịch học",
    path: "/student/schedule",
    icon: <BsCalendar size={20} />,
  },
  {
    title: "Học phí",
    path: "/student/tuition",
    icon: <BsCreditCard size={20} />,
  },
  {
    title: "Kết quả học tập",
    path: "/student/results",
    icon: <BsPersonWorkspace size={20} />,
  },
];
