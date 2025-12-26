import { SidebarMain } from './components/SidebarMain';
import { SidebarFooter } from './components/sidebarFooter/SidebarFooter';
import { Logo } from '../ui/Logo';

export const Sidebar = () => (
  <div className="grid grid-rows-[auto_1fr_auto] h-screen sticky top-0 z-10 shadow bg-white">
    <header className="p-6">
      <Logo />
    </header>

    <SidebarMain />

    <SidebarFooter />
  </div>
);
