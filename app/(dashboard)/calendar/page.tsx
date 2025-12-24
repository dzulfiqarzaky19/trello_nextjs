import { Header } from '@/components/header/Header';
import { CalendarMain } from '@/features/calendar/CalendarMain';
import { CALENDAR_PAGE_HEADER } from '@/lib/const/calendarPage';

export default function CalendarPage() {
  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        label={CALENDAR_PAGE_HEADER.label}
        description={CALENDAR_PAGE_HEADER.description}
        isCalendarPage
      />

      <CalendarMain />
    </div>
  );
}
