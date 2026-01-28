'use client';

import { useCurrentDate } from '../hooks/useCurrentDate';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './CalendarEvent';

export const CalendarDaily = () => {
  const currentDate = useCurrentDate();
  const { getEventsForDay } = useCalendarEvents();
  const events = getEventsForDay(currentDate);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="border border-secondary-foreground/20 rounded-lg overflow-hidden bg-white shadow-sm flex-1 flex flex-col">
        <div className="py-4 text-center border-b border-secondary-foreground/20 bg-gray-50/50">
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-muted-foreground">
              {format(currentDate, 'EEEE')}
            </span>
            <span
              className={cn(
                'mt-1 w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold',
                isToday(currentDate)
                  ? 'bg-red-500 text-white'
                  : 'text-foreground'
              )}
            >
              {format(currentDate, 'd')}
            </span>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4 max-w-2xl mx-auto">
            {events.length > 0 ? (
              events.map((event) => <CalendarEvent key={event.id} {...event} />)
            ) : (
              <div className="text-center text-muted-foreground py-10">
                No tasks due on this day
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
