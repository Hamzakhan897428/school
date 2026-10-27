import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { MainHeader } from "../components/MainHeader";
import { AcademicModulesGrid } from "../components/AcademicModulesGrid";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { ChildSummary } from "../types/api";
import { useI18n } from "../i18n";

export default function DashboardScreen() {
  const { selectedChild } = useAuth();
  const { t, locale, isRTL, toggleLocale } = useI18n();
  const isUrdu = isRTL;
  const [summary, setSummary] = useState<ChildSummary | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch live summary for selected child
  const fetchSummary = useCallback(async () => {
    if (!selectedChild?.id) return;
    try {
      const data = await api.summary(selectedChild.id);
      setSummary(data);
    } catch {
      // Keep optimistic UI fallback if offline
    }
  }, [selectedChild?.id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  };

  const toggleLanguage = () => {
    toggleLocale();
  };

  // Dynamic child info with fallbacks
  const childFirstName = selectedChild?.firstName || "Faizan";
  const childFullName = selectedChild?.name || "Faizan Abbasi";
  const childClass = selectedChild?.classLabel || "Class Grade 7 A";
  const childSchool =
    selectedChild?.school?.name || "Greenfield Grammar School";
  const avatarLetter = (
    selectedChild?.firstName?.[0] ||
    selectedChild?.name?.[0] ||
    "F"
  ).toUpperCase();

  // Dynamic Attendance summary
  const attendanceWorking = summary?.attendance?.working ?? false;
  const attendanceHoliday = summary?.attendance?.holiday;
  const attendanceMonthPct = summary?.attendance?.monthPct ?? 100;

  let attendancePillText = isUrdu ? "آج اسکول بند ہے" : "School is closed today";
  if (attendanceWorking) {
    if (summary?.attendance?.status) {
      attendancePillText = summary.attendance.status;
    } else {
      attendancePillText = isUrdu ? "آج کی حاضری" : "Attendance today";
    }
  } else if (attendanceHoliday) {
    attendancePillText = attendanceHoliday;
  }

  // Dynamic Fees summary
  const totalFeesDue =
    summary?.fees?.dueTotalPkr !== undefined
      ? `Rs. ${Math.round(summary.fees.dueTotalPkr).toLocaleString()}`
      : "Rs. 22,500";
  const overdueCount = summary?.fees?.overdueCount ?? 1;
  const nextDueDateText = summary?.fees?.nextDueOn
    ? isUrdu
      ? `اگلی آخری تاریخ: ${summary.fees.nextDueOn}`
      : `Next due date ${summary.fees.nextDueOn}`
    : isUrdu
    ? "اگلی آخری تاریخ: جمعرات، 10 ستمبر"
    : "Next due date Thu 10 Sept";

  // Dynamic Next Exam summary
  const nextExamText = summary?.nextExam
    ? `${summary.nextExam.subject} (${summary.nextExam.examName})`
    : isUrdu
    ? "کوئی امتحان قریب نہیں"
    : "No exam coming up";

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["bottom", "left", "right"]}>
      {/* Pinned Main Header */}
      <MainHeader title={childFirstName} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Card 1: Student Profile */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-3.5 flex-row items-center">
          {isUrdu ? (
            <>
              {/* Info on Left (Right-aligned text) in RTL */}
              <View className="flex-1 mr-4">
                <Text className="text-[18px] font-bold text-gray-900 text-right">
                  {childFullName}
                </Text>
                <Text className="text-[13.5px] text-gray-500 font-medium mt-0.5 text-right">
                  کلاس {childClass.replace("Class ", "")}
                </Text>
                <Text className="text-[13.5px] font-semibold text-[#4F46E5] mt-0.5 text-right">
                  {childSchool}
                </Text>
              </View>

              {/* Avatar on Right in RTL */}
              <View className="w-16 h-16 rounded-full bg-[#EEF2FF] items-center justify-center">
                <Text className="text-[24px] font-bold text-[#4F46E5]">
                  {avatarLetter}
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Avatar on Left in LTR */}
              <View className="w-16 h-16 rounded-full bg-[#EEF2FF] items-center justify-center mr-4">
                <Text className="text-[24px] font-bold text-[#4F46E5]">
                  {avatarLetter}
                </Text>
              </View>

              {/* Student Info on Right in LTR */}
              <View className="flex-1">
                <Text className="text-[18px] font-bold text-gray-900">
                  {childFullName}
                </Text>
                <Text className="text-[13.5px] text-gray-500 font-medium mt-0.5">
                  {childClass}
                </Text>
                <Text className="text-[13.5px] font-semibold text-[#4F46E5] mt-0.5">
                  {childSchool}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Card 2: Attendance Today */}
        <TouchableOpacity
          onPress={() => router.push("/attendance")}
          activeOpacity={0.7}
          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-3.5"
        >
          <Text
            className={`text-[14px] font-medium text-gray-600 mb-2.5 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {isUrdu ? "آج کی حاضری" : "Attendance today"}
          </Text>

          <View
            className={`bg-[#F1F5F9] px-3.5 py-1.5 rounded-full mb-3 ${
              isUrdu ? "self-end" : "self-start"
            }`}
          >
            <Text className="text-[13px] font-medium text-gray-600">
              {attendancePillText}
            </Text>
          </View>

          <Text
            className={`text-[14px] font-medium text-gray-800 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {isUrdu
              ? `اس مہینے: ${attendanceMonthPct}% حاضر`
              : `This month: ${attendanceMonthPct}% present`}
          </Text>
        </TouchableOpacity>

        {/* Card 3: Fees */}
        <TouchableOpacity
          onPress={() => router.push("/fees")}
          activeOpacity={0.7}
          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-3.5"
        >
          <Text
            className={`text-[14px] font-medium text-gray-600 mb-1 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {isUrdu ? "فیس" : "Fees"}
          </Text>

          <Text
            className={`text-[26px] font-extrabold text-gray-900 tracking-tight ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {totalFeesDue}
          </Text>

          <Text
            className={`text-[13.5px] text-gray-500 font-medium mt-0.5 mb-2.5 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {isUrdu ? "کل ادا کرنے کی رقم" : "Total to pay"}
          </Text>

          {overdueCount > 0 ? (
            <View
              className={`bg-[#FEE2E2] px-3 py-1 rounded-full mb-2.5 ${
                isUrdu ? "self-end" : "self-start"
              }`}
            >
              <Text className="text-[12.5px] font-semibold text-[#EF4444]">
                {isUrdu
                  ? `${overdueCount} کی آخری تاریخ گزر چکی ہے`
                  : `${overdueCount} past the due date`}
              </Text>
            </View>
          ) : null}

          <Text
            className={`text-[13px] text-gray-400 font-normal ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {nextDueDateText}
          </Text>
        </TouchableOpacity>

        {/* Card 4: Next Exam */}
        <TouchableOpacity
          onPress={() => router.push("/calendar")}
          activeOpacity={0.7}
          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4"
        >
          <Text
            className={`text-[14px] font-medium text-gray-600 mb-2 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {isUrdu ? "اگلا امتحان" : "Next exam"}
          </Text>

          <Text
            className={`text-[16px] font-bold text-gray-900 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {nextExamText}
          </Text>
        </TouchableOpacity>

        {/* Academic Modules Grid (Passes isUrdu Prop) */}
        <View className="mt-1">
          <AcademicModulesGrid isUrdu={isUrdu} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
