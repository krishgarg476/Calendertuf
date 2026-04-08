/**
 * useCalendar — Monday-first calendar grid.
 * Pads with prev/next month days to fill 6×7 grid.
 */

import { useMemo } from 'react';
import { CalendarDay, CalendarMonth } from '@/types/calendar';

export function useCalendar(year: number, month: number): CalendarMonth {
  return useMemo(() => {
    const today = new Date();
    const todayStr = today.toDateString();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth  = new Date(year, month + 1, 0);
    const daysInMonth  = lastOfMonth.getDate();

    // Monday = 0 offset
    const rawDow   = firstOfMonth.getDay(); // 0=Sun
    const startOffset = rawDow === 0 ? 6 : rawDow - 1;

    // Prev-month trailing days
    const prevLastDay  = new Date(year, month, 0).getDate();
    const prev: CalendarDay[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevLastDay - i;
      prev.push(makeDay(new Date(year, month - 1, d), d, false, todayStr));
    }

    // Current month
    const curr: CalendarDay[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      curr.push(makeDay(new Date(year, month, d), d, true, todayStr));
    }

    // Next-month fill
    const total = prev.length + curr.length;
    const fill  = total % 7 === 0 ? 0 : 7 - (total % 7);
    // Always show 5 complete rows minimum
    const rows  = Math.ceil((prev.length + daysInMonth) / 7);
    const target = rows * 7;
    const nextCount = target - prev.length - daysInMonth;

    const next: CalendarDay[] = [];
    for (let d = 1; d <= nextCount; d++) {
      next.push(makeDay(new Date(year, month + 1, d), d, false, todayStr));
    }

    return { year, month, days: [...prev, ...curr, ...next] };
  }, [year, month]);
}

function makeDay(date: Date, dayOfMonth: number, isCurrentMonth: boolean, todayStr: string): CalendarDay {
  return {
    date,
    dayOfMonth,
    isCurrentMonth,
    isToday: date.toDateString() === todayStr,
    isSelected: false,
    isInRange: false,
    isRangeStart: false,
    isRangeEnd: false,
  };
}