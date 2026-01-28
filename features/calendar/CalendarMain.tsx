'use client';

import { CalendarMonthly } from './components/CalendarMonthly';
import { CalendarWeekly } from './components/CalendarWeekly';
import { CalendarDaily } from './components/CalendarDaily';
import { useCalendarNavigation } from './hooks/useCalendarNavigation';

export const CalendarMain = () => {
  const { view } = useCalendarNavigation();

  return (
    <main className="p-6 h-full flex flex-col">
      {view === 'month' && <CalendarMonthly />}
      {view === 'week' && <CalendarWeekly />}
      {view === 'day' && <CalendarDaily />}
    </main>
  );
};
