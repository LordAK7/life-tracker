'use client';

import { TimeSlot } from '@/types/schedule';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface TimeSlotViewProps {
  event: TimeSlot;
  onEditEvent: (event: TimeSlot) => void;
  formatTimeRange: (start: string, end: string) => string;
}

export default function TimeSlotView({ 
  event, 
  onEditEvent, 
  formatTimeRange 
}: TimeSlotViewProps) {
  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`p-3 rounded-lg ${
        event.type === 'college' 
          ? 'bg-[var(--gray-200)] border-l-4 border-indigo-500' 
          : 'bg-[var(--accent-light)] border-l-4 border-[var(--accent)]'
      } cursor-pointer hover:shadow-md transition-all`}
      onClick={() => {
        if (event.type === 'personal') {
          onEditEvent(event);
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h4 className="font-medium text-[var(--text-primary)] truncate">{event.title}</h4>
            {event.type === 'college' && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                College
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {formatTimeRange(event.start, event.end)}
          </p>
          {event.description && (
            <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
        {event.type === 'personal' && (
          <div className="text-[var(--gray-500)] hover:text-[var(--accent)] ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
} 