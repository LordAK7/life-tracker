'use client';

import { useState, useEffect } from 'react';
import { TimeSlot } from '@/types/schedule';
import { format, parseISO, addMinutes, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import TimeSlotView from './schedule/TimeSlotView';
import EventForm from './schedule/EventForm';

interface DayScheduleViewProps {
  date: Date;
  events: TimeSlot[];
  onAddEvent: (event: Omit<TimeSlot, 'id'>) => void;
  onUpdateEvent: (id: string, updates: Partial<TimeSlot>) => void;
  onDeleteEvent: (id: string) => void;
}

export default function DayScheduleView({
  date,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}: DayScheduleViewProps) {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimeSlot | null>(null);
  const [formattedDate, setFormattedDate] = useState('');
  
  // Format date on client side only
  useEffect(() => {
    setFormattedDate(format(date, 'EEEE, MMMM d'));
  }, [date]);
  
  // Filter events for the selected date
  const filteredEvents = events.filter(event => 
    isSameDay(parseISO(event.start), date)
  );
  
  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });

  // Create time slots for the entire day (6 AM to 10 PM)
  const timeSlots = [
    { label: '06:00 - 08:00', start: 6, end: 8 },
    { label: '08:00 - 10:00', start: 8, end: 10 },
    { label: '10:00 - 12:00', start: 10, end: 12 },
    { label: '12:00 - 14:00', start: 12, end: 14 },
    { label: '14:00 - 16:00', start: 14, end: 16 },
    { label: '16:00 - 18:00', start: 16, end: 18 },
    { label: '18:00 - 20:00', start: 18, end: 20 },
    { label: '20:00 - 22:00', start: 20, end: 22 },
  ];

  // Function to get events for a specific time slot
  const getEventsForTimeSlot = (startHour: number, endHour: number) => {
    return sortedEvents.filter(event => {
      const hour = new Date(event.start).getHours();
      return hour >= startHour && hour < endHour;
    });
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${format(parseISO(start), 'HH:mm')} - ${format(parseISO(end), 'HH:mm')}`;
  };

  const handleAddEvent = () => {
    // Default new event to start at the current hour and last 1 hour
    const now = new Date(date);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    const endTime = addMinutes(now, 60);
    
    setEditingEvent({
      id: 'new',
      title: '',
      start: now.toISOString(),
      end: endTime.toISOString(),
      type: 'personal',
      editable: true,
      color: '#7c3aed'
    });
    
    setIsAddingEvent(true);
  };

  const handleSaveEvent = (event: TimeSlot) => {
    if (event.id === 'new') {
      onAddEvent({
        title: event.title,
        start: event.start,
        end: event.end,
        type: 'personal',
        description: event.description,
        color: event.color,
        editable: true
      });
    } else {
      onUpdateEvent(event.id, {
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
        color: event.color
      });
    }
    
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (id !== 'new') {
      onDeleteEvent(id);
      setEditingEvent(null);
      setIsAddingEvent(false);
    }
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] h-full flex flex-col">
      <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
        <h3 className="font-medium text-[var(--text-primary)]">
          {formattedDate}
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddEvent}
          className="text-[var(--accent)] hover:text-[var(--accent-hover)] p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors"
          aria-label="Add event"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </motion.button>
      </div>
      
      <div className="p-4 overflow-y-auto h-[70vh] custom-scrollbar">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-[var(--gray-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mb-1">No events scheduled for this day</p>
            <button 
              onClick={handleAddEvent}
              className="text-[var(--accent)] hover:underline text-sm"
            >
              Add your first event
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {timeSlots.map((slot, index) => {
              const slotEvents = getEventsForTimeSlot(slot.start, slot.end);
              if (slotEvents.length === 0) return null;
              
              return (
                <div key={index} className="mb-6">
                  <h3 className="text-sm font-medium text-[var(--gray-500)] uppercase tracking-wider mb-2 sticky top-0 bg-[var(--card-bg)] py-1">
                    {slot.label}
                  </h3>
                  <div className="space-y-2">
                    {slotEvents.map(event => (
                      <TimeSlotView 
                        key={event.id}
                        event={event}
                        onEditEvent={(event) => {
                          setEditingEvent(event);
                          setIsAddingEvent(true);
                        }}
                        formatTimeRange={formatTimeRange}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {isAddingEvent && editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-bg)] rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <EventForm
                event={editingEvent}
                onSave={handleSaveEvent}
                onCancel={handleCancelEdit}
                onDelete={handleDeleteEvent}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--gray-200);
          border-radius: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--gray-400);
          border-radius: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--gray-500);
        }
        
        .react-datepicker {
          font-family: inherit;
          background-color: var(--card-bg);
          border-color: var(--border);
          color: var(--text-primary);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .react-datepicker__header {
          background-color: var(--gray-200);
          border-bottom-color: var(--border);
        }
        
        .react-datepicker__current-month,
        .react-datepicker-time__header,
        .react-datepicker__day-name {
          color: var(--text-primary);
        }
        
        .react-datepicker__time-container {
          border-left-color: var(--border);
        }
        
        .react-datepicker__time-container .react-datepicker__time {
          background-color: var(--card-bg);
        }
        
        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
          color: var(--text-primary);
          padding: 8px 10px;
        }
        
        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
          background-color: var(--gray-200);
        }
        
        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
          background-color: var(--accent);
          color: white;
        }
        
        .react-datepicker__day {
          color: var(--text-primary);
        }
        
        .react-datepicker__day:hover {
          background-color: var(--gray-200);
        }
        
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: var(--accent);
          color: white;
        }
        
        .react-datepicker__day--disabled {
          color: var(--gray-500);
        }
        
        .react-datepicker__triangle {
          border-bottom-color: var(--card-bg) !important;
        }
      `}</style>
    </div>
  );
} 