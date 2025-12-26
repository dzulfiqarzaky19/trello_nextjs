import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { LogoutButton } from './LogoutButton';
import { SidebarFooterTrigger } from './SidebarFooterTrigger';
import { User } from 'lucide-react';

export const SidebarFooter = () => (
  <footer className="p-4">
    <DropdownMenu>
      <SidebarFooterTrigger />

      <DropdownMenuContent align="end" className="w-56 border-none">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem className="hover:bg-red-50">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  </footer>
);
