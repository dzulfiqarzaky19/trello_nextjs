'use client';

import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useCalendarWeek } from '../hooks/useCalendarWeek';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { WEEKDAYS } from '@/lib/const/calendarPage';
import { CalendarEvent } from './CalendarEvent';

export const CalendarWeekly = () => {
  const { getEventsForDay } = useCalendarEvents();
  const { days } = useCalendarWeek();

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="border border-secondary-foreground/20 rounded-lg overflow-hidden bg-white shadow-sm flex-1 flex flex-col">
        <div className="grid grid-cols-7 border-b border-secondary-foreground/20">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0 border-secondary-foreground/20 bg-gray-50/50"
            >
              <div className="flex flex-col items-center">
                <span>{day}</span>
                <span
                  className={cn(
                    'mt-1 w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium',
                    isToday(days[index])
                      ? 'bg-red-500 text-white'
                      : 'text-foreground'
                  )}
                >
                  {format(days[index], 'd')}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1">
          {days.map((day) => {
            const events = getEventsForDay(day);
            return (
              <div
                key={day.toString()}
                className="border-r last:border-r-0 border-secondary-foreground/20 p-2 relative h-full min-h-[500px]"
              >
                <div className="space-y-2">
                  {events.map((event) => (
                    <CalendarEvent key={event.id} {...event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
