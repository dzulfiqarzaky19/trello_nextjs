import { useRouter, useSearchParams } from 'next/navigation';
import { addMonths, format, subMonths } from 'date-fns';
import { useCurrentDate } from './useCurrentDate';

export const useCalendarNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = useCurrentDate();

  const view = searchParams.get('view') || 'month';

  const setView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.push(`?${params.toString()}`);
  };

  const handlePrevMonth = () => {
    const prev = subMonths(currentDate, 1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', format(prev, 'yyyy-MM'));
    router.push(`?${params.toString()}`);
  };

  const handleNextMonth = () => {
    const next = addMonths(currentDate, 1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', format(next, 'yyyy-MM'));
    router.push(`?${params.toString()}`);
  };

  return {
    currentDate: format(currentDate, 'MMMM yyyy'),
    handlePrevMonth,
    handleNextMonth,
    view,
    setView,
  };
};
