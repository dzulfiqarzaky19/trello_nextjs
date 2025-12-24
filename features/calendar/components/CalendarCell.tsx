import { CALENDAR_EVENTS } from '@/lib/const/calendarPage';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './CalendarEvent';

interface ICalendarCellProps {
  day: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
}

export const CalendarCell = ({
  day,
  isCurrentMonth,
  isToday,
}: ICalendarCellProps) => {
  const events = isCurrentMonth
    ? CALENDAR_EVENTS.filter((e) => e.date === day)
    : [];

  return (
    <td
      className={cn(
        'h-[120px] align-top p-2 border-b border-r border-secondary-foreground/20 bg-background transition-colors hover:bg-muted/30 last:border-r-0 w-[120px]',
        !isCurrentMonth && 'bg-muted/20 text-muted-foreground'
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={cn(
            'text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full',
            isToday && 'bg-red-500 text-white'
          )}
        >
          {day}
        </span>

        {isToday && (
          <span className="text-[10px] font-bold text-red-500 px-1">TODAY</span>
        )}
      </div>

      <div className="space-y-1">
        {events.map((event) => (
          <CalendarEvent key={event.id} {...event} />
        ))}
      </div>
    </td>
  );
};
