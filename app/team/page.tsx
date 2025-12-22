import { Header } from '@/components/header/Header';
import { TeamMain } from '@/features/team/TeamMain';
import { TEAM_PAGE_HEADER } from '@/lib/const/teamPage';

export default function TeamPage() {
  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        label={TEAM_PAGE_HEADER.label}
        description={TEAM_PAGE_HEADER.description}
        isTeamPage
      />

      <TeamMain />
    </div>
  );
}
