import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetTeamWorkload } from '../api/useGetTeamWorkload';
import { TeamWorkloadSkeleton } from './TeamWorkloadSkeleton';

export const TeamWorkload = () => {
  const { data, isLoading } = useGetTeamWorkload();

  if (isLoading || !data) {
    return <TeamWorkloadSkeleton />;
  }

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Team Workload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {data.map((member) => (
            <div key={member.name} className="flex items-center gap-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.image || undefined} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>

              <span className="w-16 text-sm font-medium text-muted-foreground">
                {member.name}
              </span>

              <div className="flex-1">
                <Progress
                  value={member.progress}
                  className="h-3"
                  progressClassName={member.color}
                />
              </div>

              <span className="w-8 text-sm font-bold text-right">
                {member.progress}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
