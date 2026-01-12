'use client';

import { useWorkspaceDetail } from '../api/useWorkspaceDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from './Overview';
import { MembersList } from './MembersList';
import { ProjectsGrid } from './ProjectsGrid';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export const WorkspaceDetailMain = () => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { data, isLoading, error } = useWorkspaceDetail(workspaceId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-y-2">
        <h2 className="text-lg font-semibold text-destructive">
          Error loading workspace
        </h2>
        <p className="text-muted-foreground">
          {error?.message || 'Workspace not found'}
        </p>
      </div>
    );
  }

  const workspace = data.data;

  return (
    <div className="flex flex-col gap-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">{workspace.name}</h1>
        <p className="text-muted-foreground">
          Manage workspace projects, settings, and team members.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members & Roles</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview workspace={workspace} />
        </TabsContent>

        <TabsContent value="members">
          <MembersList workspace={workspace} workspaceSlug={workspaceId} />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsGrid workspace={workspace} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
