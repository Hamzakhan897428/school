import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { downloadAndOpenPdf } from "../api/pdf";
import { StickyHeader } from "../components/StickyHeader";
import { useI18n } from "../i18n";

interface SubjectScore {
  name: string;
  obtained: number;
  total: number;
  grade: string;
}

interface TermReport {
  id: string;
  title: string;
  session: string;
  percentage: number;
  grade: string;
  status: "Passed" | "Failed";
  obtainedMarks: number;
  totalMarks: number;
  position: string;
  teacherNote: string;
  principalNote: string;
  subjects: SubjectScore[];
}

const EXAM_REPORTS: TermReport[] = [
  {
    id: "REP-2026-ANNUAL",
    title: "Annual Examination 2026",
    session: "2025–26",
    percentage: 86,
    grade: "Grade A",
    status: "Passed",
    obtainedMarks: 602,
    totalMarks: 700,
    position: "Position 1",
    teacherNote: "Outstanding work — keep it up.",
    principalNote: "Well done.",
    subjects: [
      { name: "Mathematics", obtained: 95, total: 100, grade: "A+" },
      { name: "Computer Science", obtained: 94, total: 100, grade: "A+" },
      { name: "General Science", obtained: 88, total: 100, grade: "A" },
      { name: "English Language", obtained: 85, total: 100, grade: "A" },
      { name: "Pakistan Studies", obtained: 87, total: 100, grade: "A" },
      { name: "Urdu Literature", obtained: 82, total: 100, grade: "B+" },
      { name: "Islamiat / Ethics", obtained: 71, total: 100, grade: "B" },
    ],
  },
  {
    id: "REP-2025-ANNUAL",
    title: "Annual result",
    session: "2025–26",
    percentage: 86,
    grade: "Grade A",
    status: "Passed",
    obtainedMarks: 602,
    totalMarks: 700,
    position: "Position 1",
    teacherNote: "Outstanding work — keep it up.",
    principalNote: "Well done.",
    subjects: [
      { name: "Mathematics", obtained: 95, total: 100, grade: "A+" },
      { name: "Computer Science", obtained: 94, total: 100, grade: "A+" },
      { name: "General Science", obtained: 88, total: 100, grade: "A" },
      { name: "English Language", obtained: 85, total: 100, grade: "A" },
      { name: "Pakistan Studies", obtained: 87, total: 100, grade: "A" },
      { name: "Urdu Literature", obtained: 82, total: 100, grade: "B+" },
      { name: "Islamiat / Ethics", obtained: 71, total: 100, grade: "B" },
    ],
  },
];

