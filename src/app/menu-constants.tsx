import { SideNavItem, SideNavItemGroup } from "@/app/types";
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
import { MdOutlineFileCopy } from "react-icons/md";

import { SiGoogleclassroom } from "react-icons/si";
import { GiMoneyStack } from "react-icons/gi";
import { RiDashboard2Line } from "react-icons/ri";
import { GrMapLocation } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi";
import { LuClipboardList } from "react-icons/lu";
import { FaClipboardList, FaRegCommentDots } from "react-icons/fa6";
import {
  MdOutlineAssignment,
  MdOutlineNotificationsActive,
} from "react-icons/md";

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
    title: "Quản lý tài liệu",
    path: "/admin/materials",
    icon: <HiOutlineDocumentText size={20} />,
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
    title: "Điểm danh",
    path: "/teacher/attendance",
    icon: <LuClipboardList size={20} />,
  },
  {
    title: "Tài liệu cá nhân",
    path: "/teacher/personal-material",
    icon: <MdOutlineFileCopy size={20} />,
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
    path: "/member/home",
    icon: <BsHouseDoor size={20} />,
  },
  {
    title: "Lớp học",
    path: "/member/classes",
    icon: <SiGoogleclassroom size={20} />,
  },
  {
    title: "Lịch học",
    path: "/member/schedule",
    icon: <BsCalendar size={20} />,
  },
  {
    title: "Học phí",
    path: "/member/tuition",
    icon: <BsCreditCard size={20} />,
  },
  {
    title: "Kết quả học tập",
    path: "/member/results",
    icon: <BsPersonWorkspace size={20} />,
  },
];

export const SIDENAV_ITEMS_PARENT: SideNavItem[] = [
  {
    title: "Trang chủ",
    path: "/parent/home",
    icon: <BsHouseDoor size={20} />,
  },
  {
    title: "Lớp học của con",
    path: "/parent/classes",
    icon: <SiGoogleclassroom size={20} />,
  },
  {
    title: "Lịch học",
    path: "/parent/schedule",
    icon: <BsCalendar size={20} />,
  },
  {
    title: "Điểm danh",
    path: "/parent/attendance",
    icon: <FaClipboardList size={20} />,
  },
  {
    title: "Bài tập",
    path: "/parent/assignments",
    icon: <MdOutlineAssignment size={20} />,
  },
  {
    title: "Học phí",
    path: "/parent/tuition",
    icon: <BsCreditCard size={20} />,
  },
  {
    title: "Kết quả học tập",
    path: "/parent/results",
    icon: <BsPersonWorkspace size={20} />,
  },
  {
    title: "Thông báo",
    path: "/parent/notifications",
    icon: <MdOutlineNotificationsActive size={20} />,
  },
  {
    title: "Liên hệ giáo viên",
    path: "/parent/contact",
    icon: <FaRegCommentDots size={20} />,
  },
];
