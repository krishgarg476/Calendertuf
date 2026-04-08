'use client';

/**
 * NotesSection — lined paper aesthetic.
 * Notes animate in/out. Range label attached to each note.
 * Compact inline input at bottom (not a big button).
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export interface NoteItem {
  id: string;
  content: string;
  rangeLabel?: string;
  createdAt: string;
}

interface NotesSectionProps {
  notes: NoteItem[];
  accent: string;
  accentRgb: string;
  selectedRange: { start: Date | null; end: Date | null };
  onAddNote: (n: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

function fmtRange(start: Date | null, end: Date | null) {
  if (!start) return undefined;
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

export function NotesSection({
  notes, accent, accentRgb, selectedRange, onAddNote, onDeleteNote,
}: NotesSectionProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addNote = () => {
    const text = input.trim();
    if (!text) return;
    onAddNote({
      id: crypto.randomUUID(),
      content: text,
      rangeLabel: fmtRange(selectedRange.start, selectedRange.end),
      createdAt: new Date().toISOString(),
    });
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Notes list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence initial={false}>
          {notes.length > 0 ? (
            notes.map((note) => (
              <motion.div
                key={note.id}
                className="note-line group"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    {note.rangeLabel && (
                      <div className="mb-1">
                        <span
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `${accent}20`,
                            color: accent,
                          }}
                        >
                          📅 {note.rangeLabel}
                        </span>
                      </div>
                    )}
                    <p className="text-sm" style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                      {note.content}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    aria-label="Delete note"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Trash2 className="w-4 h-4 hover:text-red-500 transition-colors" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8" style={{ color: 'var(--text-ghost)' }}>
              <p className="text-sm">No notes yet. Add one below!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add note input */}
      <div
        className="flex items-center gap-2 p-3 rounded-lg border transition-colors"
        style={{ 
          borderColor: 'var(--border-soft)',
          backgroundColor: 'var(--paper-ruled)'
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNote()}
          placeholder={selectedRange.start ? 'Note for this range...' : 'Add a note...'}
          className="flex-1 bg-transparent border-0 outline-none text-sm"
          style={{ 
            color: 'var(--text-primary)',
            '--placeholder-color': 'var(--text-ghost)'
          } as React.CSSProperties}
        />
        <motion.button
          onClick={addNote}
          disabled={!input.trim()}
          aria-label="Add note"
          whileTap={{ scale: 0.92 }}
          className="shrink-0 p-2 rounded-lg transition-all disabled:opacity-40"
          style={{ background: accent }}
        >
          <Plus className="w-4 h-4 text-white" />
        </motion.button>
      </div>
    </div>
  );
}