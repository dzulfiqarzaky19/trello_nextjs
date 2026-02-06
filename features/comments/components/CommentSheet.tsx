import { useState, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useGetComments } from '../api/useGetComments';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface CommentSheetProps {
  taskId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommentSheet = ({
  taskId,
  trigger,
  open,
  onOpenChange,
}: CommentSheetProps) => {
  const { data: comments, isLoading } = useGetComments(taskId);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const { topLevelComments, repliesByParent } = useMemo(() => {
    if (!comments) return { topLevelComments: [], repliesByParent: {} };

    const top = comments.filter((c) => !c.parent_id);
    const replies = comments.filter((c) => c.parent_id);

    const replyMap: Record<string, typeof comments> = {};
    replies.forEach((r) => {
      // If parent_id refers to a reply (nested), we should technically flatten it to the top-level parent?
      // But the design says "Level 2: Replies".
      // If we strictly follow the database, a reply to a reply has parent_id = reply_id.
      // To flatten visually, we need to map them to the root parent.
      // However, our CommentItem recursion handles one level deep.
      // Simplest approach: Group by immediate parent_id.
      // If we want youtube style, reply to reply is just listed under the main comment.
      // We'll stick to immediate parent logic for now as it's cleaner for the recursive component
      // or flatten if we want. Design said "Backend returns flat list [...] Filter for parent_id === null for top-level, and group others by parent_id".
      // Let's assume replies point to the *Top Level* comment in parent_id if we wanted flat structure,
      // OR they point to the actual parent.
      // If they point to actual parent, we need to resolve the root parent to group them effectively under one thread.
      // For this MVP, let's assume standard nesting (reply points to comment it replied to).
      // CommentItem handles rendering children recursively.
      // But we said "2-level nesting".
      // Let's just pass `replies` that directly point to the comment.
      if (r.parent_id) {
        if (!replyMap[r.parent_id]) replyMap[r.parent_id] = [];
        replyMap[r.parent_id].push(r);
      }
    });

    return { topLevelComments: top, repliesByParent: replyMap };
  }, [comments]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>
            Comments {comments ? `(${comments.length})` : ''}
          </SheetTitle>
          <SheetDescription>Discuss this task with your team.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : topLevelComments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                No comments yet. Be the first to start the conversation!
              </div>
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
                />
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background mt-auto">
          <CommentInput taskId={taskId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
