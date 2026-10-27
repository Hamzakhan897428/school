import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { AttendanceResponse } from "../types/api";
import { ModuleHeader } from "../components/ModuleHeader";
import { useI18n } from "../i18n";

export type AttendanceStatus = "present" | "absent" | "late" | "leave";

interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string;
  notes?: string;
}

// Initial attendance records (can be empty or populated)
const MOCK_ATTENDANCE: AttendanceRecord[] = [
  // Example data for past months if needed, July 2026 starts fresh with 0 marked as in screenshot
];

const MONTH_NAMES = [
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

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

export default function AttendanceScreen() {
  const { selectedChild, isAuthenticated } = useAuth();
  const { t, isRTL } = useI18n();
  // Default to July 2026 as per reference UI
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 6, 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [apiData, setApiData] = useState<AttendanceResponse | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (6 = July)
  const monthName = MONTH_NAMES[month];

  const monthString = `${year}-${String(month + 1).padStart(2, "0")}`;

  const fetchAttendance = useCallback(async () => {
    if (
      !selectedChild?.id ||
      selectedChild.id.startsWith("STD-DEMO") ||
      !isAuthenticated
    ) {
      return;
    }
    try {
      const data = await api.attendance(selectedChild.id, monthString);
      setApiData(data);
    } catch {
      // Fallback to local default
    }
  }, [selectedChild?.id, monthString, isAuthenticated]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendance();
    setRefreshing(false);
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    setSelectedDay(null);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDay(null);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map attendance for current month
  const attendanceMap = useMemo(() => {
    const map: Record<number, AttendanceRecord> = {};

    // Populate from live API if present
    if (apiData && Array.isArray(apiData.days)) {
      apiData.days.forEach((d) => {
        const parts = d.date.split("-").map(Number);
        const dayNumber = parts[2];
        if (d.status && d.status !== "OFF") {
          let mappedStatus: AttendanceStatus = "present";
          if (d.status === "ABSENT") mappedStatus = "absent";
          else if (d.status === "LATE") mappedStatus = "late";
          else if (d.status === "LEAVE" || d.status === "EXCUSED") mappedStatus = "leave";

          map[dayNumber] = {
            date: d.date,
            status: mappedStatus,
            notes: d.holiday || undefined,
          };
        }
      });
      return map;
    }

    MOCK_ATTENDANCE.forEach((rec) => {
      const [rYear, rMonth, rDay] = rec.date.split("-").map(Number);
      if (rYear === year && rMonth === month + 1) {
        map[rDay] = rec;
      }
    });
    return map;
  }, [year, month, apiData]);

  // Calculate summary counts
  const stats = useMemo(() => {
    if (apiData?.counts) {
      const present = apiData.counts.PRESENT || 0;
      const absent = apiData.counts.ABSENT || 0;
      const late = apiData.counts.LATE || 0;
      const leave = (apiData.counts.LEAVE || 0) + (apiData.counts.EXCUSED || 0);
      const totalMarked = present + absent + late + leave;
      return { present, absent, late, leave, totalMarked };
    }

    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;

    Object.values(attendanceMap).forEach((rec) => {
      if (rec.status === "present") present++;
      else if (rec.status === "absent") absent++;
      else if (rec.status === "late") late++;
      else if (rec.status === "leave") leave++;
    });

    const totalMarked = present + absent + late + leave;
    return { present, absent, late, leave, totalMarked };
  }, [attendanceMap, apiData]);

  // Calendar grid computation (Monday-first)
  const weeks = useMemo(() => {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    // Shift so Monday = 0, ..., Sunday = 6
    const firstDayIndex = (firstDayOfWeek + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarWeeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    // Fill leading empty days
    for (let i = 0; i < firstDayIndex; i++) {
      currentWeek.push(null);
    }

    // Fill month days
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        calendarWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill trailing empty days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      calendarWeeks.push(currentWeek);
    }

    return calendarWeeks;
  }, [year, month]);

  // Details for selected day or default empty state
  const selectedDayRecord = selectedDay ? attendanceMap[selectedDay] : null;

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["bottom", "left", "right"]}>
      {/* Pinned Module Header */}
      <ModuleHeader title={t("attendance.screenTitle")} onBack={handleBack} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Next Month"
            className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center active:bg-gray-50"
          >
            <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Card 1: Attendance Summary Counters */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
          <Text className="text-center text-[15px] font-medium text-gray-500 mb-4">
            {stats.totalMarked > 0
              ? `${stats.totalMarked} ${t("attendance.markedRecords")}`
              : t("attendance.noRecord")}
          </Text>

          {/* 4 Stat Boxes in a Row with RTL awareness */}
          <View className={`flex-row items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <View className="flex-1 bg-[#F8F9FA] rounded-2xl py-3.5 mx-1 items-center justify-center">
              <Text className="text-[22px] font-extrabold text-gray-900">
                {stats.present}
              </Text>
              <Text className="text-[12px] font-medium text-gray-400 mt-0.5">
                {t("status.present")}
              </Text>
            </View>

            <View className="flex-1 bg-[#F8F9FA] rounded-2xl py-3.5 mx-1 items-center justify-center">
              <Text className="text-[22px] font-extrabold text-gray-900">
                {stats.absent}
              </Text>
              <Text className="text-[12px] font-medium text-gray-400 mt-0.5">
                {t("status.absent")}
              </Text>
            </View>

            <View className="flex-1 bg-[#F8F9FA] rounded-2xl py-3.5 mx-1 items-center justify-center">
              <Text className="text-[22px] font-extrabold text-gray-900">
                {stats.late}
              </Text>
              <Text className="text-[12px] font-medium text-gray-400 mt-0.5">
                {t("status.late")}
              </Text>
            </View>

            <View className="flex-1 bg-[#F8F9FA] rounded-2xl py-3.5 mx-1 items-center justify-center">
              <Text className="text-[22px] font-extrabold text-gray-900">
                {stats.leave}
              </Text>
              <Text className="text-[12px] font-medium text-gray-400 mt-0.5">
                {t("status.leave")}
              </Text>
            </View>
          </View>
        </View>

        {/* Card 2: Calendar & Colors Legend */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
          {/* Day Headers (M T W T F S S) */}
          <View className="flex-row items-center justify-between mb-3 px-1">
            {DAY_LETTERS.map((letter, idx) => {
              const isWeekend = idx >= 5;
              return (
                <View key={idx} className="w-[14.28%] items-center">
                  <Text
                    className={`text-[13px] font-bold ${
                      isWeekend ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {letter}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Weeks & Days Grid */}
          {weeks.map((week, weekIdx) => (
            <View
              key={weekIdx}
              className="flex-row items-center justify-between mb-2.5"
            >
              {week.map((dayNum, dayIdx) => {
                const isWeekend = dayIdx >= 5;

                if (!dayNum) {
                  return (
                    <View key={dayIdx} className="w-[14.28%] items-center" />
                  );
                }

                const rec = attendanceMap[dayNum];
                const isSelected = selectedDay === dayNum;

                // Color mappings based on status
                let cellBg = "bg-[#F8F9FA]";
                let textColor = "text-gray-700";

                if (rec) {
                  if (rec.status === "present") {
                    cellBg = "bg-[#10B981]";
                    textColor = "text-white";
                  } else if (rec.status === "absent") {
                    cellBg = "bg-[#EF4444]";
                    textColor = "text-white";
                  } else if (rec.status === "late") {
                    cellBg = "bg-[#F97316]";
                    textColor = "text-white";
                  } else if (rec.status === "leave") {
                    cellBg = "bg-[#4F46E5]";
                    textColor = "text-white";
                  }
                } else if (isSelected) {
                  cellBg = "bg-indigo-100 border border-[#4F46E5]";
                  textColor = "text-[#4F46E5]";
                }

                return (
                  <TouchableOpacity
                    key={dayIdx}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDay(dayNum)}
                    className="w-[14.28%] items-center justify-center"
                  >
                    {isWeekend ? (
                      // Weekend days have no container box & light muted text
                      <View className="w-[38px] h-[38px] items-center justify-center">
                        <Text className="text-[13.5px] font-medium text-gray-300">
                          {dayNum}
                        </Text>
                      </View>
                    ) : (
                      // Weekdays have squircle container
                      <View
                        className={`w-[38px] h-[38px] rounded-2xl items-center justify-center ${cellBg}`}
                      >
                        <Text className={`text-[13.5px] font-semibold ${textColor}`}>
                          {dayNum}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* "What the colours mean" Section */}
          <Text className="text-[14px] font-bold text-gray-700 mt-5 mb-3 px-1">
            What the colours mean
          </Text>

          <View className="px-1">
            {/* Row 1: Present (Green) & Absent (Red) */}
            <View className="flex-row items-center mb-2.5">
              <View className="flex-row items-center w-1/2">
                <View className="w-4 h-4 rounded-full bg-[#10B981] mr-2.5" />
                <Text className="text-[13.5px] font-medium text-gray-700">
                  Present
                </Text>
              </View>

              <View className="flex-row items-center w-1/2">
                <View className="w-4 h-4 rounded-full bg-[#EF4444] mr-2.5" />
                <Text className="text-[13.5px] font-medium text-gray-700">
                  Absent
                </Text>
              </View>
            </View>

            {/* Row 2: Late (Orange) & Leave (Blue) */}
            <View className="flex-row items-center">
              <View className="flex-row items-center w-1/2">
                <View className="w-4 h-4 rounded-full bg-[#F97316] mr-2.5" />
                <Text className="text-[13.5px] font-medium text-gray-700">
                  Late
                </Text>
              </View>

              <View className="flex-row items-center w-1/2">
                <View className="w-4 h-4 rounded-full bg-[#4F46E5] mr-2.5" />
                <Text className="text-[13.5px] font-medium text-gray-700">
                  Leave
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Card 3: Selected Day Status or Default State */}
        <View className="bg-white rounded-3xl py-4 px-6 border border-gray-100 shadow-sm items-center justify-center">
          {selectedDayRecord ? (
            <View className="items-center">
              <Text className="text-[15px] font-bold text-gray-900 text-center">
                {monthName} {selectedDay}, {year}:{" "}
                <Text className="capitalize">{selectedDayRecord.status}</Text>
              </Text>
              {selectedDayRecord.checkInTime ? (
                <Text className="text-[12px] text-gray-400 mt-0.5">
                  Check-in: {selectedDayRecord.checkInTime}
                </Text>
              ) : null}
            </View>
          ) : (
            <Text className="text-[15px] font-bold text-gray-900 text-center">
              No attendance marked yet
            </Text>
          )}
        </View>

        {/* Navigation back option */}
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mt-5 py-2.5 items-center justify-center"
        >
          <Text className="text-[13px] font-semibold text-gray-400">
            ← Return to Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
