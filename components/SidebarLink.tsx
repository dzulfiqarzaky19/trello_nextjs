'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Folder,
  Users,
  Calendar,
  Settings,
} from 'lucide-react';

const ICONS = { LayoutDashboard, Folder, Users, Calendar, Settings };

export const SidebarLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}) => {
  const pathname = usePathname();

  const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);

  const Icon = ICONS[icon];

  return (
    <Link
      href={href}
      className="w-full"
      aria-current={isActive ? 'page' : undefined}
    >
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-3 px-4 py-2 font-medium text-muted-foreground hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer',
          isActive &&
            'bg-red-50 text-red-600 hover:bg-red-50 hover:text-red-700'
        )}
      >
        <Icon className={cn('w-5 h-5', isActive && 'text-red-600')} />
        {label}
      </Button>
    </Link>
  );
};
