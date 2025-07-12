import { SideNavItem } from "@/app/types";
import {
  BsBook,
  BsCalendar,
  BsCreditCard,
  BsHouseDoor,
  BsLayers,
  BsPerson,
  BsPersonWorkspace,
  BsShieldLock,
  // BsList,
  BsDoorOpen,
} from "react-icons/bs";
import { MdAppRegistration, MdOutlineFileCopy } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { RiDashboard2Line } from "react-icons/ri";
import { GrMapLocation } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
  FaClipboardList,
  FaRegCommentDots,
  FaRegCircleQuestion,
} from "react-icons/fa6";
import {
  MdOutlineAssignment,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { IoIosTimer } from "react-icons/io";

export const SIDENAV_ITEMS_ADMIN: SideNavItem[] = [
  {
    title: "Thống kê",
    path: "/admin/dashboard",
    icon: <RiDashboard2Line size={20} />,
  },
  // {
  //   title: "Quản lý chung",
  //   path: "/admin/general",
  //   submenu: true,
  //   icon: <BsList size={20} />,
  //   subMenuItems: [
  //     {
  //       title: "Quản lý chi nhánh",
  //       path: "/admin/branches",
  //       icon: <GrMapLocation size={20} />,
  //     },
  //     {
  //       title: "Quản lý ca học",
  //       path: "/admin/sessions",
  //       icon: <AiOutlineSchedule size={20} />,
  //     },
  //     {
  //       title: "Quản lý chức vụ",
  //       path: "/admin/roles",
  //       icon: <BsShieldLock size={20} />,
  //     },
  //   ],
  // },
  {
    title: "Thông báo",
    path: "/admin/notifications",
    icon: <MdOutlineNotificationsActive size={20} />,
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
    title: "Quản lý phòng học",
    path: "/admin/rooms",
    icon: <BsDoorOpen size={20} />,
  },
  {
    title: "Tài liệu hệ thống",
    path: "/admin/system-material",
    icon: <HiOutlineDocumentText size={20} />,
  },
  {
    title: "Quản lý câu hỏi",
    path: "/admin/questions",
    icon: <FaRegCircleQuestion size={20} />,
  },
  // {
  //   title: "Quản lý học phí",
  //   path: "/admin/fees",
  //   icon: <GiMoneyStack size={20} />,
  // },
  {
    title: "Quản lý chi nhánh",
    path: "/admin/branches",
    icon: <GrMapLocation size={20} />,
  },
  {
    title: "Quản lý lịch trình lớp học",
    path: "/admin/schedule",
    icon: <BsCalendar size={20} />,
  },
  {
    title: "Quản lý thành tích học tập",
    path: "/admin/manage-scores",
    icon: <BsPersonWorkspace size={20} />,
  },
  {
    title: "Quản lý ca học",
    path: "/admin/sessions",
    icon: <AiOutlineSchedule size={20} />,
  },
  {
    title: "Quản lý chức vụ",
    path: "/admin/roles",
    icon: <BsShieldLock size={20} />,
  },
  {
    title: "Liên hệ",
    path: "/admin/contact",
    icon: <FaRegCommentDots size={20} />,
  },
];

export const SIDENAV_ITEMS_TEACHER: SideNavItem[] = [
  {
    title: "Lớp học",
    path: "/teacher/classes",
    icon: <SiGoogleclassroom size={20} />,
  },
  {
    title: "Lịch dạy",
    path: "/teacher/schedule",
    icon: <BsCalendar size={20} />,
  },
  {
    title: "Tài liệu cá nhân",
    path: "/teacher/personal-material",
    icon: <MdOutlineFileCopy size={20} />,
  },
  {
    title: "Kết quả học tập",
    path: "/teacher/academic-results",
    icon: <BsPersonWorkspace size={20} />,
  },
  {
    title: "Thông báo",
    path: "/teacher/notifications",
    icon: <MdOutlineNotificationsActive size={20} />,
  },
  {
    title: "Quản lý câu hỏi",
    path: "/teacher/questions",
    icon: <FaRegCircleQuestion size={20} />,
  },
  {
    title: "Quản lý bài tập",
    path: "/teacher/assignments",
    icon: <MdOutlineAssignment size={20} />,
  },
  {
    title: "Lịch trống",
    path: "/teacher/available-time",
    icon: <IoIosTimer size={20} />,
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
    path: "/member/academic-results",
    icon: <BsPersonWorkspace size={20} />,
  },
  {
    title: "Đăng ký lớp học",
    path: "/member/class-register",
    icon: <MdAppRegistration size={20} />,
  },
];

export const SIDENAV_ITEMS_PARENT: SideNavItem[] = [
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
    title: "Điểm danh",
    path: "/member/attendance",
    icon: <FaClipboardList size={20} />,
  },
  {
    title: "Học phí",
    path: "/member/tuition",
    icon: <BsCreditCard size={20} />,
  },
  {
    title: "Kết quả học tập",
    path: "/member/academic-results",
    icon: <BsPersonWorkspace size={20} />,
  },
  {
    title: "Thông báo",
    path: "/member/notifications",
    icon: <MdOutlineNotificationsActive size={20} />,
  },
  {
    title: "Liên hệ giáo vụ",
    path: "/member/contact",
    icon: <FaRegCommentDots size={20} />,
  },
];

const allNavItems: SideNavItem[] = [
  ...SIDENAV_ITEMS_ADMIN,
  ...SIDENAV_ITEMS_TEACHER,
  ...SIDENAV_ITEMS_STUDENT,
  ...SIDENAV_ITEMS_PARENT,
];

export const routeMap: Record<
  string,
  {
    title: string;
    icon: JSX.Element;
  }
> = allNavItems.reduce(
  (acc, item) => {
    acc[item.path] = { title: item.title, icon: item.icon ?? <div></div> };
    return acc;
  },
  {} as Record<string, { title: string; icon: JSX.Element }>,
);
