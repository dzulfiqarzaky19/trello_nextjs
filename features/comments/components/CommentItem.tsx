import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Reply, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '../types';
import { useDeleteComment } from '../api/useDeleteComment';
import { useMe } from '@/features/auth/api/useMe';
import { CommentInput } from './CommentInput';

interface CommentItemProps {
  comment: Comment;
  replies?: Comment[];
  taskId: string;
  onReply: (commentId: string) => void;
  replyingToId?: string | null;
  onCancelReply: () => void;
}

export const CommentItem = ({
  comment,
  replies = [],
  taskId,
  onReply,
  replyingToId,
  onCancelReply,
}: CommentItemProps) => {
  const { data } = useMe();
  const deleteMutation = useDeleteComment();
  const isAuthor = data?.user?.id === comment.user_id;

  const handleDelete = () => {
    deleteMutation.mutate({ commentId: comment.id, taskId });
  };

  return (
    <div className="group flex gap-3 py-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.profiles.avatar_url || ''} />
        <AvatarFallback>
          {comment.profiles.full_name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {comment.profiles.full_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Edit could be added here */}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-sm text-foreground/90 whitespace-pre-wrap">
          {comment.content}
        </p>

        <div className="flex items-center gap-4 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => onReply(comment.id)}
          >
            <Reply className="mr-1.5 h-3 w-3" />
            <span className="text-xs">Reply</span>
          </Button>
        </div>

        {replyingToId === comment.id && (
            <div className="mt-2 pl-4 border-l-2 border-border/50">
                 <CommentInput 
                    taskId={taskId} 
                    parentId={comment.id} 
                    autoFocus 
                    onCancel={onCancelReply}
                    onSuccess={onCancelReply}
                 />
            </div>
        )}

        {replies.length > 0 && (
          <div className="mt-2 space-y-3">
            {replies.map((reply) => (
              <div key={reply.id} className="relative pl-6">
                {/* Connector line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border/40" />
                <div className="absolute left-0 top-4 w-4 h-px bg-border/40" />
                
                <CommentItem
                  comment={reply}
                  taskId={taskId}
                  onReply={() => onReply(comment.id)} // Reply to reply -> reply to parent
                  replyingToId={replyingToId}
                  onCancelReply={onCancelReply}
                  // Nested replies not passed, as we flatten to 2 levels
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
