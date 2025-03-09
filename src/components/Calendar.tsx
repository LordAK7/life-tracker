'use client';

import { useRef, useEffect, useState } from 'react';
import { TimeSlot } from '@/types/schedule';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface CalendarProps {
  events: TimeSlot[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onDateRangeChange: (start: Date, end: Date) => void;
  viewType: 'month' | 'week' | 'day';
  isLoading: boolean;
}

export default function Calendar({ 
  events, 
  selectedDate, 
  onDateChange, 
  onDateRangeChange,
  viewType,
  isLoading
}: CalendarProps) {
  const calendarRef = useRef<any>(null);
  const [tooltips, setTooltips] = useState<HTMLElement[]>([]);

  // Format events for FullCalendar
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    backgroundColor: event.color || (event.type === 'college' ? '#4f46e5' : '#7c3aed'),
    borderColor: event.color || (event.type === 'college' ? '#4338ca' : '#6d28d9'),
    textColor: '#ffffff',
    editable: event.editable,
    extendedProps: {
      type: event.type,
      description: event.description
    }
  }));

  // Update calendar view when viewType changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      
      if (viewType === 'month') {
        calendarApi.changeView('dayGridMonth');
      } else if (viewType === 'week') {
        calendarApi.changeView('timeGridWeek');
      } else {
        calendarApi.changeView('timeGridDay');
      }
    }
  }, [viewType]);

  // Cleanup tooltips on unmount
  useEffect(() => {
    return () => {
      tooltips.forEach(tooltip => {
        if (document.body.contains(tooltip)) {
          document.body.removeChild(tooltip);
        }
      });
    };
  }, [tooltips]);

  // Loading skeleton
  const CalendarSkeleton = () => (
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
  );

  const handleEventDidMount = (info: any) => {
    try {
      // Add tooltip for events
      const eventEl = info.el;
      const eventTitle = info.event.title;
      const eventType = info.event.extendedProps?.type || 'personal';
      const eventDesc = info.event.extendedProps?.description || '';
      const startTime = info.event.start ? format(info.event.start, 'HH:mm') : '';
      const endTime = info.event.end ? format(info.event.end, 'HH:mm') : '';
      
      const tooltip = document.createElement('div');
      tooltip.className = 'event-tooltip';
      tooltip.innerHTML = `
        <div class="event-tooltip-title">${eventTitle}</div>
        <div class="event-tooltip-time">${startTime} - ${endTime}</div>
        ${eventDesc ? `<div class="event-tooltip-description">${eventDesc}</div>` : ''}
        <div class="text-xs mt-1 text-[var(--gray-500)]">${eventType === 'college' ? 'College class' : 'Personal event'}</div>
      `;
      
      document.body.appendChild(tooltip);
      tooltip.style.display = 'none';
      
      // Add this tooltip to our state so we can clean it up later
      setTooltips(prev => [...prev, tooltip]);
      
      eventEl.addEventListener('mouseover', () => {
        const rect = eventEl.getBoundingClientRect();
        tooltip.style.display = 'block';
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top}px`;
      });
      
      eventEl.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
      });
    } catch (error) {
      console.error('Error in eventDidMount:', error);
    }
  };

  return (
    <div className="calendar-container relative">
      {isLoading && (
        <div className="absolute inset-0 bg-[var(--card-bg)]/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-t-2 border-b-2 border-[var(--accent)] rounded-full"
          />
        </div>
      )}
      
      <style jsx global>{`
        .fc {
          --fc-border-color: var(--gray-300);
          --fc-page-bg-color: var(--card-bg);
          --fc-neutral-bg-color: var(--gray-200);
          --fc-list-event-hover-bg-color: var(--gray-200);
          --fc-today-bg-color: rgba(124, 58, 237, 0.1);
          --fc-event-bg-color: var(--accent);
          --fc-event-border-color: var(--accent);
          --fc-event-text-color: #fff;
          --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);
          --fc-non-business-color: rgba(0, 0, 0, 0.05);
          --fc-now-indicator-color: var(--danger);
          height: 650px;
        }
        
        .fc-theme-standard .fc-scrollgrid {
          border: 1px solid var(--gray-300);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .fc-theme-standard th {
          border-color: var(--gray-300);
          padding: 0.75rem 0;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .fc-theme-standard td {
          border-color: var(--gray-300);
        }
        
        .fc-col-header-cell-cushion {
          color: var(--text-primary);
          text-decoration: none !important;
          padding: 0.5rem;
        }
        
        .fc-daygrid-day-number {
          color: var(--text-primary);
          text-decoration: none !important;
          padding: 0.5rem;
        }
        
        .fc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.8rem;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.1s ease;
        }
        
        .fc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        
        .fc-event-time {
          font-weight: 500;
        }
        
        .fc-toolbar-title {
          color: var(--text-primary);
          font-size: 1.25rem !important;
          font-weight: 500;
        }
        
        .fc-button {
          background-color: var(--gray-200) !important;
          border-color: var(--gray-300) !important;
          color: var(--text-primary) !important;
          font-weight: 400 !important;
          text-transform: capitalize !important;
          padding: 0.5rem 0.75rem !important;
          border-radius: 0.375rem !important;
          transition: all 0.2s ease !important;
        }
        
        .fc-button:hover {
          background-color: var(--gray-300) !important;
          border-color: var(--gray-400) !important;
        }
        
        .fc-button-primary:not(:disabled).fc-button-active,
        .fc-button-primary:not(:disabled):active {
          background-color: var(--accent) !important;
          border-color: var(--accent) !important;
          color: white !important;
        }
        
        .fc-timegrid-slot {
          height: 40px !important;
        }
        
        .fc-timegrid-slot-label-cushion {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }
        
        .fc-timegrid-event {
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .fc-timegrid-now-indicator-line {
          border-color: var(--danger);
          border-width: 2px;
        }
        
        .fc-timegrid-now-indicator-arrow {
          border-color: var(--danger);
          border-width: 5px;
        }
        
        /* Tooltip styles */
        .event-tooltip {
          position: absolute;
          z-index: 1000;
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 0.75rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 300px;
          pointer-events: none;
        }
        
        .event-tooltip-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }
        
        .event-tooltip-time {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        
        .event-tooltip-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .fc {
            height: 500px;
          }
          
          .fc-toolbar {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={viewType === 'month' ? 'dayGridMonth' : viewType === 'week' ? 'timeGridWeek' : 'timeGridDay'}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={formattedEvents}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        nowIndicator={true}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        dateClick={(info) => {
          onDateChange(info.date);
        }}
        datesSet={(dateInfo) => {
          onDateRangeChange(dateInfo.start, dateInfo.end);
        }}
        eventClick={(info) => {
          const eventDate = info.event.start;
          if (eventDate) {
            onDateChange(eventDate);
          }
        }}
        eventDidMount={handleEventDidMount}
        dayMaxEvents={3}
        moreLinkClick="day"
        firstDay={1} // Start week on Monday
      />
    </div>
  );
} 