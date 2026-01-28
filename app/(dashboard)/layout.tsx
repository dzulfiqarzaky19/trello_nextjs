import { AppSidebar } from '@/components/sidebar/AppSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface IDashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: IDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 shadow px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1 text-red-600 hover:bg-red-50 hover:text-red-700" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-semibold text-red-600">Trello Clone</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
