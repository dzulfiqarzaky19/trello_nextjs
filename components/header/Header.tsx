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
