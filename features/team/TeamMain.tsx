'use client';

import { MemberCard } from './components/MemberCard';
import { InviteNewMember } from './components/InviteNewMember';
import { Loader2 } from 'lucide-react';
import { useGetTeamStats } from './api/useGetTeamStats';
import { TeamMember } from './schema';

export const TeamMain = () => {
  const { data: members, isLoading } = useGetTeamStats();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="p-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {members?.map((member: TeamMember) => (
          <MemberCard
            key={member.userId}
            name={member.name}
            role={member.role}
            image={member.image}
            isOnline={false}
            tags={[]}
            stats={{
              activeTasks: member.activeTasks,
              projects: member.projectsCount,
            }}
          />
        ))}

        <InviteNewMember />
      </div>
    </main>
  );
};
