import { BottomHeader } from './components/BottomHeader';
import { TopHeader } from './components/TopHeader';

interface IHeaderProps {
    label: string;
    description: string;
    isProjectsPage?: boolean;
    isTeamPage?: boolean;
    isCalendarPage?: boolean;
    boardId?: string;
}

export const Header = ({
    label,
    description,
    isProjectsPage,
    isTeamPage,
    isCalendarPage,
    boardId,
}: IHeaderProps) => {
    return (
        <header>
            <TopHeader label={label} description={description} />

            <BottomHeader
                isProjectsPage={isProjectsPage}
                isTeamPage={isTeamPage}
                isCalendarPage={isCalendarPage}
                boardId={boardId}
            />
        </header>
    );
};
