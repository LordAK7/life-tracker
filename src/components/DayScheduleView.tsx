'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { TimeSlot } from '@/types/schedule';
import { format, parseISO, addMinutes, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load DatePicker
const DatePicker = lazy(() => import('react-datepicker'));
import 'react-datepicker/dist/react-datepicker.css';

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
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  
  // Set isClient to true when component mounts and format date on client
  useEffect(() => {
    setIsClient(true);
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

  // Group events by time period
  const morningEvents = sortedEvents.filter(event => {
    const hour = new Date(event.start).getHours();
    return hour >= 6 && hour < 12;
  });

  const afternoonEvents = sortedEvents.filter(event => {
    const hour = new Date(event.start).getHours();
    return hour >= 12 && hour < 17;
  });

  const eveningEvents = sortedEvents.filter(event => {
    const hour = new Date(event.start).getHours();
    return hour >= 17 && hour < 22;
  });

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

  const handleSaveEvent = () => {
    if (!editingEvent) return;
    
    if (editingEvent.id === 'new') {
      onAddEvent({
        title: editingEvent.title,
        start: editingEvent.start,
        end: editingEvent.end,
        type: 'personal',
        description: editingEvent.description,
        color: editingEvent.color,
        editable: true
      });
    } else {
      onUpdateEvent(editingEvent.id, {
        title: editingEvent.title,
        start: editingEvent.start,
        end: editingEvent.end,
        description: editingEvent.description,
        color: editingEvent.color
      });
    }
    
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleDeleteEvent = () => {
    if (editingEvent && editingEvent.id !== 'new') {
      onDeleteEvent(editingEvent.id);
      setEditingEvent(null);
      setIsAddingEvent(false);
    }
  };

  // Loading skeleton
  const EventSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-4 w-24 bg-[var(--gray-200)] rounded mb-2"></div>
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--gray-200)] rounded-lg"></div>
          ))}
        </div>
      </div>
      <div>
        <div className="h-4 w-24 bg-[var(--gray-200)] rounded mb-2"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--gray-200)] rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEventGroup = (title: string, groupEvents: TimeSlot[]) => {
    if (groupEvents.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--gray-500)] uppercase tracking-wider mb-2">{title}</h3>
        <div className="space-y-2">
          {groupEvents.map(event => (
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
                  setEditingEvent(event);
                  setIsAddingEvent(true);
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
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] h-full">
      <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
        <h3 className="font-medium text-[var(--text-primary)]">
          {isClient ? formattedDate : ''}
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
      
      <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        {!isClient ? (
          <EventSkeleton />
        ) : sortedEvents.length === 0 ? (
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
          <>
            {renderEventGroup('Morning', morningEvents)}
            {renderEventGroup('Afternoon', afternoonEvents)}
            {renderEventGroup('Evening', eveningEvents)}
          </>
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
                      {isClient && (
                        <Suspense fallback={<div className="h-10 bg-[var(--input-bg)] rounded-lg animate-pulse"></div>}>
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
                        </Suspense>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">End Time</label>
                      {isClient && (
                        <Suspense fallback={<div className="h-10 bg-[var(--input-bg)] rounded-lg animate-pulse"></div>}>
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
                        </Suspense>
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
                        onClick={handleDeleteEvent}
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
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-300)] rounded-lg transition-colors"
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ backgroundColor: 'var(--accent-hover)' }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleSaveEvent}
                      className="px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg transition-colors"
                    >
                      {editingEvent.id === 'new' ? 'Add' : 'Save'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--gray-400);
          border-radius: 3px;
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