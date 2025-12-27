import { createCard, updateCard } from '@/features/projects/cards/actions';
import { CardDemo } from '@/components/Card';
import { FormWrapper } from '@/components/form/FormWrapper';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Ellipsis, Plus } from 'lucide-react';
import { ModalForm } from './components/ModalForm';
import { Board } from './types';

interface ProjectsMainProps {
  board: Board;
}

export const ProjectsMain = ({ board }: ProjectsMainProps) => {
  // Sort lists by order
  const sortedLists = [...board.lists].sort((a, b) => a.order - b.order);

  return (
    <main className="flex justify-between gap-4 p-8 overflow-x-auto">
      {sortedLists.map((list) => {
        // Sort cards by order
        const sortedCards = [...list.cards].sort((a, b) => a.order - b.order);

        return (
          <Card
            key={list.id}
            className="border-none shadow-none rounded-none bg-transparent min-w-[300px]"
          >
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn('size-2 rounded-full bg-gray-500')} />
                <CardTitle>{list.title}</CardTitle>
                <div className="size-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  {sortedCards.length}
                </div>
              </div>

              <Button variant="ghost">
                <Ellipsis />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {sortedCards.map((card) => (
                <Modal
                  key={card.id}
                  trigger={
                    <CardDemo
                      title={card.title}
                      description={card.description || ''}
                      labels={[]}
                      assignees={card.card_members.map((cm) => ({
                        id: cm.user_id,
                        name: cm.profiles.full_name || 'Unknown',
                        image: cm.profiles.avatar_url || '',
                      }))}
                      comments={0}
                      attachments={0}
                      status="todo"
                      progress={{ completed: 0, total: 0, percent: 0 }}
                      dueDate={card.due_date || undefined}
                    />
                  }
                  modalClass="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                  <FormWrapper
                    action={updateCard.bind(null, card.id)}
                    className="flex flex-col h-full min-h-0"
                  >
                    <ModalForm
                      card={card}
                      listTitle={list.title}
                      boardId={board.id}
                    />
                  </FormWrapper>
                </Modal>
              ))}
            </CardContent>

            <CardFooter>
              <Modal
                trigger={
                  <Button variant="ghost" className="w-full cursor-pointer">
                    <Plus />
                    Add Task
                  </Button>
                }
                modalClass="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                <FormWrapper
                  action={createCard.bind(null, list.id)}
                  className="flex flex-col h-full min-h-0"
                >
                  <ModalForm listTitle={list.title} boardId={board.id} />
                </FormWrapper>
              </Modal>
            </CardFooter>
          </Card>
        );
      })}
    </main>
  );
};
