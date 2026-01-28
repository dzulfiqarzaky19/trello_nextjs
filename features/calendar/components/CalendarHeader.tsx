'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';

export const CalendarHeader = () => {
  const { currentDate, handlePrev, handleNext, view, setView } =
    useCalendarNavigation();

  return (
    <div className="flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-bold text-lg">{currentDate}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('month')}
            className={`h-7 px-3 shadow-none rounded-md ${
              view === 'month'
                ? 'bg-white text-foreground shadow-sm'
                : 'hover:bg-white/50 text-muted-foreground'
            }`}
          >
            Month
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('week')}
            className={`h-7 px-3 shadow-none rounded-md ${
              view === 'week'
                ? 'bg-white text-foreground shadow-sm'
                : 'hover:bg-white/50 text-muted-foreground'
            }`}
          >
            Week
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('day')}
            className={`h-7 px-3 shadow-none rounded-md ${
              view === 'day'
                ? 'bg-white text-foreground shadow-sm'
                : 'hover:bg-white/50 text-muted-foreground'
            }`}
          >
            Day
          </Button>
        </div>
      </div>
    </div>
  );
};
