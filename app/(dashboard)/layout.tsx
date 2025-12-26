import { Sidebar } from '@/components/sidebar/Sidebar';

interface IDashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: IDashboardLayoutProps) {
  return (
    <div className="grid grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="min-w-0">{children}</main>
    </div>
  );
}
