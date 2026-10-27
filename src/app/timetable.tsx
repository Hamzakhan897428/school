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

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export interface PeriodSlot {
  id: string;
  isBreak?: boolean;
  breakLabel?: string;
  startTime?: string;
  endTime?: string;
  subject?: string;
  teacher?: string;
}

const WEEK_DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIMETABLE_DATA: Record<WeekDay, PeriodSlot[]> = {
  Mon: [
    {
      id: "MON-1",
      startTime: "8:00",
      endTime: "8:40",
      subject: "Science",
      teacher: "Waqar Ahmed",
    },
    {
      id: "MON-2",
      startTime: "8:40",
      endTime: "9:20",
      subject: "Urdu",
      teacher: "Rubina Akhtar",
    },
    {
      id: "MON-3",
      startTime: "9:20",
      endTime: "10:00",
      subject: "English",
      teacher: "Sadia Iqbal",
    },
    {
      id: "MON-BREAK",
      isBreak: true,
      breakLabel: "Break · 10:00",
    },
    {
      id: "MON-4",
      startTime: "10:20",
      endTime: "11:00",
      subject: "Mathematics",
      teacher: "Kamran Ashraf",
    },
    {
      id: "MON-5",
      startTime: "11:00",
      endTime: "11:40",
      subject: "Urdu",
      teacher: "Rubina Akhtar",
    },
  ],
  Tue: [
    {
      id: "TUE-1",
      startTime: "8:00",
      endTime: "8:40",
      subject: "Mathematics",
      teacher: "Kamran Ashraf",
    },
    {
      id: "TUE-2",
      startTime: "8:40",
      endTime: "9:20",
      subject: "English",
      teacher: "Sadia Iqbal",
    },
    {
      id: "TUE-3",
      startTime: "9:20",
      endTime: "10:00",
      subject: "Science",
      teacher: "Waqar Ahmed",
    },
    {
      id: "TUE-BREAK",
      isBreak: true,
      breakLabel: "Break · 10:00",
    },
    {
      id: "TUE-4",
      startTime: "10:20",
      endTime: "11:00",
      subject: "Computer",
      teacher: "Bilal Qureshi",
    },
    {
      id: "TUE-5",
      startTime: "11:00",
      endTime: "11:40",
      subject: "Pak Studies",
      teacher: "Hina Nadeem",
    },
  ],
  Wed: [
    {
      id: "WED-1",
      startTime: "8:00",
      endTime: "8:40",
      subject: "Urdu",
      teacher: "Rubina Akhtar",
    },
    {
      id: "WED-2",
      startTime: "8:40",
      endTime: "9:20",
      subject: "Science",
      teacher: "Waqar Ahmed",
    },
    {
      id: "WED-3",
      startTime: "9:20",
      endTime: "10:00",
      subject: "Mathematics",
      teacher: "Kamran Ashraf",
    },
    {
      id: "WED-BREAK",
      isBreak: true,
      breakLabel: "Break · 10:00",
    },
    {
      id: "WED-4",
      startTime: "10:20",
      endTime: "11:00",
      subject: "English",
      teacher: "Sadia Iqbal",
    },
    {
      id: "WED-5",
      startTime: "11:00",
      endTime: "11:40",
      subject: "Islamiat",
      teacher: "Qari Tariq",
    },
  ],
  Thu: [
    {
      id: "THU-1",
      startTime: "8:00",
      endTime: "8:40",
      subject: "Science",
      teacher: "Waqar Ahmed",
    },
    {
      id: "THU-2",
      startTime: "8:40",
      endTime: "9:20",
      subject: "Mathematics",
      teacher: "Kamran Ashraf",
    },
    {
      id: "THU-3",
      startTime: "9:20",
      endTime: "10:00",
      subject: "Computer",
      teacher: "Bilal Qureshi",
    },
    {
      id: "THU-BREAK",
      isBreak: true,
      breakLabel: "Break · 10:00",
    },
    {
      id: "THU-4",
      startTime: "10:20",
      endTime: "11:00",
      subject: "Urdu",
      teacher: "Rubina Akhtar",
    },
    {
      id: "THU-5",
      startTime: "11:00",
      endTime: "11:40",
      subject: "English",
      teacher: "Sadia Iqbal",
    },
  ],
  Fri: [
    {
      id: "FRI-1",
      startTime: "8:00",
      endTime: "8:40",
      subject: "English",
      teacher: "Sadia Iqbal",
    },
    {
      id: "FRI-2",
      startTime: "8:40",
      endTime: "9:20",
      subject: "Mathematics",
      teacher: "Kamran Ashraf",
    },
    {
      id: "FRI-3",
      startTime: "9:20",
      endTime: "10:00",
      subject: "Urdu",
      teacher: "Rubina Akhtar",
    },
    {
      id: "FRI-BREAK",
      isBreak: true,
      breakLabel: "Break · 10:00",
    },
    {
      id: "FRI-4",
      startTime: "10:20",
      endTime: "11:00",
      subject: "Islamiat",
      teacher: "Qari Tariq",
    },
    {
      id: "FRI-5",
      startTime: "11:00",
      endTime: "11:40",
      subject: "Science",
      teacher: "Waqar Ahmed",
    },
  ],
  Sat: [
    {
      id: "SAT-1",
      startTime: "8:30",
      endTime: "9:30",
      subject: "Physical Education & Sports",
      teacher: "Coach Farhan",
    },
    {
      id: "SAT-2",
      startTime: "9:30",
      endTime: "10:30",
      subject: "Art & Calligraphy",
      teacher: "Ms. Zainab",
    },
    {
      id: "SAT-BREAK",
      isBreak: true,
      breakLabel: "Break · 10:30",
    },
    {
      id: "SAT-3",
      startTime: "11:00",
      endTime: "12:00",
      subject: "Library & Reading Club",
      teacher: "Librarian Nasir",
    },
  ],
};

