import { useRouter, useSearchParams } from 'next/navigation';
import {
  addMonths,
  addWeeks,
  addDays,
  format,
  subMonths,
  subWeeks,
  subDays,
} from 'date-fns';
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

  const handlePrev = () => {
    let prev = new Date(currentDate);
    if (view === 'month') prev = subMonths(currentDate, 1);
    else if (view === 'week') prev = subWeeks(currentDate, 1);
    else if (view === 'day') prev = subDays(currentDate, 1);

    const params = new URLSearchParams(searchParams.toString());
    params.set('date', format(prev, 'yyyy-MM-dd'));
    router.push(`?${params.toString()}`);
  };

  const handleNext = () => {
    let next = new Date(currentDate);
    if (view === 'month') next = addMonths(currentDate, 1);
    else if (view === 'week') next = addWeeks(currentDate, 1);
    else if (view === 'day') next = addDays(currentDate, 1);

    const params = new URLSearchParams(searchParams.toString());
    params.set('date', format(next, 'yyyy-MM-dd'));
    router.push(`?${params.toString()}`);
  };

  const goToDayView = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', 'day');
    params.set('date', format(date, 'yyyy-MM-dd'));
    router.push(`?${params.toString()}`);
  };

  return {
    currentDate: format(currentDate, 'MMMM yyyy'),
    handlePrev,
    handleNext,
    view,
    setView,
    goToDayView,
  };
};
