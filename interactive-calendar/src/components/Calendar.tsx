'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';
import { useRangeSelection } from '@/hooks/useRangeSelection';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DateGrid } from './DateGrid';
import { NotesSection, type NoteItem } from './NotesSection';

const MONTH_META: Array<{
  name: string;
  accent: string;
  rgb: string;
  accentLight: string;
  imageUrl: string;
}> = [
  { name:'January',  accent:'#1E40AF', rgb:'30,64,175', accentLight:'#DBEAFE', imageUrl:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop&q=80' },
  { name:'February', accent:'#DC2626', rgb:'220,38,38', accentLight:'#FEE2E2', imageUrl:'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&h=600&fit=crop&q=80' },
  { name:'March',    accent:'#059669', rgb:'5,150,105', accentLight:'#D1FAE5', imageUrl:'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=600&fit=crop&q=80' },
  { name:'April',    accent:'#F97316', rgb:'249,115,22', accentLight:'#FFEDD5', imageUrl:'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&h=600&fit=crop&q=80' },
  { name:'May',      accent:'#16A34A', rgb:'22,163,74', accentLight:'#DCFCE7', imageUrl:'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=600&fit=crop&q=80' },
  { name:'June',     accent:'#0891B2', rgb:'8,145,178', accentLight:'#CFFAFE', imageUrl:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&q=80' },
  { name:'July',     accent:'#DC2626', rgb:'220,38,38', accentLight:'#FEE2E2', imageUrl:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop&q=80' },
  { name:'August',   accent:'#7C3AED', rgb:'124,58,237', accentLight:'#F3E8FF', imageUrl:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&q=80' },
  { name:'September',accent:'#D97706', rgb:'217,119,6', accentLight:'#FEF3C7', imageUrl:'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&h=600&fit=crop&q=80' },
  { name:'October',  accent:'#EA580C', rgb:'234,88,12', accentLight:'#FFEDD5', imageUrl:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&q=80' },
  { name:'November', accent:'#6B7280', rgb:'107,114,128', accentLight:'#F3F4F6', imageUrl:'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=600&fit=crop&q=80' },
  { name:'December', accent:'#0F766E', rgb:'15,118,110', accentLight:'#CCFBF1', imageUrl:'https://images.unsplash.com/photo-1576694715876-a32f50b7b0af?w=1200&h=600&fit=crop&q=80' },
];

const HOLIDAYS: Record<string,string> = {
  '01-01':'New Year','01-14':'Makar Sankranti','01-26':'Republic Day',
  '03-03':'Holi','04-03':'Good Friday','04-14':'Ambedkar Jayanti',
  '08-15':'Independence Day','10-02':'Gandhi Jayanti',
  '11-07':'Diwali','12-25':'Christmas',
};

export function Calendar() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [dir, setDir] = useState<1|-1>(1);
  const [animKey, setAnimKey] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);

  const meta = MONTH_META[month];

  useEffect(() => {
    document.documentElement.style.setProperty('--acc', meta.accent);
    document.documentElement.style.setProperty('--acc-rgb', meta.rgb);
    document.documentElement.style.setProperty('--acc-light', meta.accentLight);
  }, [meta]);

  const calendarMonth = useCalendar(year, month);
  const { selectedRange, selectDate, isDateInRange, isDateRangeStart, isDateRangeEnd, clearSelection } = useRangeSelection();
  const [notes, setNotes, notesLoaded] = useLocalStorage<NoteItem[]>('calendar-notes-v2', []);

  const navigate = useCallback((delta: 1 | -1) => {
    setDir(delta);
    setAnimKey(k => k + 1);
    clearSelection();
    
    // Calculate new month and year outside of state updater
    let newMonth = month + delta;
    let newYear = year;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }
    
    setMonth(newMonth);
    setYear(newYear);
  }, [clearSelection, month, year]);

  const goToToday = () => {
    const d = delta(today.getMonth(), month, today.getFullYear(), year);
    setDir(d >= 0 ? 1 : -1);
    setAnimKey(k => k + 1);
    clearSelection();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  const rangeLabel = (() => {
    const { start, end } = selectedRange;
    if (!start) return null;
    const fmt = (d: Date) => d.toLocaleDateString('en-IN', {day:'2-digit', month:'short'});
    return end ? `${fmt(start)} - ${fmt(end)}` : `${fmt(start)} (start date)`;
  })();

  if (!notesLoaded) return null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 shadow-sm border-b" style={{ borderColor: 'var(--border-soft)', backgroundColor: 'var(--paper)' }}>
        <div className="max-w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <CalendarIcon className="w-5 sm:w-6 h-5 sm:h-6 shrink-0" style={{ color: meta.accent }} />
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {meta.name} <span className="ml-1 sm:ml-2 font-medium" style={{ color: 'var(--text-secondary)' }}>{year}</span>
              </h1>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button onClick={() => navigate(-1)} aria-label="Previous month" className="p-2 rounded-lg transition-colors hidden sm:flex hover:opacity-70">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button onClick={goToToday} className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all hover:opacity-90" style={{borderColor: meta.accent, color: meta.accent, backgroundColor: meta.accentLight}}>
                Today
              </button>

              <button onClick={() => navigate(1)} aria-label="Next month" className="p-2 rounded-lg transition-colors hidden sm:flex hover:opacity-70">
                <ChevronRight className="w-5 h-5" />
              </button>

              <button onClick={() => setNotesOpen(!notesOpen)} aria-label="Toggle notes" className="lg:hidden p-2 rounded-lg transition-colors hover:opacity-70">
                {notesOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2 sm:hidden">
            <button onClick={() => navigate(-1)} aria-label="Previous month" className="flex-1 p-2 rounded-lg transition-colors hover:opacity-70">
              <ChevronLeft className="w-5 h-5 mx-auto" />
            </button>
            <div className="flex-1"></div>
            <button onClick={() => navigate(1)} aria-label="Next month" className="flex-1 p-2 rounded-lg transition-colors hover:opacity-70">
              <ChevronRight className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6">
          <motion.div className="lg:col-span-8 rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--paper)', borderColor: 'var(--border-soft)' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={`hero-${year}-${month}`} className="calendar-paper relative w-full" style={{ height: 'clamp(150px, 30vh, 250px)' }} initial={{ x: dir > 0 ? '100%' : '-100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: dir > 0 ? '-100%' : '100%', opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}>
                <img src={meta.imageUrl} alt={`${meta.name} ${year}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="hero-overlay absolute inset-0" style={{ background: `linear-gradient(135deg, ${meta.accent}00 0%, ${meta.accent}20 50%, ${meta.accent}40 100%)` }} />
              </motion.div>
            </AnimatePresence>

            <div className="p-3 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
              <AnimatePresence>
                {rangeLabel && (
                  <motion.div className="p-3 rounded-lg flex items-center justify-between" style={{ background: meta.accentLight }} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <span className="text-xs sm:text-sm font-medium" style={{ color: meta.accent }}>📅 {rangeLabel}</span>
                    <button onClick={clearSelection} className="p-1 rounded transition-colors hover:opacity-70">
                      <X className="w-4 h-4" style={{ color: meta.accent }} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div key={animKey} initial={{ opacity: 0, x: dir > 0 ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir > 0 ? -20 : 20 }} transition={{ duration: 0.2 }}>
                  <DateGrid days={calendarMonth.days} month={month} year={year} holidays={HOLIDAYS} onDateSelect={selectDate} isDateInRange={isDateInRange} isDateRangeStart={isDateRangeStart} isDateRangeEnd={isDateRangeEnd} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <AnimatePresence>
            {notesOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? (
              <motion.div className={`lg:col-span-4 rounded-2xl shadow-lg overflow-hidden ${notesOpen && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'fixed inset-0 top-20 z-30 m-3 rounded-3xl' : ''}`} style={{ backgroundColor: 'var(--paper)', borderColor: 'var(--border-soft)' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
                <div className="h-24 sm:h-28 bg-gradient-to-r relative" style={{backgroundImage: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}dd)`,}}>
                  <button onClick={() => setNotesOpen(false)} className="absolute top-3 right-3 p-2 rounded-lg lg:hidden hover:opacity-70">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 -mt-10 sm:-mt-12 relative z-10">
                  <h2 className="text-lg sm:text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Notes & Events</h2>
                  <NotesSection notes={notes} accent={meta.accent} accentRgb={meta.rgb} selectedRange={selectedRange} onAddNote={(n) => setNotes(prev => [...prev, n])} onDeleteNote={(id) => setNotes(prev => prev.filter(n => n.id !== id))} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function delta(m1:number, m2:number, y1:number, y2:number) {
  return (y1 - y2) * 12 + (m1 - m2);
}
