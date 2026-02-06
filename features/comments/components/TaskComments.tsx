import { useState, useMemo } from 'react';
import { useGetComments } from '../api/useGetComments';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { Activity } from 'lucide-react';
import { useMe } from '@/features/auth/api/useMe';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Comment } from '../types';

interface TaskCommentsProps {
  taskId: string;
  className?: string;
}

export const TaskComments = ({ taskId, className }: TaskCommentsProps) => {
  const { data: comments, isLoading } = useGetComments(taskId);
  const { data: authData } = useMe();
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const { topLevelComments, repliesByParent } = useMemo(() => {
    if (!comments) return { topLevelComments: [], repliesByParent: {} };

    const top = comments.filter((c) => !c.parent_id);
    
    const replyMap: Record<string, Comment[]> = {};
    
    comments.forEach((comment) => {
      if (comment.parent_id) {
        if (!replyMap[comment.parent_id]) replyMap[comment.parent_id] = [];
        replyMap[comment.parent_id].push(comment);
      }
    });

    return { topLevelComments: top, repliesByParent: replyMap };
  }, [comments]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col flex-1 min-h-0 overflow-hidden gap-6',
        className
      )}
    >
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Activity className="size-5 text-muted-foreground" />
          <h3 className="font-semibold text-base">Activity</h3>
        </div>
      </div>

      <div className="flex gap-4 shrink-0">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={authData?.profile?.avatar_url || ''} />
          <AvatarFallback>
            {authData?.profile?.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CommentInput
            taskId={taskId}
            className="bg-background border shadow-sm rounded-md"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-2 flex-1 min-h-0 max-h-[500px] overflow-y-auto scroll-m-0 pr-2">
        {topLevelComments.length === 0 ? (
          <p className="text-sm text-muted-foreground ml-12">
            No activity yet.
          </p>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              taskId={taskId}
              replies={repliesByParent[comment.id]}
              onReply={setReplyingToId}
              replyingToId={replyingToId}
              onCancelReply={() => setReplyingToId(null)}
              depth={0}
              repliesByParent={repliesByParent}
            />
          ))
        )}
      </div>
    </div>
  );
};
