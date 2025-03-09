export type ClassType = 'college' | 'personal';

export interface TimeSlot {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  type: ClassType;
  description?: string;
  color?: string;
  editable: boolean;
}

export interface DaySchedule {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlots: TimeSlot[];
} 