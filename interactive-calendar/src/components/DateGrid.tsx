'use client';

/**
 * DateGrid — calendar grid with hover-preview range, proper pill shapes,
 * holiday dots, and compact Monday-first layout.
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDay } from '@/types/calendar';

interface DateGridProps {
  days: CalendarDay[];
  month: number;
  year: number;
  holidays: Record<string, string>;
  onDateSelect: (date: Date) => void;
  isDateInRange: (date: Date) => boolean;
  isDateRangeStart: (date: Date) => boolean;
  isDateRangeEnd: (date: Date) => boolean;
}

const WEEKDAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

function hk(m: number, d: number) {
  return `${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function isWeekend(date: Date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}

export function DateGrid({
  days, month, year, holidays,
  onDateSelect, isDateInRange, isDateRangeStart, isDateRangeEnd,
}: DateGridProps) {
  const [hoverDay, setHoverDay] = useState<Date | null>(null);

  const buildClass = useCallback((day: CalendarDay) => {
    const classes: string[] = ['day-cell'];

    if (!day.isCurrentMonth) { classes.push('other-month'); return classes.join(' '); }

    const isStart  = isDateRangeStart(day.date);
    const isEnd    = isDateRangeEnd(day.date);
    const inRange  = isDateInRange(day.date);
    const today    = day.isToday;
    const weekend  = isWeekend(day.date);
    const holiday  = !!holidays[hk(month, day.dayOfMonth)];

    if (isStart) classes.push('range-start');
    if (isEnd)   classes.push('range-end');
    if (inRange && !isStart && !isEnd) classes.push('in-range');
    if (today && !isStart && !isEnd)   classes.push('is-today');
    if (weekend && !isStart && !isEnd) classes.push('is-weekend');
    if (holiday) classes.push('is-holiday');

    return classes.join(' ');
  }, [isDateInRange, isDateRangeStart, isDateRangeEnd, holidays, month]);

  return (
    <div>
      {/* Weekday headers */}
      <div className="weekday-header">
        {WEEKDAYS.map((d) => (
          <span key={d}>
            {d}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {days.map((day, i) => {
          if (!day.isCurrentMonth) {
            return (
              <div key={i} className="day-cell other-month">
                {day.dayOfMonth}
              </div>
            );
          }

          const holiday = holidays[hk(month, day.dayOfMonth)];

          return (
            <motion.div
              key={i}
              className={`${buildClass(day)} group relative`}
              onClick={() => onDateSelect(day.date)}
              onMouseEnter={() => setHoverDay(day.date)}
              onMouseLeave={() => setHoverDay(null)}
              whileTap={{ scale: 0.92 }}
              title={holiday}
            >
              {day.dayOfMonth}
              {/* Holiday tooltip */}
              {holiday && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                             text-xs rounded px-2 py-1 whitespace-nowrap
                             opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{ backgroundColor: 'var(--binding-bg)', color: 'var(--text-primary)' }}
                >
                  {holiday}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}