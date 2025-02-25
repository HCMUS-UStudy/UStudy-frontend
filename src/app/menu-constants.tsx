import { SideNavItem, SideNavItemGroup } from "@/app/types/type";
import {
  BsBook,
  BsCalendar,
  BsCardChecklist,
  BsCreditCard,
  BsHouseDoor,
  BsLayers,
  BsPerson,
  BsPersonWorkspace,
  BsShieldLock,
  // BsFillPeopleFill,
  // BsQuestionCircle,
  BsWallet2,
} from "react-icons/bs";

import { SiGoogleclassroom } from "react-icons/si";
import { GiMoneyStack } from "react-icons/gi";
import { RiDashboard2Line } from "react-icons/ri";
import { GrMapLocation, GrSchedules } from "react-icons/gr";

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

  // {
  //   title: "Cài đặt",
  //   path: "/setting",
  //   icon: <BsGear size={20} />,
  // },
  // {
  //   title: "Hỗ trợ",
  //   path: "/help",
  //   icon: <BsQuestionCircle size={20} />,
  // },
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

export const SIDENAV_ITEMS_TEACHER: SideNavItemGroup[] = [
  {
    menuList: [
      {
        title: "Bảng thống kê",
        path: "/teacher/dashboard",
        icon: <BsHouseDoor size={20} />,
      },
      {
        title: "Lịch dạy",
        path: "/teacher/schedule",
        icon: <GrSchedules size={20} />,
      },
      {
        title: "Lớp học",
        path: "/teacher/classes",
        icon: <SiGoogleclassroom size={20} />,
      },
    ],
  },
];

export const SIDENAV_ITEMS_STUDENT: SideNavItemGroup[] = [
  {
    title: "Trang chính",
    menuList: [
      {
        title: "Trang chủ",
        path: "/student/home",
        icon: <BsHouseDoor size={20} />,
      },
    ],
  },
  {
    title: "Học phí",
    menuList: [
      {
        title: "Đóng học phí",
        path: "/student/tuition/pay",
        icon: <BsCreditCard size={20} />,
      },
      {
        title: "Tra cứu học phí",
        path: "/student/tuition/check",
        icon: <BsWallet2 size={20} />,
      },
    ],
  },
  {
    title: "Lịch học và lớp học",
    menuList: [
      {
        title: "Xem lịch học",
        path: "/student/schedule",
        icon: <BsCalendar size={20} />,
      },
      {
        title: "Xem danh sách các lớp học",
        path: "/student/classes",
        icon: <SiGoogleclassroom size={20} />,
      },
    ],
  },
  {
    title: "Học tập",
    menuList: [
      {
        title: "Bài tập & Kiểm tra",
        path: "/student/study/test",
        icon: <BsCardChecklist size={20} />,
      },
      {
        title: "Xem nội dung môn học",
        path: "/student/study/content",
        icon: <BsBook size={20} />,
      },
      {
        title: "Xem kết quả học tập",
        path: "/student/study/results",
        icon: <BsPersonWorkspace size={20} />,
      },
    ],
  },
];
