import { TEAM_MEMBERS } from '@/lib/const/teamPage';
import { MemberCard } from './components/MemberCard';
import { InviteNewMember } from './components/InviteNewMember';

export const TeamMain = () => {
  return (
    <main className="p-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {TEAM_MEMBERS.map((member, index) => (
          <MemberCard key={index} {...member} />
        ))}

        <InviteNewMember />
      </div>
    </main>
  );
};
