import React from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";

export interface ScreenHeaderProps {
  /** Screen title displayed centered (e.g., 'Attendance', 'Homework', 'Fees', 'Results', 'Timetable', 'Calendar', 'Notices') */
  title: string;
  /** Optional secondary subtitle text */
  subtitle?: string;
  /** Whether to show the circular back button. Defaults to true */
  showBack?: boolean;
  /** Custom back button press handler. Defaults to router.back() with fallback */
  onBack?: () => void;
  /** Optional custom right-side element (e.g., badge, action icon, filter button) */
  rightAction?: React.ReactNode;
  /** Optional additional Tailwind classes for container customization */
  className?: string;
  /** Optional inline style override */
  style?: StyleProp<ViewStyle>;
}

/**
 * ScreenHeader Component
 *
 * A clean, balanced navigation header for React Native & Expo Router apps.
 * - Left: Circular back button with a chevron-left icon
 * - Center: Dynamic title text perfectly centered
 * - Right: Balanced spacer or custom action node so the title remains centered
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  className = "",
  style,
}) => {
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

  return (
    <View
      style={style}
      className={`w-full flex-row items-center justify-between pt-2 pb-3 mb-2 px-1 ${className}`}
    >
      {/* Left Slot: Circular Back Button or Spacer */}
      <View className="w-10 items-start justify-center">
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center"
          >
            <Ionicons name="arrow-back" size={21} color="#1F2937" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center Slot: Dynamic Title & Subtitle */}
      <View className="flex-1 items-center justify-center px-2">
        <Text
          numberOfLines={1}
          className="text-[17px] font-bold text-gray-900 tracking-tight text-center"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            className="text-[12px] font-medium text-gray-400 mt-0.5 text-center"
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right Slot: Custom Action or Symmetrical Spacer to ensure Title is dead-center */}
      <View className="w-10 items-end justify-center">
        {rightAction ? rightAction : <View className="w-10" />}
      </View>
    </View>
  );
};

export default ScreenHeader;
