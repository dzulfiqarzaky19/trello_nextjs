'use client';

import { WEEKDAYS } from '@/lib/const/calendarPage';
import { CalendarCell } from './CalendarCell';
import { format, isSameMonth, isToday } from 'date-fns';

import { useCalendarWeeks } from '../hooks/useCalendarWeeks';
import { useCalendarEvents } from '../hooks/useCalendarEvents';

export const CalendarMonthly = () => {
  const { weeks, monthStart } = useCalendarWeeks();
  const { getEventsForDay } = useCalendarEvents();

  return (
    <div className="flex flex-col h-full space-y-4">
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
                  <CalendarCell
                    key={dayIndex}
                    day={parseInt(format(day, 'd'))}
                    isCurrentMonth={isSameMonth(day, monthStart)}
                    isToday={isToday(day)}
                    events={getEventsForDay(day)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
