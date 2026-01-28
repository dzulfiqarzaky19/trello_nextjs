import { Button } from '@/components/ui/button';
import { CalendarHeader } from '@/features/calendar/components/CalendarHeader';
import {
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
}: {
  isProjectsPage?: boolean;
  isTeamPage?: boolean;
  isCalendarPage?: boolean;
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
    return <CalendarHeader />;
  }

  return null;
};
