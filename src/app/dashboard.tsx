import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { AcademicModulesGrid } from "../components/AcademicModulesGrid";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { ChildSummary } from "../types/api";

export default function DashboardScreen() {
  const { selectedChild, user, logout, setLocale } = useAuth();
  const [isUrdu, setIsUrdu] = useState<boolean>(user?.locale === "ur");
  const [summary, setSummary] = useState<ChildSummary | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Sync locale state with user profile
  useEffect(() => {
    if (user?.locale) {
      setIsUrdu(user.locale === "ur");
    }
  }, [user?.locale]);

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
    const nextUrdu = !isUrdu;
    setIsUrdu(nextUrdu);
    setLocale(nextUrdu ? "ur" : "en");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleSignOut = async () => {
    Alert.alert(
      isUrdu ? "سائن آؤٹ" : "Sign Out",
      isUrdu
        ? "کیا آپ پورٹل سے سائن آؤٹ کرنا چاہتے ہیں؟"
        : "Are you sure you want to sign out?",
      [
        { text: isUrdu ? "منسوخ کریں" : "Cancel", style: "cancel" },
        {
          text: isUrdu ? "سائن آؤٹ" : "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
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
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top App Bar: Toggles between English & Urdu (RTL) Layout */}
        {isUrdu ? (
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              {/* Settings Gear Button on Left in RTL */}
              <TouchableOpacity
                onPress={handleSettings}
                activeOpacity={0.7}
                accessibilityLabel="Settings"
                className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center mr-2"
              >
                <Feather name="settings" size={18} color="#1F2937" />
              </TouchableOpacity>

              {/* Language Toggle: English in RTL */}
              <TouchableOpacity
                onPress={toggleLanguage}
                activeOpacity={0.7}
                className="bg-white border border-gray-100 px-4 py-1.5 rounded-full shadow-xs"
              >
                <Text className="text-[13.5px] font-bold text-[#4F46E5]">
                  English
                </Text>
              </TouchableOpacity>
            </View>

            {/* Name and Chevron Right on Right in RTL */}
            <View className="flex-row items-center">
              <Text className="text-[19px] font-bold text-gray-900 tracking-tight mr-3">
                {childFirstName}
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                activeOpacity={0.7}
                accessibilityLabel="Sign out"
                className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center"
              >
                <Feather name="chevron-right" size={20} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleSignOut}
                activeOpacity={0.7}
                accessibilityLabel="Sign out"
                className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center mr-3"
              >
                <Feather name="chevron-left" size={20} color="#1F2937" />
              </TouchableOpacity>

              <Text className="text-[19px] font-bold text-gray-900 tracking-tight">
                {childFirstName}
              </Text>
            </View>

            <View className="flex-row items-center space-x-2">
              <TouchableOpacity
                onPress={toggleLanguage}
                activeOpacity={0.7}
                className="bg-white border border-gray-100 px-4 py-1.5 rounded-full shadow-xs mr-2"
              >
                <Text className="text-[13.5px] font-bold text-[#4F46E5]">
                  اردو
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSettings}
                activeOpacity={0.7}
                accessibilityLabel="Settings"
                className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center"
              >
                <Feather name="settings" size={18} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>
        )}

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
