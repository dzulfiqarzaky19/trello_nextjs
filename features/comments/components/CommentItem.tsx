import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Reply, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
  rootCommentId?: string; // ID of the top-level comment for nested replies
  depth?: number; // Nesting level: 0=top-level, 1=reply, 2=reply-to-reply
  repliesByParent?: Record<string, Comment[]>; // Map of all replies for recursive rendering
}

export const CommentItem = ({
  comment,
  replies = [],
  taskId,
  onReply,
  replyingToId,
  onCancelReply,
  rootCommentId,
  depth = 0,
  repliesByParent = {},
}: CommentItemProps) => {
  const { data } = useMe();
  const deleteMutation = useDeleteComment();
  const isAuthor = data?.user?.id === comment.user_id;
  const [showReplies, setShowReplies] = useState(false);

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
          {replyingToId !== comment.id && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => {
                onReply(comment.id);
                setShowReplies(true);
              }}
            >
              <Reply className="mr-1.5 h-3 w-3" />
              <span className="text-xs">Reply</span>
            </Button>
          )}
        </div>

        {replyingToId === comment.id && (
          <div className="mt-2 pl-4 border-l-2 border-border/50">
            <CommentInput
              taskId={taskId}
              parentId={depth === 2 ? rootCommentId || comment.id : comment.id}
              autoFocus
              onCancel={onCancelReply}
              onSuccess={onCancelReply}
            />
          </div>
        )}

        {replies.length > 0 && (
        <div className="mt-2 text-sm">
          {!showReplies ? (
            <button
              onClick={() => setShowReplies(true)}
              className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-2"
            >
              <div className="w-8 h-px bg-border" />
              View {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          ) : (
             <div className="space-y-3">
               {replies.map((reply) => (
                 <div key={reply.id} className="relative pl-6">
                   {/* Connector line */}
                   <div className="absolute left-0 top-0 bottom-0 w-px bg-border/40" />
                   <div className="absolute left-0 top-4 w-4 h-px bg-border/40" />
   
                   <CommentItem
                     comment={reply}
                     taskId={taskId}
                      replies={repliesByParent[reply.id]}
                       onReply={onReply}
                     replyingToId={replyingToId}
                      rootCommentId={comment.id}
                      depth={depth + 1}
                       // Supports up to 3 levels: depth 0 (top) -> 1 (reply) -> 2 (reply-to-reply)
                      repliesByParent={repliesByParent}
                     onCancelReply={onCancelReply}
                    />
                 </div>
               ))}
               <button
                  onClick={() => setShowReplies(false)}
                  className="text-muted-foreground hover:text-foreground font-medium text-xs ml-6 mt-2"
                >
                  Hide replies
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
};
