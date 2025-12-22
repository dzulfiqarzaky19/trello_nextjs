import { addColumn } from '@/app/actions';
import { FormWrapper } from '@/components/FormWrapper';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModalColumnForm } from '@/features/projects/components/ModalColumnForm';
import {
  Bell,
  Filter,
  List,
  PlusIcon,
  Search,
  SquareKanban,
  User,
} from 'lucide-react';
import { BottomHeader } from './components/BottomHeader';
import { TopHeader } from './components/TopHeader';

interface IHeaderProps {
  label: string;
  description: string;
  isProjectsPage?: boolean;
  isTeamPage?: boolean;
  isCalendarPage?: boolean;
}

export const Header = ({
  label,
  description,
  isProjectsPage,
  isTeamPage,
  isCalendarPage,
}: IHeaderProps) => {
  return (
    <header>
      <TopHeader label={label} description={description} />

      <BottomHeader
        isProjectsPage={isProjectsPage}
        isTeamPage={isTeamPage}
        isCalendarPage={isCalendarPage}
      />
    </header>
  );
};
