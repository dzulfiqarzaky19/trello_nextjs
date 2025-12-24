import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TEAM_WORKLOAD } from '@/lib/const/DashboardPage';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';

export const TeamWorkload = () => {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Team Workload</CardTitle>
        <MoreHorizontal className="text-muted-foreground cursor-pointer w-5 h-5" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div></div>
          <MoreHorizontal className="text-muted-foreground cursor-pointer" />
        </div>

        <div className="space-y-6">
          {TEAM_WORKLOAD.map((member: any) => (
            <div key={member.name} className="flex items-center gap-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.image} />
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
