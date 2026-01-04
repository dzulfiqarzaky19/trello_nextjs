'use client';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Calendar,
  Folder,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Workspaces',
      url: '/workspaces',
      icon: Folder,
    },
    {
      title: 'Team',
      url: '/team',
      icon: Users,
    },
    {
      title: 'Calendar',
      url: '/calendar',
      icon: Calendar,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ],
};

export const AppSidebarMenu = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {data.navMain.map((item) => {
        const isActive = pathname === item.url;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={isActive}
              className={
                isActive
                  ? 'bg-red-50 text-red-600 hover:bg-red-50 hover:text-red-700'
                  : 'hover:bg-red-50 hover:text-red-700'
              }
            >
              <Link href={item.url}>
                <item.icon className={isActive ? 'text-red-600' : ''} />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
