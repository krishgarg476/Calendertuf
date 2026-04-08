/**
 * Core type definitions for the calendar component
 * Keeping types simple and focused on domain logic
 */

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-based (0 = January)
  days: CalendarDay[];
}

export interface Note {
  id: string;
  date?: Date | null;
  content: string;
  createdAt: Date;
}

export interface CalendarState {
  currentMonth: CalendarMonth;
  selectedRange: DateRange;
  notes: Note[];
  heroImageUrl: string | null;
}
