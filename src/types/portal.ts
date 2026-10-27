export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  grade: string;
  section: string;
  academicYear: string;
  schoolName: string;
  avatarUrl?: string;
  attendancePercentage: number;
  outstandingBalance: number;
}

export interface FeeRecord {
  id: string;
  title: string;
  invoiceNumber: string;
  month: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  receiptNumber?: string;
}

export interface ExamResult {
  id: string;
  subject: string;
  code: string;
  term: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  percentage: number;
  remarks: string;
  status: 'passed' | 'failed';
}

export interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  status: 'present' | 'absent' | 'late' | 'holiday';
  checkInTime?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'Urgent' | 'Academic' | 'Holiday' | 'Sports' | 'General';
  priority: 'high' | 'medium' | 'low';
  summary: string;
  sender: string;
  attachmentName?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  monthName: string;
  dayNumber: number;
  time: string;
  type: 'exam' | 'holiday' | 'event' | 'meeting';
  location: string;
  description: string;
}

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export interface TimetableSlot {
  id: string;
  isBreak?: boolean;
  breakTitle?: string;
  subject?: string;
  code?: string;
  startTime: string;
  endTime: string;
  teacher?: string;
  room?: string;
  colorTheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  iconName?: string;
}

export interface DaySchedule {
  day: WeekDay;
  fullDayName: string;
  slots: TimetableSlot[];
}


