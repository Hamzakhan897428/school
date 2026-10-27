import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { StickyHeader } from "../components/StickyHeader";
import { useI18n } from "../i18n";

export interface SchoolCalendarEvent {
  id: string;
  dateKey: string; // YYYY-MM
  dateLabel: string; // e.g. "Mon 12 Oct"
  tag: string;
  tagVariant: "exam" | "event" | "holiday";
  title: string;
  time: string;
  subtitle: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CALENDAR_EVENTS_LIST: SchoolCalendarEvent[] = [
  {
    id: "EV-1",
    dateKey: "2026-10",
    dateLabel: "Mon 12 Oct",
    tag: "Exam",
    tagVariant: "exam",
    title: "English",
    time: "9:00 to 10:00",
    subtitle: "October Monthly Test",
  },
  {
    id: "EV-2",
    dateKey: "2026-10",
    dateLabel: "Tue 13 Oct",
    tag: "School event",
    tagVariant: "event",
    title: "Eid milad function",
    time: "All day",
    subtitle: "School hall",
  },
  {
    id: "EV-3",
    dateKey: "2026-10",
    dateLabel: "Tue 13 Oct",
    tag: "Exam",
    tagVariant: "exam",
    title: "Urdu",
    time: "9:00 to 10:00",
    subtitle: "October Monthly Test",
  },
  {
    id: "EV-4",
    dateKey: "2026-11",
    dateLabel: "Mon 09 Nov",
    tag: "School event",
    tagVariant: "holiday",
    title: "Iqbal Day Holiday",
    time: "All day",
    subtitle: "Campus Closed",
  },
  {
    id: "EV-5",
    dateKey: "2026-11",
    dateLabel: "Thu 12 Nov",
    tag: "Exam",
    tagVariant: "exam",
    title: "Mathematics Mid-Term",
    time: "8:30 to 11:30",
    subtitle: "Mid-Term Examination 2026",
  },
];

export default function CalendarScreen() {
  const { selectedChild, isAuthenticated } = useAuth();
  const { t, isRTL } = useI18n();
  // Default to October 2026 as per reference UI
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1)); // Month index 9 = October
  const [liveEvents, setLiveEvents] = useState<SchoolCalendarEvent[] | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = MONTHS[month];
  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const fetchCalendar = useCallback(async () => {
    if (
      !selectedChild?.id ||
      selectedChild.id.startsWith("STD-DEMO") ||
      !isAuthenticated
    ) {
      return;
    }
    try {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const from = `${dateKey}-01`;
      const to = `${dateKey}-${String(daysInMonth).padStart(2, "0")}`;
      const data = await api.calendar(selectedChild.id, from, to);
      if (Array.isArray(data) && data.length > 0) {
        const mapped: SchoolCalendarEvent[] = data.map((ev) => {
          let dateLabel = ev.date;
          try {
            const d = new Date(ev.date);
            dateLabel = d.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
          } catch {}

          const isExam = ev.type === "EXAM";
          const isHoliday = ev.type === "HOLIDAY";

          return {
            id: ev.id,
            dateKey,
            dateLabel,
            tag: isExam ? "Exam" : isHoliday ? "Holiday" : "School event",
            tagVariant: isExam ? "exam" : isHoliday ? "holiday" : "event",
            title: ev.title,
            time: ev.startTime ? `${ev.startTime} to ${ev.endTime}` : "All day",
            subtitle: ev.subtitle || (isExam ? "Exam Schedule" : "School Campus"),
          };
        });
        setLiveEvents(mapped);
        return;
      }
    } catch {
      // Fallback
    }
    setLiveEvents(null);
  }, [selectedChild?.id, dateKey, year, month, isAuthenticated]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCalendar();
    setRefreshing(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filter events for the currently viewed month
  const currentMonthEvents =
    liveEvents !== null
      ? liveEvents
      : CALENDAR_EVENTS_LIST.filter((ev) => ev.dateKey === dateKey);

  // Group events by dateLabel
  const groupedEvents = currentMonthEvents.reduce((acc, event) => {
    if (!acc[event.dateLabel]) {
      acc[event.dateLabel] = [];
    }
    acc[event.dateLabel].push(event);
    return acc;
  }, {} as Record<string, SchoolCalendarEvent[]>);

  const dateLabels = Object.keys(groupedEvents);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["bottom", "left", "right"]}>
      {/* Pinned Sticky Header */}
      <StickyHeader title={t("calendar.screenTitle")} onBack={handleBack} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Month Switcher Navigation */}
        <View
          className={`flex-row items-center justify-between pt-1 pb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <TouchableOpacity
            onPress={isRTL ? handleNextMonth : handlePrevMonth}
            activeOpacity={0.7}
            accessibilityLabel="Previous Month"
            className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center active:bg-gray-50"
          >
            <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={22} color="#1F2937" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-[20px] font-bold text-gray-900 tracking-tight">
              {monthName} {year}
            </Text>
          </View>

          <TouchableOpacity
            onPress={isRTL ? handlePrevMonth : handleNextMonth}
            activeOpacity={0.7}
            accessibilityLabel="Next Month"
            className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center active:bg-gray-50"
          >
            <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Event Groups by Date */}
        {dateLabels.length === 0 ? (
          <View className="bg-white rounded-3xl py-8 px-6 border border-gray-100 shadow-sm items-center justify-center mt-2">
            <Text className="text-[15.5px] font-semibold text-gray-500 text-center">
              {t("calendar.noEventsMonth")}
            </Text>
          </View>
        ) : (
          dateLabels.map((dateLabel) => (
            <View key={dateLabel} className="mb-2">
              {/* Date Header: e.g. "Mon 12 Oct" */}
              <Text className="text-[15px] font-bold text-gray-900 mb-2 px-1">
                {dateLabel}
              </Text>

              {/* Event Cards for this date */}
              {groupedEvents[dateLabel].map((event) => {
                const isExam = event.tagVariant === "exam";
                const isEvent = event.tagVariant === "event";

                return (
                  <View
                    key={event.id}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-3.5"
                  >
                    {/* Event Tag Pill */}
                    <View
                      className={`self-start px-3 py-1 rounded-full mb-2 ${
                        isExam
                          ? "bg-[#D1FAE5]"
                          : isEvent
                          ? "bg-[#EEF2FF]"
                          : "bg-amber-50"
                      }`}
                    >
                      <Text
                        className={`text-[11.5px] font-bold ${
                          isExam
                            ? "text-[#059669]"
                            : isEvent
                            ? "text-[#4F46E5]"
                            : "text-amber-700"
                        }`}
                      >
                        {event.tag}
                      </Text>
                    </View>

                    {/* Event Title */}
                    <Text className="text-[17px] font-bold text-gray-900">
                      {event.title}
                    </Text>

                    {/* Time */}
                    <Text className="text-[13px] text-gray-500 font-medium mt-1">
                      {event.time}
                    </Text>

                    {/* Subtitle / Note */}
                    <Text className="text-[13px] text-gray-400 font-normal mt-0.5">
                      {event.subtitle}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))
        )}

        {/* Return to Dashboard */}
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mt-4 py-2.5 items-center justify-center"
        >
          <Text className="text-[13px] font-semibold text-gray-400">
            {t("timetable.returnToDashboard")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
