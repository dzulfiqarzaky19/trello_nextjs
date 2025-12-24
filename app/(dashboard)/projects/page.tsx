import { Header } from '@/components/header/Header';
import { ProjectsMain } from '@/features/projects/ProjectsMain';
import {
  PROJECTS_PAGE_CONTENT_DUMMY,
  PROJECTS_PAGE_HEADER,
} from '@/lib/const/projectPage';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        label={PROJECTS_PAGE_HEADER.label}
        description={PROJECTS_PAGE_HEADER.description}
        isProjectsPage
      />

      <ProjectsMain cardContent={PROJECTS_PAGE_CONTENT_DUMMY} />
    </div>
  );
}
