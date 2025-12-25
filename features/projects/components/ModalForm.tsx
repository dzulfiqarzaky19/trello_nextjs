'use client';

import { useState } from 'react';
import { CardAvatar } from '@/components/CardAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Card as CardType } from '../types';
import {
  AlignLeft,
  Archive,
  CheckSquare,
  Clock,
  Copy,
  CreditCard,
  Eye,
  FileText,
  Laptop,
  Move,
  Paperclip,
  Tag,
  Trash2,
  User,
  Calendar,
  Flag,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModalFormProps {
  card?: CardType;
  listTitle: string;
  boardId?: string;
}

export const ModalForm = ({ card, listTitle, boardId }: ModalFormProps) => {
  const [selectedPriority, setSelectedPriority] = useState<string>(
    card?.priority || 'none'
  );

  // Calculate checklist progress
  const calculateProgress = () => {
    if (!card?.checklists || card.checklists.length === 0) return 0;

    const allItems = card.checklists.flatMap((cl) => cl.checklist_items);
    if (allItems.length === 0) return 0;

    const completed = allItems.filter((item) => item.completed).length;
    return Math.round((completed / allItems.length) * 100);
  };

  return (
    <div className="grid grid-cols-[1fr_auto] gap-6 h-full min-h-0">
      <div className="overflow-y-auto scroll-m-0 px-4 space-y-4">
        {/* Title Section */}
        <div className="grid grid-cols-[32px_auto] gap-2 sticky top-0 bg-background z-10">
          <Laptop className="size-5" />

          <div>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Input
                  name="title"
                  defaultValue={card?.title}
                  placeholder="Task Title"
                  required
                  className="font-semibold text-xl border-none shadow-none focus-visible:ring-0 px-0 h-auto p-0"
                />
              </DialogTitle>
            </DialogHeader>

            <div className="text-sm text-muted-foreground mt-1">
              in list{' '}
              <span className="underline cursor-pointer">{listTitle}</span>
            </div>
          </div>
        </div>

        {/* Metadata Section - Members, Labels, Due Date, Priority */}
        <div className="grid grid-cols-[32px_auto] gap-2">
          <div />

          <div className="flex items-start gap-6 flex-wrap">
            {/* Members */}
            <div className="shrink-0">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Members
              </div>
              <CardAvatar
                assignees={
                  card?.card_members?.map((cm) => ({
                    id: cm.user_id,
                    name: cm.profiles.full_name || 'Unknown',
                    image: cm.profiles.avatar_url || '',
                  })) || []
                }
                isEditable
              />
            </div>

            {/* Labels */}
            <div className="shrink-0">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Labels
              </div>
              <div className="flex flex-wrap gap-1">
                {card?.card_labels?.map((cl) => (
                  <Badge
                    key={cl.label_id}
                    style={{ backgroundColor: cl.labels.color }}
                    className="text-white"
                  >
                    {cl.labels.name}
                  </Badge>
                ))}
                {(!card?.card_labels || card.card_labels.length === 0) && (
                  <span className="text-sm text-muted-foreground">
                    No labels
                  </span>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="shrink-0">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Due Date
              </div>
              <Input
                type="datetime-local"
                name="dueDate"
                defaultValue={
                  card?.due_date
                    ? new Date(card.due_date).toISOString().slice(0, 16)
                    : ''
                }
                className="w-[200px]"
              />
            </div>

            {/* Priority */}
            <div className="shrink-0">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Priority
              </div>
              <Select
                name="priority"
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="grid grid-cols-[32px_auto] space-y-4">
          <AlignLeft className="size-5" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="font-semibold">Description</h3>
            </div>
            <Textarea
              name="description"
              defaultValue={card?.description ?? ''}
              placeholder="Add a more detailed description..."
              className="min-h-[100px] bg-transparent"
            />
          </div>

          {/* Checklists Section */}
          {card?.checklists && card.checklists.length > 0 && (
            <>
              <CheckSquare className="size-5" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold">Checklists</h3>
                </div>

                <div className="space-y-4">
                  {card.checklists.map((checklist) => {
                    const items = checklist.checklist_items || [];
                    const completed = items.filter(
                      (item) => item.completed
                    ).length;
                    const progress =
                      items.length > 0
                        ? Math.round((completed / items.length) * 100)
                        : 0;

                    return (
                      <div key={checklist.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{checklist.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {completed}/{items.length}
                          </span>
                        </div>

                        {items.length > 0 && (
                          <Progress value={progress} className="h-2" />
                        )}

                        <div className="space-y-2 ml-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`item-${item.id}`}
                                defaultChecked={item.completed}
                                disabled
                              />
                              <Label
                                htmlFor={`item-${item.id}`}
                                className={`cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {item.title}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Attachments Section */}
          {card?.attachments && card.attachments.length > 0 && (
            <>
              <Paperclip className="size-5" />

              <div className="space-y-3">
                <h3 className="font-semibold">Attachments</h3>
                <div className="space-y-2">
                  {card.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-2 border rounded-lg hover:bg-accent cursor-pointer"
                    >
                      <div className="bg-gray-100 rounded p-2 shrink-0">
                        <FileText className="size-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {attachment.file_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(attachment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Comments Section */}
          {card?.comments && card.comments.length > 0 && (
            <>
              <FileText className="size-5" />

              <div className="space-y-3">
                <h3 className="font-semibold">Activity</h3>

                <div className="space-y-4">
                  {card.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <CardAvatar
                        assignees={[
                          {
                            id: comment.user_id,
                            name: comment.profiles.full_name || 'Unknown',
                            image: comment.profiles.avatar_url || '',
                          },
                        ]}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {comment.profiles.full_name || 'Unknown'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-accent rounded-lg p-3 text-sm">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sidebar Actions */}
      <div className="w-[180px] space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">
          Add to card
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
          type="button"
        >
          <User className="size-4" />
          Members
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
          type="button"
        >
          <Tag className="size-4" />
          Labels
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
          type="button"
        >
          <CheckSquare className="size-4" />
          Checklist
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
          type="button"
        >
          <Paperclip className="size-4" />
          Attachment
        </Button>

        <div className="text-xs font-semibold text-muted-foreground uppercase mt-6 mb-3">
          Actions
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
          type="button"
        >
          <Move className="size-4" />
          Move
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
          type="button"
        >
          <Copy className="size-4" />
          Copy
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
          type="button"
        >
          <Archive className="size-4" />
          Archive
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          type="button"
        >
          <Trash2 className="size-4" />
          Delete
        </Button>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {card ? 'Save Changes' : 'Create Card'}
          </Button>
        </div>
      </div>
    </div>
  );
};
