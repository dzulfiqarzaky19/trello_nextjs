import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from './Overview';
import { MembersList } from '@/features/members/components/MembersList';
import { ProjectsGrid } from '@/features/projects/components/ProjectsGrid';
import { WorkspaceDetailHeader } from './WorkspaceDetailHeader';

export const WorkspaceDetailMain = () => (
  <div className="flex flex-col gap-y-6 p-8">
    <WorkspaceDetailHeader />

    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="members">Members & Roles</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Overview />
      </TabsContent>

      <TabsContent value="members">
        <MembersList />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectsGrid />
      </TabsContent>
    </Tabs>
  </div>
);
