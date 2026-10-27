/**
 * Wellrun Parent API Types
 * Base URL: https://api.wellrunsystem.com
 */

export interface School {
  id: string;
  name: string;
  city: string;
  logoUrl: string;
  color: string;
}

export interface Child {
  id: string;
  name: string; // Full name
  firstName: string;
  admissionNo: string;
  gender: string;
  photoUrl: string; // "" when none
  classId: string | null;
  classLabel: string; // e.g. "Class 5 A"; "" when not enrolled
  relation: string; // father, mother, guardian…
  school: School;
}

export interface ParentProfile {
  id: string;
  phone: string;
  name: string;
  locale: "en" | "ur";
}

export interface LoginRequest {
  identifier: string; // Mobile number ("0300…" or "+92300…") or email
  password: string;
  deviceLabel?: string;
}

export interface LoginResponse {
  token: string;
  parent: ParentProfile;
  children: Child[];
  mustChangePassword?: boolean;
}

export interface MeResponse {
  parent: ParentProfile;
  children: Child[];
  mustChangePassword?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeviceSession {
  id: string;
  label: string;
  lastSeenAt: string;
  createdAt: string;
  current: boolean;
}

// ----------------------------------------------------
// Child Endpoints
// ----------------------------------------------------

export interface ChildSummary {
  child: Child;
  date: string; // "YYYY-MM-DD", Pakistan time
  attendance: {
    working: boolean;
    holiday: string | null;
    status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "EXCUSED" | null;
    monthPct: number | null;
    absentThisMonth: number;
  };
  fees: {
    dueTotalPkr: number;
    openCount: number;
    overdueCount: number;
    nextDueOn: string | null;
  };
  nextExam: {
    examName: string;
    subject: string;
    date: string;
    startTime: string;
  } | null;
  diary: {
    todayCount: number;
    dueSoonCount: number;
  };
  notice: {
    id: string;
    title: string;
    publishedAt: string;
  } | null;
}

export interface AttendanceDay {
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "EXCUSED" | "OFF" | null;
  holiday: string | null;
}

export interface AttendanceResponse {
  month: string; // "YYYY-MM"
  days: AttendanceDay[];
  counts: {
    PRESENT: number;
    ABSENT: number;
    LATE: number;
    LEAVE: number;
    EXCUSED: number;
  };
  pct: number | null;
}

export interface DiaryEntry {
  id: string;
  date: string;
  kind: "HOMEWORK" | "CLASSWORK" | "NOTE";
  subject: string | null;
  title: string;
  body: string;
  dueOn: string | null;
  imageUrl: string; // photo of board/worksheet, "" when none
  author: string | null; // teacher name
}

export interface DiaryResponse {
  date: string;
  entries: DiaryEntry[];
  dueSoon: DiaryEntry[];
}

export interface InvoiceItem {
  id: string;
  number: string;
  period: string;
  issueDate: string;
  dueOn: string;
  totalPkr: number;
  paidPkr: number;
  balancePkr: number;
  status: "ISSUED" | "PARTIALLY_PAID" | "OVERDUE" | "PAID";
}

export interface PaymentItem {
  id: string;
  number: string;
  date: string;
  amountPkr: number;
  method: string;
  invoices: string[];
}

export interface FeesResponse {
  totalDuePkr: number;
  invoices: InvoiceItem[];
  payments: PaymentItem[];
}

export interface ResultSubject {
  name: string;
  obtained: number;
  max: number;
  grade: string;
  passed: boolean;
}

export interface ResultItem {
  id: string;
  title: string; // Exam name, term name, or "Annual result"
  scope: "EXAM" | "TERM" | "ANNUAL";
  yearName: string;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string;
  rank: number | null;
  passed: boolean;
  attendancePct: number | null;
  teacherRemark: string;
  principalRemark: string;
  subjects: ResultSubject[];
  publishedAt: string;
}

export interface TimetablePeriod {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

export interface TimetableLesson {
  weekday: number; // 0=Sunday, 1=Monday … 6=Saturday
  periodId: string;
  subject: string;
  teacher: string | null;
}

export interface TimetableResponse {
  periods: TimetablePeriod[];
  lessons: TimetableLesson[];
}

export interface CalendarItem {
  id: string;
  type: "EVENT" | "HOLIDAY" | "EXAM";
  title: string;
  subtitle: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  kind: "EVENT" | "MEETING" | "TRIP" | "SPORTS" | "CULTURAL" | "OTHER" | null;
}

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  publishedAt: string;
}

