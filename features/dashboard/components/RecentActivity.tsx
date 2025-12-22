import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RECENT_ACTIVITY } from '@/lib/const/DashboardPage';
import { FileIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const RecentActivity = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Recent Activity</h3>
        <Button variant="link" className="text-red-500 font-semibold">
          View All
        </Button>
      </div>

      <div className="space-y-6">
        {RECENT_ACTIVITY.map((activity: any, index: number) => (
          <div key={index} className="flex gap-4">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={activity.user.image} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              {/* Icon overlay based on type could go here */}
              {activity.type === 'status_update' && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
              {activity.type === 'comment' && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                  <MessageSquare className="w-2 h-2 text-white" />
                </div>
              )}
              {activity.type === 'upload' && (
                <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1 border-2 border-white">
                  <FileIcon className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <div className="text-sm">
                  <span className="font-bold">{activity.user.name}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    {activity.action}{' '}
                  </span>
                  <span className="font-bold">{activity.target}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>

              {activity.type === 'status_update' && activity.details && (
                <div className="text-xs text-muted-foreground">
                  Changed from{' '}
                  <span className="text-orange-500 font-medium">
                    {activity.details.from}
                  </span>{' '}
                  to{' '}
                  <span className="text-green-500 font-medium">
                    {activity.details.to}
                  </span>
                </div>
              )}

              {activity.type === 'comment' && activity.message && (
                <div className="text-sm text-muted-foreground italic">
                  {activity.message}
                </div>
              )}

              {activity.type === 'upload' && activity.files && (
                <div className="flex gap-2 mt-2">
                  {activity.files.map((file: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-muted px-2 py-1 rounded text-xs text-muted-foreground border"
                    >
                      <FileIcon className="w-3 h-3" />
                      {file}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
