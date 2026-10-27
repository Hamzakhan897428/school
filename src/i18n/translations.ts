export type Locale = "en" | "ur";

export interface TranslationSchema {
  common: {
    back: string;
    cancel: string;
    signOut: string;
    signOutConfirm: string;
    signOutPrompt: string;
    language: string;
    english: string;
    urdu: string;
    loading: string;
    error: string;
    save: string;
    close: string;
  };
  modules: {
    attendance: string;
    homework: string;
    fees: string;
    results: string;
    notices: string;
    timetable: string;
    calendar: string;
    settings: string;
    dashboard: string;
  };
  status: {
    present: string;
    absent: string;
    late: string;
    leave: string;
    excused: string;
    paid: string;
    pending: string;
    pastDue: string;
    passed: string;
    failed: string;
    completed: string;
  };
  dashboard: {
    attendanceToday: string;
    schoolClosedToday: string;
    monthPresentPct: string;
    feesTitle: string;
    totalToPay: string;
    pastDueDateBadge: string;
    nextDueDate: string;
    nextExam: string;
    noExamComingUp: string;
    modulesSubtitle: string;
    classPrefix: string;
  };
  attendance: {
    screenTitle: string;
    workingDays: string;
    thisMonthSummary: string;
    noRecord: string;
    markedRecords: string;
    presentDays: string;
    absentDays: string;
    lateDays: string;
    leaveDays: string;
  };
  homework: {
    screenTitle: string;
    duePrefix: string;
    assignedByPrefix: string;
    nothingSetForDay: string;
    classwork: string;
    homework: string;
    note: string;
    previousDay: string;
    nextDay: string;
  };
  fees: {
    screenTitle: string;
    totalToPay: string;
    feeBills: string;
    voucher: string;
    openFeeSlip: string;
    dueOnPrefix: string;
    paidOnPrefix: string;
    overdueWarning: string;
  };
  results: {
    screenTitle: string;
    annualResult: string;
    termReport: string;
    examReport: string;
    percentage: string;
    grade: string;
    rank: string;
    openReportCard: string;
    hideMarks: string;
    showMarks: string;
    subjectsCount: string;
    teacherRemark: string;
    principalRemark: string;
  };
  notices: {
    screenTitle: string;
    announcements: string;
    noNotices: string;
    urgentBadge: string;
    readMore: string;
  };
  timetable: {
    screenTitle: string;
    breakLabel: string;
    teacherPrefix: string;
    returnToDashboard: string;
    noClasses: string;
    enjoyOffDay: string;
    days: {
      Mon: string;
      Tue: string;
      Wed: string;
      Thu: string;
      Fri: string;
      Sat: string;
    };
  };
  calendar: {
    screenTitle: string;
    eventTag: string;
    holidayTag: string;
    examTag: string;
    allDay: string;
    noEventsMonth: string;
    previousMonth: string;
    nextMonth: string;
  };
  settings: {
    screenTitle: string;
    languageCardTitle: string;
    phonesSignedIn: string;
    thisPhone: string;
    lastUsedPrefix: string;
    signOutButton: string;
  };
  auth: {
    welcome: string;
    description: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    showPassword: string;
    hidePassword: string;
    signIn: string;
    footerNote: string;
    requiredFieldsTitle: string;
    requiredFieldsDesc: string;
    invalidIdentifier: string;
    invalidPassword: string;
    signInErrorTitle: string;
    signInErrorDesc: string;
  };
}

