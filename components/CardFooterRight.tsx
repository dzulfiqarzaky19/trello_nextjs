import { formatDueDate } from '@/lib/formatDueDate';
import {
  CheckCheck,
  Flag,
  ListChecks,
  MessageSquare,
  Paperclip,
  Timer,
} from 'lucide-react';

interface ICardFooterRightProps {
  status: string;
  comments: number;
  attachments: number;
  progress?: {
    completed: number;
    total: number;
    percent: number;
  };
  dueDate?: string;
}
export const CardFooterRight = ({
  status,
  comments,
  attachments,
  progress,
  dueDate,
}: ICardFooterRightProps) => {
  const isOverdue = dueDate ? new Date(dueDate) <= new Date() : false;

  if (status === 'done') {
    if (comments > 0 || attachments > 0) {
      return (
        <div className="flex items-center gap-2">
          {attachments > 0 && (
            <div className="flex items-center gap-2">
              <Paperclip />
              <span>{attachments}</span>
            </div>
          )}

          {comments > 0 && (
            <div className="flex items-center gap-2">
              <MessageSquare />
              <span>{comments}</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <CheckCheck />
        <span>Done</span>
      </div>
    );
  }

  if (isOverdue && dueDate) {
    return (
      <div className="flex items-center gap-2">
        <Timer />
        <span>{formatDueDate(dueDate)}</span>
      </div>
    );
  }

  if (
    progress &&
    progress.percent !== 100 &&
    progress.percent !== 0 &&
    progress.completed > 0
  ) {
    return (
      <div className="flex items-center gap-2">
        <ListChecks />
        <span>
          {progress.completed} / {progress.total}
        </span>
      </div>
    );
  }

  if (comments > 0 || attachments > 0) {
    return (
      <div className="flex items-center gap-2">
        {attachments > 0 && (
          <div className="flex items-center gap-2">
            <Paperclip />
            <span>{attachments}</span>
          </div>
        )}

        {comments > 0 && (
          <div className="flex items-center gap-2">
            <MessageSquare />
            <span>{comments}</span>
          </div>
        )}
      </div>
    );
  }

  if (dueDate) {
    return (
      <div className="flex items-center gap-2">
        <Flag />
        <span>{formatDueDate(dueDate)}</span>
      </div>
    );
  }

  return null;
};
