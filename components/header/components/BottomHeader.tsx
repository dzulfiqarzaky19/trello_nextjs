import { createList } from '@/features/projects/lists/actions';
import { FormWrapper } from '@/components/form/FormWrapper';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { ModalColumnForm } from '@/features/projects/components/ModalColumnForm';
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Filter,
  List,
  Mail,
  PenTool,
  PlusIcon,
  SortAsc,
  SquareKanban,
  User,
  Users,
} from 'lucide-react';

export const BottomHeader = ({
  isProjectsPage,
  isTeamPage,
  isCalendarPage,
  boardId,
}: {
  isProjectsPage?: boolean;
  isTeamPage?: boolean;
  isCalendarPage?: boolean;
  boardId?: string;
}) => {
  if (isProjectsPage) {
    return (
      <div className="flex items-center justify-between px-6">
        <div className="flex">
          <Button variant="ghost" className="cursor-pointer">
            <SquareKanban /> Board
          </Button>
          <Button variant="ghost" className="cursor-pointer">
            <List /> List
          </Button>
          <Button variant="ghost" className="cursor-pointer">
            <User /> My Task
          </Button>
          <Button variant="ghost" className="cursor-pointer">
            <Filter /> Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Modal
            trigger={
              <Button variant="default" className="cursor-pointer">
                <PlusIcon /> New Column
              </Button>
            }
            modalClass="sm:max-w-xl"
          >
            {boardId && (
              <FormWrapper action={createList.bind(null, boardId)}>
                <ModalColumnForm />
              </FormWrapper>
            )}
          </Modal>
        </div>
      </div>
    );
  }

  if (isTeamPage) {
    return (
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="cursor-pointer font-bold bg-muted/50"
          >
            <Users className="w-4 h-4 mr-2" /> All Members
          </Button>
          <div className="h-4 w-px bg-border mx-2" />
          <Button
            variant="ghost"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <PenTool className="w-4 h-4 mr-2" /> Designers
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Code className="w-4 h-4 mr-2" /> Developers
          </Button>
          <div className="h-4 w-px bg-border mx-2" />
          <Button
            variant="ghost"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <SortAsc className="w-4 h-4 mr-2" /> Sort by Status
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer bg-white hover:bg-gray-50"
          >
            <Mail className="w-4 h-4 mr-2" /> Invite
          </Button>
          <Button
            variant="default"
            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white border-none shadow-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>
    );
  }

  if (isCalendarPage) {
    return (
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-bold text-lg">November 2023</span>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 bg-white text-foreground shadow-sm rounded-md"
            >
              Month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 hover:bg-white/50 text-muted-foreground"
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 hover:bg-white/50 text-muted-foreground"
            >
              Day
            </Button>
          </div>

          <Button
            variant="default"
            className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm gap-2"
          >
            <PlusIcon className="w-4 h-4" /> New Event
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