export const translations: Record<Locale, TranslationSchema> = {
  en: {
    common: {
      back: "Back",
      cancel: "Cancel",
      signOut: "Sign out",
      signOutConfirm: "Are you sure you want to sign out?",
      signOutPrompt: "Sign Out",
      language: "Language",
      english: "English",
      urdu: "اردو",
      loading: "Loading...",
      error: "Error",
      save: "Save",
      close: "Close",
    },
    modules: {
      attendance: "Attendance",
      homework: "Homework",
      fees: "Fees",
      results: "Results",
      notices: "Notices",
      timetable: "Timetable",
      calendar: "Calendar",
      settings: "More",
      dashboard: "Dashboard",
    },
    status: {
      present: "Present",
      absent: "Absent",
      late: "Late",
      leave: "Leave",
      excused: "Excused",
      paid: "Paid",
      pending: "Pending",
      pastDue: "Past Due",
      passed: "Passed",
      failed: "Failed",
      completed: "Completed",
    },
    dashboard: {
      attendanceToday: "Attendance today",
      schoolClosedToday: "School is closed today",
      monthPresentPct: "This month: %{pct}% present",
      feesTitle: "Fees",
      totalToPay: "Total to pay",
      pastDueDateBadge: "%{count} past the due date",
      nextDueDate: "Next due date %{date}",
      nextExam: "Next exam",
      noExamComingUp: "No exam coming up",
      modulesSubtitle: "Quick actions & academic services",
      classPrefix: "Class",
    },
    attendance: {
      screenTitle: "Attendance",
      workingDays: "Working days",
      thisMonthSummary: "This month's summary",
      noRecord: "No attendance marked yet",
      markedRecords: "Attendance records",
      presentDays: "Present",
      absentDays: "Absent",
      lateDays: "Late",
      leaveDays: "Leave",
    },
    homework: {
      screenTitle: "Homework",
      duePrefix: "Due",
      assignedByPrefix: "Assigned by",
      nothingSetForDay: "Nothing was set for this day.",
      classwork: "Classwork",
      homework: "Homework",
      note: "Note",
      previousDay: "Previous Day",
      nextDay: "Next Day",
    },
    fees: {
      screenTitle: "Fees",
      totalToPay: "Total to pay",
      feeBills: "Fee bills",
      voucher: "Fee Voucher",
      openFeeSlip: "Open fee slip",
      dueOnPrefix: "Due date",
      paidOnPrefix: "Paid on",
      overdueWarning: "Overdue",
    },
    results: {
      screenTitle: "Results",
      annualResult: "Annual Result",
      termReport: "Term Report",
      examReport: "Exam Report",
      percentage: "Percentage",
      grade: "Grade",
      rank: "Rank",
      openReportCard: "Open report card",
      hideMarks: "Hide marks",
      showMarks: "%{count} subjects",
      subjectsCount: "Subjects",
      teacherRemark: "Teacher Remark",
      principalRemark: "Principal Remark",
    },
    notices: {
      screenTitle: "Notices",
      announcements: "School Announcements",
      noNotices: "No announcements at this time.",
      urgentBadge: "Urgent",
      readMore: "Read more",
    },
    timetable: {
      screenTitle: "Timetable",
      breakLabel: "Break",
      teacherPrefix: "Teacher",
      returnToDashboard: "← Return to Dashboard",
      noClasses: "No classes scheduled",
      enjoyOffDay: "Enjoy your off day!",
      days: {
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
      },
    },
    calendar: {
      screenTitle: "Calendar",
      eventTag: "School event",
      holidayTag: "Holiday",
      examTag: "Exam",
      allDay: "All day",
      noEventsMonth: "No events scheduled for this month.",
      previousMonth: "Previous Month",
      nextMonth: "Next Month",
    },
    settings: {
      screenTitle: "More",
      languageCardTitle: "Language",
      phonesSignedIn: "Phones signed in",
      thisPhone: "This phone",
      lastUsedPrefix: "Last used",
      signOutButton: "Sign out",
    },
    auth: {
      welcome: "Welcome",
      description:
        "Sign in with the mobile number or email your school has on record and the password they gave you.",
      identifierLabel: "Mobile number or email",
      identifierPlaceholder: "Enter your email or number",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      showPassword: "Show",
      hidePassword: "Hide",
      signIn: "Sign in",
      footerNote:
        "Forgot your password or never got one? Please ask your school office.",
      requiredFieldsTitle: "Required Field",
      requiredFieldsDesc: "Please enter your mobile number and password.",
      invalidIdentifier: "Invalid mobile number or email",
      invalidPassword: "Invalid password",
      signInErrorTitle: "Sign in error",
      signInErrorDesc: "That ID or password is incorrect.",
    },
  },
  ur: {
    common: {
      back: "واپس",
      cancel: "منسوخ کریں",
      signOut: "سائن آؤٹ",
      signOutConfirm: "کیا آپ پورٹل سے سائن آؤٹ کرنا چاہتے ہیں؟",
      signOutPrompt: "سائن آؤٹ",
      language: "زبان",
      english: "English",
      urdu: "اردو",
      loading: "لوڈ ہو رہا ہے...",
      error: "خرابی",
      save: "محفوظ کریں",
      close: "بند کریں",
    },
    modules: {
      attendance: "حاضری",
      homework: "ہوم ورک",
      fees: "فیس",
      results: "نتائج",
      notices: "اطلاعات",
      timetable: "ٹائم ٹیبل",
      calendar: "کیلنڈر",
      settings: "مزید",
      dashboard: "ڈیش بورڈ",
    },
    status: {
      present: "حاضر",
      absent: "غیر حاضر",
      late: "دیر",
      leave: "رخصت",
      excused: "معاف",
      paid: "ادا شدہ",
      pending: "زیر التواء",
      pastDue: "تاریخ گزر چکی",
      passed: "کامیاب",
      failed: "ناکام",
      completed: "مکمل",
    },
    dashboard: {
      attendanceToday: "آج کی حاضری",
      schoolClosedToday: "آج اسکول بند ہے",
      monthPresentPct: "اس مہینے: %{pct}% حاضر",
      feesTitle: "فیس",
      totalToPay: "کل ادا کرنے کی رقم",
      pastDueDateBadge: "%{count} کی آخری تاریخ گزر چکی ہے",
      nextDueDate: "اگلی آخری تاریخ: %{date}",
      nextExam: "اگلا امتحان",
      noExamComingUp: "کوئی امتحان قریب نہیں",
      modulesSubtitle: "فوری رسائی اور تعلیمی خدمات",
      classPrefix: "کلاس",
    },
    attendance: {
      screenTitle: "حاضری",
      workingDays: "کام کے دن",
      thisMonthSummary: "اس مہینے کا خلاصہ",
      noRecord: "ابھی تک کوئی حاضری درج نہیں",
      markedRecords: "حاضری کا ریکارڈ",
      presentDays: "حاضر",
      absentDays: "غیر حاضر",
      lateDays: "دیر",
      leaveDays: "رخصت",
    },
    homework: {
      screenTitle: "ہوم ورک",
      duePrefix: "آخری تاریخ",
      assignedByPrefix: "تفویض کنندہ",
      nothingSetForDay: "اس دن کے لیے کچھ مقرر نہیں تھا۔",
      classwork: "کلاس ورک",
      homework: "ہوم ورک",
      note: "نوٹ",
      previousDay: "پچھلا دن",
      nextDay: "اگلا دن",
    },
    fees: {
      screenTitle: "فیس",
      totalToPay: "کل ادا کرنے کی رقم",
      feeBills: "فیس کے بل",
      voucher: "فیس واؤچر",
      openFeeSlip: "فیس چالان کھولیں",
      dueOnPrefix: "آخری تاریخ",
      paidOnPrefix: "ادائیگی کی تاریخ",
      overdueWarning: "میعاد ختم",
    },
    results: {
      screenTitle: "نتائج",
      annualResult: "سالانہ نتیجہ",
      termReport: "ٹرم رپورٹ",
      examReport: "امتحانی رپورٹ",
      percentage: "فیصد",
      grade: "گریڈ",
      rank: "پوزیشن",
      openReportCard: "نتیجہ کارڈ کھولیں",
      hideMarks: "نمبرات چھپائیں",
      showMarks: "%{count} مضامین",
      subjectsCount: "مضامین",
      teacherRemark: "استاد کی رائے",
      principalRemark: "پرنسپل کی رائے",
    },
    notices: {
      screenTitle: "اطلاعات",
      announcements: "اسکول کی اعلانات",
      noNotices: "اس وقت کوئی اطلاع موجود نہیں ہے۔",
      urgentBadge: "ضروری",
      readMore: "مزید پڑھیں",
    },
    timetable: {
      screenTitle: "ٹائم ٹیبل",
      breakLabel: "وقفہ",
      teacherPrefix: "استاد",
      returnToDashboard: "ڈیش بورڈ پر واپس جائیں →",
      noClasses: "کوئی کلاس شیڈول نہیں",
      enjoyOffDay: "اپنی چھٹی سے لطف اندوز ہوں!",
      days: {
        Mon: "پیر",
        Tue: "منگل",
        Wed: "بدھ",
        Thu: "جمعرات",
        Fri: "جمعہ",
        Sat: "ہفتہ",
      },
    },
    calendar: {
      screenTitle: "کیلنڈر",
      eventTag: "اسکول تقریب",
      holidayTag: "تعطیل",
      examTag: "امتحان",
      allDay: "تمام دن",
      noEventsMonth: "اس مہینے میں کوئی تقریب مقرر نہیں ہے۔",
      previousMonth: "پچھلا مہینہ",
      nextMonth: "اگلا مہینہ",
    },
    settings: {
      screenTitle: "مزید",
      languageCardTitle: "زبان",
      phonesSignedIn: "لاگ ان فونز",
      thisPhone: "یہ فون",
      lastUsedPrefix: "آخری استعمال",
      signOutButton: "سائن آؤٹ",
    },
    auth: {
      welcome: "خوش آمدید",
      description:
        "اسکول کے ریکارڈ میں درج موبائل نمبر یا ای میل اور اسکول کا دیا ہوا پاس ورڈ لکھ کر سائن ان کریں۔",
      identifierLabel: "موبائل نمبر یا ای میل",
      identifierPlaceholder: "اپنا ای میل یا موبائل نمبر درج کریں",
      passwordLabel: "پاس ورڈ",
      passwordPlaceholder: "پاس ورڈ درج کریں",
      showPassword: "دکھائیں",
      hidePassword: "چھپائیں",
      signIn: "سائن ان کریں",
      footerNote:
        "پاس ورڈ بھول گئے یا کبھی ملا ہی نہیں؟ براہ کرم اسکول کے دفتر سے پوچھیں۔",
      requiredFieldsTitle: "ضروری معلومات",
      requiredFieldsDesc: "براہ کرم موبائل نمبر اور پاس ورڈ درج کریں۔",
      invalidIdentifier: "غلط موبائل نمبر یا ای میل",
      invalidPassword: "غلط پاس ورڈ",
      signInErrorTitle: "سائن ان کی خرابی",
      signInErrorDesc: "موبائل نمبر یا پاس ورڈ درست نہیں ہے۔",
    },
  },
};
