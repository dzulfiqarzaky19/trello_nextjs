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
  // Filter events for this specific day IN THE CURRENT MONTH
  // In a real app, we'd check month/year too. For this dummy data, we assume current month events only.
  const events = isCurrentMonth
    ? CALENDAR_EVENTS.filter((e) => e.date === day)
    : [];

  return (
    <div
      className={cn(
        'min-h-[120px] p-2 border-b border-r border-secondary-foreground/20 bg-background transition-colors hover:bg-muted/30',
        !isCurrentMonth && 'bg-muted/20 text-muted-foreground'
        // Remove border for last row/col handled by grid logic preferably, but border-collapse usually handles this
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
    </div>
  );
};