export default function TimetableScreen() {
  const { selectedChild, isAuthenticated } = useAuth();
  const [selectedDay, setSelectedDay] = useState<WeekDay>("Mon");
  const [liveTimetable, setLiveTimetable] = useState<Record<
    WeekDay,
    PeriodSlot[]
  > | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const fetchTimetable = useCallback(async () => {
    if (
      !selectedChild?.id ||
      selectedChild.id.startsWith("STD-DEMO") ||
      !isAuthenticated
    ) {
      return;
    }
    try {
      const data = await api.timetable(selectedChild.id);
      if (
        data &&
        Array.isArray(data.periods) &&
        data.periods.length > 0
      ) {
        const weekdayMap: Record<number, WeekDay> = {
          1: "Mon",
          2: "Tue",
          3: "Wed",
          4: "Thu",
          5: "Fri",
          6: "Sat",
        };

        const result: Record<WeekDay, PeriodSlot[]> = {
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        };

        const daysArr: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        daysArr.forEach((dName) => {
          const dayNumber = Object.keys(weekdayMap).find(
            (k) => weekdayMap[Number(k)] === dName
          );
          const dayInt = dayNumber ? Number(dayNumber) : 1;

          data.periods.forEach((period) => {
            if (period.isBreak) {
              result[dName].push({
                id: `${dName}-${period.id}`,
                isBreak: true,
                breakLabel: `Break · ${period.startTime}`,
              });
            } else {
              const lesson = (data.lessons || []).find(
                (l) => l.weekday === dayInt && l.periodId === period.id
              );
              if (lesson) {
                result[dName].push({
                  id: `${dName}-${period.id}`,
                  startTime: period.startTime,
                  endTime: period.endTime,
                  subject: lesson.subject,
                  teacher: lesson.teacher || "Faculty",
                });
              }
            }
          });
        });

        setLiveTimetable(result);
        return;
      }
    } catch {
      // Fallback
    }
    setLiveTimetable(null);
  }, [selectedChild?.id, isAuthenticated]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTimetable();
    setRefreshing(false);
  };

  const scheduleMap = liveTimetable || TIMETABLE_DATA;
  const currentSlots = scheduleMap[selectedDay] && scheduleMap[selectedDay].length > 0
    ? scheduleMap[selectedDay]
    : TIMETABLE_DATA[selectedDay] || [];

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Header Navigation with Backstack Icon */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Back"
            className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center"
          >
            <Ionicons name="arrow-back" size={21} color="#1F2937" />
          </TouchableOpacity>

          <Text className="text-[17px] font-bold text-gray-900 tracking-tight">
            Timetable
          </Text>

          <View className="w-10" />
        </View>

        {/* Day Selector Pills */}
        <View className="flex-row items-center justify-between mb-5">
          {WEEK_DAYS.map((day) => {
            const isActive = selectedDay === day;
            return (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(day)}
                activeOpacity={0.8}
                className={`flex-1 mx-1 py-3 rounded-2xl items-center justify-center ${
                  isActive
                    ? "bg-[#4645F6] shadow-sm"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
              >
                <Text
                  className={`text-[13.5px] font-bold ${
                    isActive ? "text-white" : "text-gray-800"
                  }`}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Timetable Slots List */}
        <View>
          {currentSlots.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm items-center justify-center my-6">
              <Text className="text-[16px] font-bold text-gray-800">
                No classes scheduled
              </Text>
              <Text className="text-[13px] text-gray-400 mt-1">
                Enjoy your off day!
              </Text>
            </View>
          ) : (
            currentSlots.map((slot, index) => {
              // Break Card
              if (slot.isBreak) {
                return (
                  <View
                    key={`${slot.id || "break"}-${index}`}
                    className="bg-[#F8F9FA] rounded-2xl py-3 px-4 border border-gray-100 mb-3 items-center justify-center"
                  >
                    <Text className="text-[14px] font-medium text-gray-600">
                      {slot.breakLabel}
                    </Text>
                  </View>
                );
              }

              // Class Period Card
              return (
                <View
                  key={`${slot.id || "slot"}-${index}`}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-3 flex-row items-center"
                >
                  {/* Time Column */}
                  <View className="w-20 pr-2">
                    <Text className="text-[17px] font-bold text-gray-900 leading-tight">
                      {slot.startTime}
                    </Text>
                    <Text className="text-[12.5px] font-medium text-gray-400 mt-0.5">
                      {slot.endTime}
                    </Text>
                  </View>

                  {/* Vertical Divider / Spacer */}
                  <View className="w-px h-8 bg-gray-100 mr-4" />

                  {/* Subject & Teacher */}
                  <View className="flex-1">
                    <Text className="text-[16px] font-bold text-gray-900 leading-tight">
                      {slot.subject}
                    </Text>
                    <Text className="text-[13px] font-medium text-gray-500 mt-0.5">
                      {slot.teacher}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Bottom Return Action */}
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mt-3 py-2.5 items-center justify-center"
        >
          <Text className="text-[13px] font-semibold text-gray-400">
            ← Return to Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
