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

export interface MainHeaderProps {
  /** Screen branding title or greeting (e.g., student name "Ahmed") */
  title?: string;
  /** Optional secondary subtitle or greeting text */
  subtitle?: string;
  /** Custom settings handler. Defaults to router.push('/settings') */
  onSettings?: () => void;
  /** Custom language toggle handler. If omitted, default useI18n().toggleLocale is used */
  onToggleLanguage?: () => void;
  /** Optional Tailwind className override */
  className?: string;
}

/**
 * MainHeader Component (Dashboard / Main Screen)
 *
 * - Left (LTR) / Right (RTL): Screen branding / greeting (e.g., "Ahmed")
 * - Right (LTR) / Left (RTL): Language toggle badge and Settings icon button
 * - Clean UI spacing: Guaranteed uniform gap in both English and Urdu (RTL) modes
 * - Exit icon removed; Settings icon (⚙️) added routing to /settings
 */
export const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  subtitle,
  onSettings,
  onToggleLanguage,
  className = "",
}) => {
  const insets = useSafeAreaInsets();
  const { selectedChild, setLocale: setAuthLocale } = useAuth();
  const { locale, isRTL, toggleLocale } = useI18n();

  const isUrdu = locale === "ur";
  const displayTitle = title || selectedChild?.firstName || "Ahmed";

  const handleLanguageToggle = async () => {
    if (onToggleLanguage) {
      onToggleLanguage();
    } else {
      const nextLang = locale === "en" ? "ur" : "en";
      await toggleLocale();
      try {
        await setAuthLocale(nextLang);
      } catch {
        // Keep optimistic
      }
    }
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings();
    } else {
      router.push("/settings");
    }
  };

  const topPadding = Platform.OS === "android" ? Math.max(insets.top, 8) + 6 : insets.top + 6;

  return (
    <View
      style={{ paddingTop: topPadding }}
      className={`w-full px-5 pb-3 bg-[#F8F9FA] ${className}`}
    >
      <View
        className={`w-full flex-row items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        {/* Branding / Student Name */}
        <View className={`flex-1 justify-center ${isRTL ? "ml-3" : "mr-3"}`}>
          <Text
            numberOfLines={1}
            className={`text-[22px] font-bold text-gray-900 tracking-tight ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {displayTitle}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              className={`text-[12.5px] font-medium text-gray-500 mt-0.5 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Action Group: Urdu Toggle and Settings Icon (Exit removed, Setting added) */}
        <View
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Language Toggle Badge */}
          <TouchableOpacity
            onPress={handleLanguageToggle}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isUrdu ? "Switch to English" : "اردو میں تبدیل کریں"}
            accessibilityRole="button"
            className="bg-white border border-gray-200 px-3.5 py-1.5 rounded-full shadow-xs active:bg-gray-50 flex-row items-center"
          >
            <Ionicons
              name="globe-outline"
              size={14}
              color="#4F46E5"
              style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}
            />
            <Text className="text-[13px] font-bold text-[#4F46E5]">
              {isUrdu ? "English" : "اردو"}
            </Text>
          </TouchableOpacity>

          {/* Settings Icon Button (Replacing Exit Icon) */}
          <TouchableOpacity
            onPress={handleSettings}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Settings"
            accessibilityRole="button"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center active:bg-gray-100"
          >
            <Feather name="settings" size={18} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MainHeader;
