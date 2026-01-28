import { useRouter } from 'next/navigation';
import { addMonths, format, subMonths } from 'date-fns';
import { useCurrentDate } from './useCurrentDate';

export const useCalendarNavigation = () => {
  const router = useRouter();
  const currentDate = useCurrentDate();

  const handlePrevMonth = () => {
    const prev = subMonths(currentDate, 1);
    router.push(`?month=${format(prev, 'yyyy-MM')}`);
  };

  const handleNextMonth = () => {
    const next = addMonths(currentDate, 1);
    router.push(`?month=${format(next, 'yyyy-MM')}`);
  };

  return {
    currentDate: format(currentDate, 'MMMM yyyy'),
    handlePrevMonth,
    handleNextMonth,
  };
};
