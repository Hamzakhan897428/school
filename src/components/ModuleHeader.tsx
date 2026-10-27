import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";

export interface ModuleHeaderProps {
  /** Dynamic screen title (e.g., 'Attendance', 'Homework', 'Fees', 'Result', 'Notices', 'Timetable', 'Calendar') */
  title: string;
  /** Optional secondary subtitle */
  subtitle?: string;
  /** Custom back button press handler. Defaults to router.back() with /dashboard fallback */
  onBack?: () => void;
  /** Custom settings navigation or callback. Defaults to router.push('/settings') */
  onSettings?: () => void;
  /** Custom language toggle handler. Defaults to useI18n().toggleLocale */
  onToggleLanguage?: () => void;
  /** Optional Tailwind className override */
  className?: string;
}

/**
 * ModuleHeader Component
 *
 * Dedicated header for all internal feature screens:
 * (Attendance, Homework, Fees, Result, Notices, Timetable, Calendar).
 *
 * Layout:
 * - Solid White background (bg-white) & bottom border (border-b border-gray-200)
 * - Left side: Back Navigation button (router.back()) & Screen Title
 * - Right side: Urdu / Language toggle & Settings icon button (no exit icon)
 */
export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onSettings,
  onToggleLanguage,
  className = "",
}) => {
  const insets = useSafeAreaInsets();
  const { setLocale: setAuthLocale } = useAuth();
  const { locale, toggleLocale } = useI18n();
  const isUrdu = locale === "ur";

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings();
    } else {
      router.push("/settings");
    }
  };

  const handleToggleLanguage = async () => {
    if (onToggleLanguage) {
      onToggleLanguage();
    } else {
      const nextLocale = locale === "en" ? "ur" : "en";
      await toggleLocale();
      try {
        await setAuthLocale(nextLocale);
      } catch {
        // Keep optimistic
      }
    }
  };

  // Safe area top spacing respecting status bar on Android and notch/island on iOS
  const topPadding = Platform.OS === "android" ? Math.max(insets.top, 8) + 6 : insets.top + 6;

  return (
    <View
      style={{ paddingTop: topPadding }}
      className={`w-full bg-white border-b border-gray-200 px-4 pb-3 z-50 ${className}`}
    >
      <View className="w-full flex-row items-center justify-between">
        {/* Left-Side: Back Navigation Icon & Screen Title */}
        <View className="flex-row items-center flex-1 mr-3">
          {/* Back Navigation Icon Button */}
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Back"
            accessibilityRole="button"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center mr-2.5 active:bg-gray-100"
          >
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>

          {/* Dynamic Screen Title & Optional Subtitle */}
          <View className="items-start flex-shrink">
            <Text
              numberOfLines={1}
              className="text-[18px] font-bold text-gray-900 tracking-tight"
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                numberOfLines={1}
                className="text-[11.5px] font-medium text-gray-500 mt-0.5"
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Right-Side: Urdu Toggle & Settings Icon (No Exit Icon) */}
        <View className="flex-row items-center">
          {/* 1. Urdu / Language Toggle Button */}
          <TouchableOpacity
            onPress={handleToggleLanguage}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isUrdu ? "Switch to English" : "اردو میں تبدیل کریں"}
            accessibilityRole="button"
            className="h-10 px-3 rounded-full bg-gray-50 border border-gray-200 items-center justify-center mr-2 active:bg-gray-100 flex-row"
          >
            <Ionicons name="language-outline" size={18} color="#4F46E5" />
            <Text className="text-[12.5px] font-bold text-[#4F46E5] ml-1.5">
              {isUrdu ? "EN" : "اردو"}
            </Text>
          </TouchableOpacity>

          {/* 2. Settings Icon Button */}
          <TouchableOpacity
            onPress={handleSettings}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Settings"
            accessibilityRole="button"
            className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 items-center justify-center active:bg-gray-100"
          >
            <Feather name="settings" size={18} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ModuleHeader;
