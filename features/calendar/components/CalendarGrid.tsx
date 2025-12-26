import { CALENDAR_DAYS, WEEKDAYS } from '@/lib/const/calendarPage';
import { CalendarCell } from './CalendarCell';

export const CalendarGrid = () => {
  const weeks = [];
  for (let i = 0; i < CALENDAR_DAYS.length; i += 7) {
    weeks.push(CALENDAR_DAYS.slice(i, i + 7));
  }

  return (
    <div className="border border-secondary-foreground/20 rounded-lg overflow-hidden bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th
                key={day}
                className="py-3 text-center text-sm font-semibold text-muted-foreground border-b border-r last:border-r-0 border-secondary-foreground/20 bg-gray-50/50 w-[120px]"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <CalendarCell key={dayIndex} {...day} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
