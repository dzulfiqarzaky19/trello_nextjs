import { CALENDAR_DAYS, WEEKDAYS } from '@/lib/const/calendarPage';
import { CalendarCell } from './CalendarCell';

export const CalendarGrid = () => {
  return (
    <div className="border border-secondary-foreground/20 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b bg-gray-50/50 border-secondary-foreground/20">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0 border-secondary-foreground/20"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {CALENDAR_DAYS.map((day, index) => (
          <CalendarCell key={index} {...day} />
        ))}
      </div>
    </div>
  );
};
