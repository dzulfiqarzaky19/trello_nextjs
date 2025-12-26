'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { SidebarFooterLoader } from './SidebarFooterLoader';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const SidebarFooterTrigger = () => {
  const { user, profile, loading } = useAuth();

  if (!user) return null;
  if (loading) return <SidebarFooterLoader />;

  return (
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
            {(profile?.full_name || user.user_metadata?.full_name || 'User')[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col overflow-hidden text-left">
          <span className="text-sm font-bold truncate">
            {profile?.full_name || user.user_metadata?.full_name || 'User'}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {profile?.role || user.email || 'Member'}
          </span>
        </div>
      </div>
    </DropdownMenuTrigger>
  );
};
