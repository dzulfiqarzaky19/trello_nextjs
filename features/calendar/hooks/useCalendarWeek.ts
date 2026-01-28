import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useCurrentDate } from './useCurrentDate';

export const useCalendarWeek = () => {
  const currentDate = useCurrentDate();

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return { days };
};
