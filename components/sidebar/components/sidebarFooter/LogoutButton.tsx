'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
  const { signOut } = useAuth();

  return (
    <DropdownMenuItem
      onClick={signOut}
      className="text-red-600 focus:text-red-600 hover:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
};
