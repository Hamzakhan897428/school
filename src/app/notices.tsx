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

export interface NoticeCardItem {
  id: string;
  badge?: string;
  date: string;
  title: string;
  description: string;
  isRTL?: boolean;
}

const NOTICES_LIST: NoticeCardItem[] = [
  {
    id: "NOT-1",
    badge: "Important",
    date: "Sun 18 Oct",
    title: "Parent–teacher meeting",
    description:
      "A parent–teacher meeting will be held on the first Saturday of next month from 9:00 am to 12:00 pm. Please bring your child's diary.",
    isRTL: false,
  },
  {
    id: "NOT-2",
    date: "Fri 16 Oct",
    title: "Fee due date reminder",
    description:
      "Monthly fees are due by the 10th. Please keep the fee slip and the receipt for your records.",
    isRTL: false,
  },
  {
    id: "NOT-3",
    date: "Wed 14 Oct",
    title: "اسکول کا یوم کھیل",
    description:
      "اگلے ماہ اسکول کا سالانہ یوم کھیل منایا جائے گا۔ بچوں کو کھیل کا لباس پہنا کر بھیجیں۔",
    isRTL: true,
  },
];

export default function NoticesScreen() {
  const { selectedChild, isAuthenticated } = useAuth();
  const [notices, setNotices] = useState<NoticeCardItem[]>(NOTICES_LIST);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const fetchNotices = useCallback(async () => {
    if (
      !selectedChild?.id ||
      selectedChild.id.startsWith("STD-DEMO") ||
      !isAuthenticated
    ) {
      return;
    }
    try {
      const data = await api.notices(selectedChild.id);
      if (Array.isArray(data) && data.length > 0) {
        const mapped: NoticeCardItem[] = data.map((n) => {
          let dateStr = n.publishedAt;
          try {
            const d = new Date(n.publishedAt);
            dateStr = d.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
          } catch {}

          const hasUrdu = /[\u0600-\u06FF]/.test(n.title + n.body);

          return {
            id: n.id,
            badge: n.pinned ? "Important" : undefined,
            date: dateStr,
            title: n.title,
            description: n.body,
            isRTL: hasUrdu,
          };
        });
        setNotices(mapped);
      }
    } catch {
      // Fallback
    }
  }, [selectedChild?.id, isAuthenticated]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotices();
    setRefreshing(false);
  };

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
            Notices
          </Text>

          <View className="w-10" />
        </View>

        {/* Notices Cards List */}
        <View>
          {notices.map((notice) => (
            <View
              key={notice.id}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-3.5"
            >
              {/* Top Row: Badge (optional) & Date */}
              <View className="flex-row items-center">
                {notice.badge ? (
                  <View className="bg-[#FFEDD5] px-2.5 py-0.5 rounded-full mr-2">
                    <Text className="text-[11.5px] font-bold text-[#EA580C]">
                      {notice.badge}
                    </Text>
                  </View>
                ) : null}

                <Text className="text-[12.5px] text-gray-400 font-medium">
                  {notice.date}
                </Text>
              </View>

              {/* Title */}
              <Text
                className={`text-[16px] font-bold text-gray-900 mt-2 ${
                  notice.isRTL ? "text-right" : "text-left"
                }`}
              >
                {notice.title}
              </Text>

              {/* Description Body */}
              <Text
                className={`text-[13.5px] text-gray-600 leading-relaxed mt-1.5 ${
                  notice.isRTL ? "text-right text-[14.5px]" : "text-left"
                }`}
              >
                {notice.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Return to Dashboard */}
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
