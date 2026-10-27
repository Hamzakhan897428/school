import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { StickyHeader } from "../components/StickyHeader";
import { useI18n } from "../i18n";

export interface HomeworkItem {
  id: string;
  dateKey: string; // YYYY-MM-DD
  subject: string;
  title: string;
  assignedBy: string;
  dueTime: string;
  description: string;
  status: "pending" | "completed";
}

// Sample homework database
const MOCK_HOMEWORK: HomeworkItem[] = [
  {
    id: "HW-1",
    dateKey: "2026-10-22",
    subject: "Mathematics",
    title: "Algebra II - Quadratic Equations Exercise 4.2",
    assignedBy: "Sir Kamran Ali",
    dueTime: "Tomorrow, 08:00 AM",
    description: "Complete questions 1 to 15 on page 112 in your practice notebook.",
    status: "completed",
  },
  {
    id: "HW-2",
    dateKey: "2026-10-21",
    subject: "General Science",
    title: "Physics Lab Report - Reflection of Light",
    assignedBy: "Dr. Ayesha Tariq",
    dueTime: "Oct 22, 09:00 AM",
    description: "Submit written observations and ray diagram for Experiment 3.",
    status: "completed",
  },
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS_FULL = [
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

export default function HomeworkScreen() {
  const { selectedChild, isAuthenticated } = useAuth();
  const { t, isRTL } = useI18n();
  // Default to Friday 23 October 2026 as per reference UI
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 9, 23));
  const [liveHomework, setLiveHomework] = useState<HomeworkItem[] | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const dayOfWeekShort = DAYS_SHORT[selectedDate.getDay()];
  const dayOfWeekFull = DAYS_FULL[selectedDate.getDay()];
  const dateNum = selectedDate.getDate();
  const monthShort = MONTHS_SHORT[selectedDate.getMonth()];
  const monthFull = MONTHS_FULL[selectedDate.getMonth()];

  const formattedDateKey = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;

  const fetchDiary = useCallback(async () => {
    if (
      !selectedChild?.id ||
      selectedChild.id.startsWith("STD-DEMO") ||
      !isAuthenticated
    ) {
      return;
    }
    try {
      const data = await api.diary(selectedChild.id, formattedDateKey);
      if (data && Array.isArray(data.entries)) {
        const mapped: HomeworkItem[] = data.entries.map((e) => ({
          id: e.id,
          dateKey: e.date,
          subject: e.subject || (e.kind === "HOMEWORK" ? "Homework" : "Classwork"),
          title: e.title,
          assignedBy: e.author || "Class Mentor",
          dueTime: e.dueOn ? `Due ${e.dueOn}` : "End of Day",
          description: e.body,
          status: "pending",
        }));
        setLiveHomework(mapped);
        return;
      }
    } catch {
      // Fallback
    }
    setLiveHomework(null);
  }, [selectedChild?.id, formattedDateKey, isAuthenticated]);

  useEffect(() => {
    fetchDiary();
  }, [fetchDiary]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDiary();
    setRefreshing(false);
  };

  // Previous Day
  const handlePrevDay = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1)
    );
  };

  // Next Day
  const handleNextDay = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1)
    );
  };

  const dayHomework =
    liveHomework !== null
      ? liveHomework
      : MOCK_HOMEWORK.filter((item) => item.dateKey === formattedDateKey);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["bottom", "left", "right"]}>
      {/* Pinned Sticky Header */}
      <StickyHeader title={t("homework.screenTitle")} onBack={handleBack} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Day Navigation */}
        <View
          className={`flex-row items-center justify-between pt-1 pb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <TouchableOpacity
            onPress={isRTL ? handleNextDay : handlePrevDay}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Previous Day"
            className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center active:bg-gray-50"
          >
            <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={22} color="#1F2937" />
          </TouchableOpacity>

          <View className="items-center">
            {/* Top Primary Date: e.g. "Fri 23 Oct" */}
            <Text className="text-[19px] font-bold text-gray-900 tracking-tight">
              {dayOfWeekShort} {dateNum} {monthShort}
            </Text>
            {/* Subtitle Date: e.g. "Friday 23 October" */}
            <Text className="text-[13px] font-medium text-gray-400 mt-0.5">
              {dayOfWeekFull} {dateNum} {monthFull}
            </Text>
          </View>

          <TouchableOpacity
            onPress={isRTL ? handlePrevDay : handleNextDay}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Next Day"
            className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center active:bg-gray-50"
          >
            <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        {dayHomework.length === 0 ? (
          /* Empty State Matching Reference UI Exactly */
          <View className="bg-white rounded-3xl py-6 px-6 border border-gray-100 shadow-sm items-center justify-center mt-1">
            <Text className="text-[15.5px] font-semibold text-gray-900 text-center">
              {t("homework.nothingSetForDay")}
            </Text>
          </View>
        ) : (
          /* Homework List when tasks exist */
          <View className="mt-1">
            {dayHomework.map((hw) => (
              <View
                key={hw.id}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-3"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-[#EEF2FF] items-center justify-center mr-2.5">
                      <MaterialCommunityIcons
                        name="book-edit"
                        size={18}
                        color="#4F46E5"
                      />
                    </View>
                    <Text className="text-[13px] font-bold text-[#4F46E5]">
                      {hw.subject}
                    </Text>
                  </View>

                  <View
                    className={`px-2.5 py-1 rounded-full ${
                      hw.status === "completed"
                        ? "bg-emerald-50"
                        : "bg-amber-50"
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-bold ${
                        hw.status === "completed"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {hw.status === "completed" ? "Submitted" : "Pending"}
                    </Text>
                  </View>
                </View>

                <Text className="text-[15px] font-bold text-gray-900 mb-1">
                  {hw.title}
                </Text>
                <Text className="text-[13px] text-gray-500 leading-relaxed mb-3">
                  {hw.description}
                </Text>

                <View className="flex-row items-center justify-between pt-2 border-t border-gray-50">
                  <Text className="text-[12px] text-gray-400">
                    By {hw.assignedBy}
                  </Text>
                  <Text className="text-[12px] font-semibold text-gray-600">
                    Due: {hw.dueTime}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Return to Dashboard */}
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mt-6 py-2.5 items-center justify-center"
        >
          <Text className="text-[13px] font-semibold text-gray-400">
            ← Return to Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

