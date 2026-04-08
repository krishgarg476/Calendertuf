import { useState, useCallback } from 'react';
import { DateRange } from '@/types/calendar';

export function useRangeSelection() {
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });

  const selectDate = useCallback((date: Date) => {
    setSelectedRange(cur => {
      if (cur.start && cur.end) return { start: date, end: null };
      if (cur.start && !cur.end) {
        if (date.getTime() === cur.start.getTime()) return { start: null, end: null };
        return date < cur.start
          ? { start: date, end: cur.start }
          : { start: cur.start, end: date };
      }
      return { start: date, end: null };
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedRange({ start: null, end: null }), []);

  const isDateInRange = useCallback((date: Date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const t = date.getTime();
    return t >= selectedRange.start.getTime() && t <= selectedRange.end.getTime();
  }, [selectedRange]);

  const isDateRangeStart = useCallback((date: Date) => {
    return !!selectedRange.start && date.toDateString() === selectedRange.start.toDateString();
  }, [selectedRange.start]);

  const isDateRangeEnd = useCallback((date: Date) => {
    return !!selectedRange.end && date.toDateString() === selectedRange.end.toDateString();
  }, [selectedRange.end]);

  return { selectedRange, selectDate, clearSelection, isDateInRange, isDateRangeStart, isDateRangeEnd };
}