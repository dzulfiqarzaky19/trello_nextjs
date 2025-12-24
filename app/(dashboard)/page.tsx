import { Header } from '@/components/header/Header';
import { DashboardMain } from '@/features/dashboard/DashboardMain';

const DASHBOARD_PAGE_HEADER = {
  label: 'Dashboard Overview',
  description: 'Real-time insights and project analytics',
};

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr] ">
      <Header
        label={DASHBOARD_PAGE_HEADER.label}
        description={DASHBOARD_PAGE_HEADER.description}
      />

      <DashboardMain />
    </div>
  );
}
