'use client';

import { useState, useEffect } from 'react';
import { TimeSlot } from '@/types/schedule';
import { parseISO, addMinutes } from 'date-fns';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import DatePicker with SSR disabled
const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });
import 'react-datepicker/dist/react-datepicker.css';

interface EventFormProps {
  event: TimeSlot;
  onSave: (event: TimeSlot) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

export default function EventForm({
  event,
  onSave,
  onCancel,
  onDelete
}: EventFormProps) {
  const [editingEvent, setEditingEvent] = useState<TimeSlot>(event);

  return (
    <div className="p-6">
      <h2 className="text-xl font-medium mb-4">
        {editingEvent.id === 'new' ? 'Add Event' : 'Edit Event'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Title</label>
          <input
            type="text"
            value={editingEvent.title}
            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--input-border)] focus:border-[var(--accent)]"
            placeholder="Event title"
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Start Time</label>
            {DatePicker && (
              <DatePicker
                selected={parseISO(editingEvent.start)}
                onChange={(date) => {
                  if (date) {
                    setEditingEvent({
                      ...editingEvent,
                      start: date.toISOString(),
                      end: addMinutes(date, 60).toISOString()
                    });
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--input-border)] focus:border-[var(--accent)]"
              />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">End Time</label>
            {DatePicker && (
              <DatePicker
                selected={parseISO(editingEvent.end)}
                onChange={(date) => {
                  if (date) {
                    setEditingEvent({
                      ...editingEvent,
                      end: date.toISOString()
                    });
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--input-border)] focus:border-[var(--accent)]"
              />
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Description (Optional)</label>
          <textarea
            value={editingEvent.description || ''}
            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--input-border)] focus:border-[var(--accent)] min-h-[80px] resize-none"
            placeholder="Add a description..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Color</label>
          <div className="flex space-x-2">
            {['#7c3aed', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'].map(color => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setEditingEvent({ ...editingEvent, color })}
                className={`w-8 h-8 rounded-full ${
                  editingEvent.color === color ? 'ring-2 ring-offset-2 ring-[var(--accent)]' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <div>
          {editingEvent.id !== 'new' && (
            <motion.button
              whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onDelete(editingEvent.id)}
              className="text-[var(--danger)] hover:text-[var(--danger)] px-3 py-1 rounded-lg transition-colors"
            >
              Delete
            </motion.button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ backgroundColor: 'var(--gray-300)' }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-300)] rounded-lg transition-colors"
          >
            Cancel
          </motion.button>
          
          <motion.button
            whileHover={{ backgroundColor: 'var(--accent-hover)' }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onSave(editingEvent)}
            className="px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg transition-colors"
          >
            {editingEvent.id === 'new' ? 'Add' : 'Save'}
          </motion.button>
        </div>
      </div>
    </div>
  );
} 