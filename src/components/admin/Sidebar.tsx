'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Tổng quan',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Quản lý khóa học',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    title: 'Quản lý người dùng',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Quản lý kết quả học tập',
    href: '/admin/learning-results',
    icon: GraduationCap,
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-4 border-r bg-background p-4">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span>UStudy Admin</span>
        </Link>
      </div>
      <nav className="grid gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 