import { useState } from 'react';
import { useCreateComment } from '../api/useCreateComment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming global utils

interface CommentInputProps {
  taskId: string;
  parentId?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
  className?: string;
}

export const CommentInput = ({
  taskId,
  parentId,
  autoFocus,
  onCancel,
  onSuccess,
  className,
}: CommentInputProps) => {
  const [content, setContent] = useState('');
  const createMutation = useCreateComment();

  const handleSubmit = () => {
    if (!content.trim()) return;

    createMutation.mutate(
      { content, taskId, parentId: parentId || null },
      {
        onSuccess: () => {
          setContent('');
          onSuccess?.();
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn('relative flex gap-2 items-end', className)}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={parentId ? 'Write a reply...' : 'Add a comment...'}
        className="min-h-[40px] max-h-[120px] resize-none py-3 pr-12 text-sm bg-muted/30 focus:bg-background transition-colors"
        autoFocus={autoFocus}
        disabled={createMutation.isPending}
      />
      <div className="absolute right-2 bottom-2 flex gap-1">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          size="icon"
          className="h-8 w-8"
          disabled={!content.trim() || createMutation.isPending}
          onClick={handleSubmit}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
