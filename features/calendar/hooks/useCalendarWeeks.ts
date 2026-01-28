import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';
import { useCurrentDate } from './useCurrentDate';

export const useCalendarWeeks = () => {
  const currentDate = useCurrentDate();

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

  return {
    weeks,
    monthStart,
  };
};