export default function ResultsScreen() {
  const { selectedChild, isAuthenticated } = useAuth();
  const { t, isRTL } = useI18n();
  const [reports, setReports] = useState<TermReport[]>(EXAM_REPORTS);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const fetchResults = useCallback(async () => {
    if (
      !selectedChild?.id ||
      selectedChild.id.startsWith("STD-DEMO") ||
      !isAuthenticated
    ) {
      return;
    }
    try {
      const data = await api.results(selectedChild.id);
      if (Array.isArray(data) && data.length > 0) {
        const mapped: TermReport[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          session: item.yearName,
          percentage: Math.round(item.percentage),
          grade: `Grade ${item.grade}`,
          status: item.passed ? "Passed" : "Failed",
          obtainedMarks: item.totalObtained,
          totalMarks: item.totalMax,
          position: item.rank ? `Position ${item.rank}` : "Position 1",
          teacherNote:
            item.teacherRemark || "Outstanding work — keep it up.",
          principalNote: item.principalRemark || "Well done.",
          subjects: (item.subjects || []).map((s) => ({
            name: s.name,
            obtained: s.obtained,
            total: s.max,
            grade: s.grade,
          })),
        }));
        setReports(mapped);
      }
    } catch {
      // Keep optimistic fallback
    }
  }, [selectedChild?.id, isAuthenticated]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResults();
    setRefreshing(false);
  };

  const toggleSubjects = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenReportCard = async (report: TermReport) => {
    try {
      if (
        selectedChild?.id &&
        !selectedChild.id.startsWith("STD-DEMO") &&
        isAuthenticated
      ) {
        await downloadAndOpenPdf(
          `/parent/children/${selectedChild.id}/results/${report.id}/report-card`,
          `report-card-${report.session || report.title}.pdf`
        );
      } else {
        await downloadAndOpenPdf(
          `/parent/children/sample/results/${report.id}/report-card`,
          `report-card-${report.session || "2026"}.pdf`
        );
      }
    } catch {
      Alert.alert(
        "Report Card",
        `Opening official transcript and report card for ${report.title} (${report.session}).`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["bottom", "left", "right"]}>
      {/* Pinned Sticky Header */}
      <StickyHeader title={t("results.screenTitle")} onBack={handleBack} />

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
        {/* Results Cards List */}
        <View>
          {reports.map((report) => {
            const isExpanded = !!expandedCards[report.id];

            return (
              <View
                key={report.id}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4"
              >
                {/* Title & Academic Session */}
                <Text className="text-[16px] font-bold text-gray-900">
                  {report.title}
                </Text>
                <Text className="text-[12px] text-gray-400 font-medium mt-0.5">
                  {report.session}
                </Text>

                {/* Percentage & Status Pills */}
                <View className="flex-row items-center mt-2 mb-1">
                  <Text className="text-[32px] font-extrabold text-gray-900 tracking-tight mr-3">
                    {report.percentage}%
                  </Text>

                  <View className="flex-row items-center space-x-1.5">
                    {/* Grade Pill */}
                    <View className="bg-[#EEF2FF] px-2.5 py-1 rounded-full mr-1.5">
                      <Text className="text-[11.5px] font-bold text-[#4F46E5]">
                        {report.grade}
                      </Text>
                    </View>

                    {/* Passed / Failed Pill */}
                    <View
                      className={`px-2.5 py-1 rounded-full ${
                        report.status === "Passed" ? "bg-[#D1FAE5]" : "bg-red-100"
                      }`}
                    >
                      <Text
                        className={`text-[11.5px] font-bold ${
                          report.status === "Passed"
                            ? "text-[#059669]"
                            : "text-red-600"
                        }`}
                      >
                        {report.status === "Passed"
                          ? t("status.passed")
                          : t("status.failed")}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Marks Out Of & Position */}
                <Text className="text-[13px] text-gray-500 font-medium mt-0.5">
                  {report.obtainedMarks} out of {report.totalMarks}
                </Text>
                <Text className="text-[13px] font-bold text-gray-900 mt-0.5">
                  {report.position}
                </Text>

                {/* Subjects Accordion Trigger */}
                <TouchableOpacity
                  onPress={() => toggleSubjects(report.id)}
                  activeOpacity={0.7}
                  className="bg-[#F8F9FA] rounded-2xl py-3 px-4 flex-row items-center justify-between my-3.5"
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name={isExpanded ? "caret-down" : "caret-forward"}
                      size={13}
                      color="#1F2937"
                    />
                    <Text className="text-[13.5px] font-bold text-gray-800 ml-2">
                      Subjects
                    </Text>
                  </View>

                  <Text className="text-[11.5px] text-gray-400 font-medium">
                    {isExpanded ? "Hide marks" : `${report.subjects.length} subjects`}
                  </Text>
                </TouchableOpacity>

                {/* Expanded Subjects Breakdown */}
                {isExpanded && (
                  <View className="bg-[#F8F9FA] rounded-2xl p-3.5 mb-3.5">
                    {report.subjects.map((sub, idx) => (
                      <View
                        key={idx}
                        className="flex-row items-center justify-between py-1 border-b border-gray-100 last:border-b-0"
                      >
                        <Text className="text-[13px] font-medium text-gray-700">
                          {sub.name}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-[13px] font-bold text-gray-900 mr-2">
                            {sub.obtained}/{sub.total}
                          </Text>
                          <View className="bg-white px-2 py-0.5 rounded-md border border-gray-100">
                            <Text className="text-[10.5px] font-bold text-gray-600">
                              {sub.grade}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Teacher's Note */}
                <Text className="text-[12.5px] text-gray-600 leading-relaxed mb-1">
                  <Text className="font-bold text-gray-800">
                    {t("results.teacherRemark")}:
                  </Text>{" "}
                  {report.teacherNote}
                </Text>

                {/* Principal's Note */}
                <Text className="text-[12.5px] text-gray-600 leading-relaxed mb-4">
                  <Text className="font-bold text-gray-800">
                    {t("results.principalRemark")}:
                  </Text>{" "}
                  {report.principalNote}
                </Text>

                {/* "Open report card" Outline Button */}
                <TouchableOpacity
                  onPress={() => handleOpenReportCard(report)}
                  activeOpacity={0.7}
                  className="w-full border border-gray-200 rounded-2xl py-3 flex-row items-center justify-center bg-white"
                >
                  <Ionicons
                    name="document-text-outline"
                    size={17}
                    color="#1F2937"
                  />
                  <Text className="text-[14px] font-bold text-gray-800 ml-2">
                    {t("results.openReportCard")}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Bottom Return Action */}
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mt-2 py-2.5 items-center justify-center"
        >
          <Text className="text-[13px] font-semibold text-gray-400">
            ← Return to Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
