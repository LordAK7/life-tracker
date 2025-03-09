'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import NavigationBar from "@/components/NavigationBar";
import { TimeSlot } from '@/types/schedule';
import { scheduleService } from '@/services/scheduleService';
import { motion } from 'framer-motion';

// Dynamically import client-only components with SSR disabled
const Calendar = dynamic(() => import('@/components/Calendar'), { 
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-12 bg-[var(--gray-200)] rounded-md mb-4"></div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-8 bg-[var(--gray-200)] rounded-md"></div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-24 bg-[var(--gray-200)] rounded-md"></div>
        ))}
      </div>
    </div>
  )
});

const DayScheduleView = dynamic(() => import('@/components/DayScheduleView'), { 
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-[var(--gray-200)] rounded-md mb-4"></div>
      <div>
        <div className="h-4 w-24 bg-[var(--gray-200)] rounded mb-2"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--gray-200)] rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
});

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('week');
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch events for the visible date range
  const fetchEvents = async (start: Date, end: Date) => {
    setIsLoading(true);
    const fetchedEvents = await scheduleService.getSchedule(start, end);
    setEvents(fetchedEvents);
    setIsLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    if (isClient) {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      fetchEvents(start, end);
    }
  }, [isClient]);

  // Handle date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle date range change (when navigating calendar)
  const handleDateRangeChange = (start: Date, end: Date) => {
    fetchEvents(start, end);
  };

  // Handle adding a new event
  const handleAddEvent = async (newEvent: Omit<TimeSlot, 'id'>) => {
    const createdEvent = await scheduleService.createTimeSlot(newEvent);
    if (createdEvent) {
      setEvents(prev => [...prev, createdEvent]);
    }
  };

  // Handle updating an event
  const handleUpdateEvent = async (id: string, updates: Partial<TimeSlot>) => {
    const updatedEvent = await scheduleService.updateTimeSlot(id, updates);
    if (updatedEvent) {
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (id: string) => {
    const success = await scheduleService.deleteTimeSlot(id);
    if (success) {
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <NavigationBar />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Schedule</h2>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewType('day')}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  viewType === 'day' 
                    ? 'bg-[var(--accent)] text-white' 
                    : 'bg-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-300)]'
                } transition-colors`}
              >
                Day
              </button>
              <button 
                onClick={() => setViewType('week')}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  viewType === 'week' 
                    ? 'bg-[var(--accent)] text-white' 
                    : 'bg-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-300)]'
                } transition-colors`}
              >
                Week
              </button>
              <button 
                onClick={() => setViewType('month')}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  viewType === 'month' 
                    ? 'bg-[var(--accent)] text-white' 
                    : 'bg-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-300)]'
                } transition-colors`}
              >
                Month
              </button>
            </div>
          </div>
          
          {isClient && (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-3/4">
                <Calendar 
                  events={events}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  onDateRangeChange={handleDateRangeChange}
                  viewType={viewType}
                  isLoading={isLoading}
                />
              </div>
              
              <div className="w-full lg:w-1/4">
                <DayScheduleView 
                  date={selectedDate}
                  events={events.filter(event => {
                    const eventDate = new Date(event.start);
                    return eventDate.toDateString() === selectedDate.toDateString();
                  })}
                  onAddEvent={handleAddEvent}
                  onUpdateEvent={handleUpdateEvent}
                  onDeleteEvent={handleDeleteEvent}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 