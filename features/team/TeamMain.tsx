import { TEAM_MEMBERS } from '@/lib/const/teamPage';
import { MemberCard } from './components/MemberCard';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export const TeamMain = () => {
  return (
    <main className="p-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {TEAM_MEMBERS.map((member, index) => (
          <MemberCard key={index} {...member} />
        ))}

        {/* Invite New Member Card */}
        <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 border-muted-foreground/20 shadow-none bg-transparent hover:bg-muted/50 transition-colors cursor-pointer group">
          <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Invite New Member</h3>
              <p className="text-sm text-muted-foreground">
                Send an invitation to a new team member to join this project.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
