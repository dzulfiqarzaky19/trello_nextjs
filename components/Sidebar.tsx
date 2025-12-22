import {
  Calendar,
  Folder,
  LayoutDashboard,
  LucideTrello,
  Settings,
  Users,
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarLink } from './SidebarLink';

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
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen sticky top-0 z-10 border-r bg-white w-64">
      <header className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-red-50 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">TaskMaster</h1>
        </div>
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
        <div className="bg-red-50/50 p-3 rounded-xl flex items-center gap-3 border border-red-100/50 cursor-pointer hover:bg-red-50 transition-colors">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src="https://randomuser.me/api/portraits/women/1.jpg" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate">Sarah Jenkins</span>
            <span className="text-xs text-muted-foreground truncate">
              Product Manager
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
