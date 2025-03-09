import { supabase } from '@/lib/supabase';
import { TimeSlot } from '@/types/schedule';
import { format, parseISO, addDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export const scheduleService = {
  async getSchedule(start: Date, end: Date): Promise<TimeSlot[]> {
    try {
      // Convert dates to ISO strings for Supabase query
      const startStr = start.toISOString();
      const endStr = end.toISOString();

      // Get personal time slots from Supabase
      const { data: personalSlots, error: personalError } = await supabase
        .from('time_slots')
        .select('*')
        .gte('start_time', startStr)
        .lte('end_time', endStr);

      if (personalError) {
        console.error('Error fetching personal schedule:', personalError.message);
        return getCollegeSchedule(start, end); // Return only college schedule if there's an error
      }

      // Combine with fixed college schedule
      const collegeSlots = getCollegeSchedule(start, end);
      
      // Map the database columns to our TimeSlot interface
      const mappedPersonalSlots = (personalSlots || []).map(slot => ({
        id: slot.id,
        title: slot.title,
        start: slot.start_time,
        end: slot.end_time,
        type: 'personal' as const,
        description: slot.description,
        color: slot.color,
        editable: slot.editable
      }));
      
      return [
        ...mappedPersonalSlots,
        ...collegeSlots
      ];
    } catch (error) {
      console.error('Unexpected error in getSchedule:', error);
      return getCollegeSchedule(start, end); // Return only college schedule if there's an error
    }
  },

  async createTimeSlot(timeSlot: Omit<TimeSlot, 'id'>): Promise<TimeSlot | null> {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .insert({
          title: timeSlot.title,
          start_time: timeSlot.start,
          end_time: timeSlot.end,
          type: timeSlot.type,
          description: timeSlot.description,
          color: timeSlot.color,
          editable: timeSlot.editable
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating time slot:', error.message);
        return null;
      }

      // Map the database response to our TimeSlot interface
      return {
        id: data.id,
        title: data.title,
        start: data.start_time,
        end: data.end_time,
        type: data.type,
        description: data.description,
        color: data.color,
        editable: data.editable
      };
    } catch (error) {
      console.error('Unexpected error in createTimeSlot:', error);
      return null;
    }
  },

  async updateTimeSlot(id: string, updates: Partial<TimeSlot>): Promise<TimeSlot | null> {
    try {
      // Map our TimeSlot interface to database columns
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.start !== undefined) dbUpdates.start_time = updates.start;
      if (updates.end !== undefined) dbUpdates.end_time = updates.end;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.editable !== undefined) dbUpdates.editable = updates.editable;
      
      const { data, error } = await supabase
        .from('time_slots')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating time slot:', error.message);
        return null;
      }

      // Map the database response to our TimeSlot interface
      return {
        id: data.id,
        title: data.title,
        start: data.start_time,
        end: data.end_time,
        type: data.type,
        description: data.description,
        color: data.color,
        editable: data.editable
      };
    } catch (error) {
      console.error('Unexpected error in updateTimeSlot:', error);
      return null;
    }
  },

  async deleteTimeSlot(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting time slot:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error in deleteTimeSlot:', error);
      return false;
    }
  }
};

// Helper function to generate college schedule
function getCollegeSchedule(start: Date, end: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  // Get the start of the week (Monday) for the given start date
  const weekStart = startOfWeek(start, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(start, { weekStartsOn: 1 });
  
  // Only generate college schedule for the current week view
  let currentDate = new Date(weekStart);
  
  while (currentDate <= weekEnd) {
    const dayOfWeek = format(currentDate, 'EEEE').toLowerCase();
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Only add college schedule for weekdays (Monday to Friday)
    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(dayOfWeek)) {
      const daySchedule = getCollegeDaySchedule(dayOfWeek, dateStr);
      slots.push(...daySchedule);
    }
    
    currentDate = addDays(currentDate, 1);
  }

  // Filter slots to only include those within the requested date range
  return slots.filter(slot => {
    const slotStart = new Date(slot.start);
    return isWithinInterval(slotStart, { start, end });
  });
}

function getCollegeDaySchedule(day: string, dateStr: string): TimeSlot[] {
  const schedules: Record<string, { start: string; end: string; title: string }[]> = {
    monday: [
      { start: '08:45', end: '10:45', title: 'B1-PIC' },
      { start: '10:45', end: '11:45', title: 'AMS' },
      { start: '11:45', end: '12:45', title: 'BEE' },
      { start: '12:45', end: '13:30', title: 'RECESS' },
      { start: '13:30', end: '14:30', title: 'PIC' },
      { start: '14:30', end: '15:30', title: 'WPD' },
      { start: '15:30', end: '16:30', title: 'BA-AMS (T)' }
    ],
    tuesday: [
      { start: '08:45', end: '09:45', title: 'AMS' },
      { start: '09:45', end: '10:45', title: 'PIC' },
      { start: '10:45', end: '12:45', title: 'BA-WPD' },
      { start: '12:45', end: '13:30', title: 'RECESS' },
      { start: '13:30', end: '14:30', title: 'PIC' },
      { start: '14:30', end: '16:30', title: 'B1-BEE' }
    ],
    wednesday: [
      { start: '08:45', end: '09:45', title: 'AMS' },
      { start: '09:45', end: '10:45', title: 'BEE' },
      { start: '10:45', end: '12:45', title: 'B1-PCO' },
      { start: '12:45', end: '13:30', title: 'RECESS' },
      { start: '13:30', end: '14:30', title: 'BA-PIC (T)' },
      { start: '14:30', end: '15:30', title: 'No applicable class' },
      { start: '15:30', end: '16:30', title: 'BLP' }
    ],
    thursday: [
      { start: '08:45', end: '10:45', title: 'BA-WPD' },
      { start: '10:45', end: '11:45', title: 'PIC' },
      { start: '11:45', end: '12:45', title: 'RECESS' },
      { start: '12:45', end: '14:30', title: 'B1-PIC' },
      { start: '14:30', end: '16:30', title: 'B1-BEE' }
    ],
    friday: [
      { start: '08:45', end: '09:45', title: 'AMS' },
      { start: '09:45', end: '10:45', title: 'BEE' },
      { start: '10:45', end: '11:45', title: 'BLP' },
      { start: '11:45', end: '12:45', title: 'BA-BLP' },
      { start: '12:45', end: '13:30', title: 'RECESS' },
      { start: '13:30', end: '14:30', title: 'WPD' }
    ]
  };

  const daySchedule = schedules[day] || [];
  
  return daySchedule.map((item, index) => {
    // Create ISO datetime strings
    const startDateTime = `${dateStr}T${item.start}:00`;
    const endDateTime = `${dateStr}T${item.end}:00`;
    
    // Determine color based on class type
    let color = '#4f46e5'; // Default indigo for most classes
    
    if (item.title.includes('RECESS')) {
      color = '#10b981'; // Green for recess
    } else if (item.title.includes('No applicable')) {
      color = '#9ca3af'; // Gray for empty slots
    } else if (item.title.includes('B1-')) {
      color = '#3b82f6'; // Blue for B1 classes
    } else if (item.title.includes('BA-')) {
      color = '#8b5cf6'; // Purple for BA classes
    }
    
    return {
      id: `college-${day}-${index}`,
      title: item.title,
      start: startDateTime,
      end: endDateTime,
      type: 'college' as const,
      editable: false,
      color: color,
      description: `Regular ${day} class`
    };
  });
} 