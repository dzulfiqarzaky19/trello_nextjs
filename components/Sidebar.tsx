'use client';

import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarLink } from './SidebarLink';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { Logo } from './ui/Logo';

const SIDEBAR_CONTENT = [
  {
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/',
  },
  {
    label: 'Projects',
    icon: 'Folder',
    href: '/projects',
  },
  {
    label: 'Team',
    icon: 'Users',
    href: '/team',
  },
  {
    label: 'Calendar',
    icon: 'Calendar',
    href: '/calendar',
  },
  {
    label: 'Settings',
    icon: 'Settings',
    href: '/settings',
  },
] as const;

export const Sidebar = () => {
  const { user, profile, loading, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen sticky top-0 z-10 shadow bg-white">
      <header className="p-6">
        <Logo />
      </header>

      <aside className="flex flex-col gap-1 px-4 py-2">
        {SIDEBAR_CONTENT.map((item) => (
          <SidebarLink
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </aside>

      <footer className="p-4">
        {loading ? (
          <div className="flex items-center gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="h-2 w-[80px]" />
            </div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-red-50 transition-colors border border-transparent hover:border-red-100">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={
                      profile?.avatar_url ||
                      user.user_metadata?.avatar_url ||
                      'https://github.com/shadcn.png'
                    }
                  />
                  <AvatarFallback>
                    {
                      (profile?.full_name ||
                        user.user_metadata?.full_name ||
                        'User')[0]
                    }
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col overflow-hidden text-left">
                  <span className="text-sm font-bold truncate">
                    {profile?.full_name ||
                      user.user_metadata?.full_name ||
                      'User'}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {profile?.role || user.email || 'Member'}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 border-none">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/settings">
                <DropdownMenuItem className="hover:bg-red-50">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={signOut}
                className="text-red-600 focus:text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </footer>
    </div>
  );
};
