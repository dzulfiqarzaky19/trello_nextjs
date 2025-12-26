'use client';

import Link from 'next/link';
import { Button } from '../../ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Folder,
  Users,
  Calendar,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const SIDEBAR_CONTENT = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    label: 'Projects',
    icon: Folder,
    href: '/projects',
  },
  {
    label: 'Team',
    icon: Users,
    href: '/team',
  },
  {
    label: 'Calendar',
    icon: Calendar,
    href: '/calendar',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
] as const;

export const SidebarMain = () => {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-1 px-4 py-2">
      {SIDEBAR_CONTENT.map((item) => (
        <Link
          href={item.href}
          className="w-full"
          aria-current={pathname === item.href ? 'page' : undefined}
          aria-label={item.label}
        >
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 px-4 py-2 font-medium text-muted-foreground hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer',
              pathname === item.href &&
                'bg-red-50 text-red-600 hover:bg-red-50 hover:text-red-700'
            )}
          >
            <item.icon
              className={cn(
                'w-5 h-5',
                pathname === item.href && 'text-red-600'
              )}
            />
            {item.label}
          </Button>
        </Link>
      ))}
    </aside>
  );
};
