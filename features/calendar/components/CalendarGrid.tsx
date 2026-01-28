'use client';

import { WEEKDAYS } from '@/lib/const/calendarPage';
import { CalendarCell } from './CalendarCell';
import { useGetMyTasks } from '@/features/tasks/api/useGetMyTasks';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isValid,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export const CalendarGrid = () => {
  const currentDate = new Date();

  /* 
    User Requirement: "we dont care about projectId and workspaceId, we just want to get all task based on current user"
  */
  const { data: tasks } = useGetMyTasks();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weeks: Date[][] = [];
  let days: Date[] = [];

  calendarDays.forEach((day) => {
    days.push(day);
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  });

  const getEventsForDay = (day: Date) => {
    if (!tasks?.data) return [];
    return tasks.data
      .filter((task) => {
        if (!task.deadlines) return false;
        const taskDate = new Date(task.deadlines);
        return isValid(taskDate) && isSameDay(taskDate, day);
      })
      .map((task) => ({
        id: task.id,
        title: task.title,
        time: format(new Date(task.deadlines), 'h:mm a'),
        color: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
      }));
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-gray-700">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>
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
