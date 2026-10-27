import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppCard } from "./AppCard";
import { TimetableSlot } from "../types/portal";
import { THEME } from "../theme/colors";

interface TimetableCardProps {
  slot: TimetableSlot;
  slotNumber?: number;
  className?: string;
}

const THEME_STYLES: Record<
  string,
  { border: string; iconBg: string; text: string; iconColor: string }
> = {
  indigo: {
    border: "border-l-4 border-l-primary",
    iconBg: "bg-primary-soft",
    text: "text-primary",
    iconColor: THEME.primary,
  },
  emerald: {
    border: "border-l-4 border-l-status-success",
    iconBg: "bg-status-success-bg",
    text: "text-status-success",
    iconColor: THEME.success,
  },
  amber: {
    border: "border-l-4 border-l-status-warning",
    iconBg: "bg-status-warning-bg",
    text: "text-status-warning",
    iconColor: THEME.warning,
  },
  rose: {
    border: "border-l-4 border-l-status-danger",
    iconBg: "bg-status-danger-bg",
    text: "text-status-danger",
    iconColor: THEME.danger,
  },
  sky: {
    border: "border-l-4 border-l-primary",
    iconBg: "bg-primary-soft",
    text: "text-primary",
    iconColor: THEME.primary,
  },
  purple: {
    border: "border-l-4 border-l-primary",
    iconBg: "bg-primary-soft",
    text: "text-primary",
    iconColor: THEME.primary,
  },
};

export const TimetableCard: React.FC<TimetableCardProps> = ({
  slot,
  slotNumber,
  className = "",
}) => {
  // Break / Recess Indicator Card
  if (slot.isBreak) {
    return (
      <View
        className={`w-full bg-status-warning-bg rounded-3xl p-4 my-2 border border-dashed border-amber-300/80 flex-row items-center justify-between shadow-xs ${className}`}
      >
        <View className="flex-row items-center flex-1">
          <View className="w-11 h-11 rounded-2xl bg-card items-center justify-center mr-3.5">
            <Feather name="coffee" size={20} color={THEME.warning} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-bold text-main tracking-tight">
              {slot.breakTitle || "Break / Recess"}
            </Text>
            <Text className="text-[12px] text-muted mt-0.5">
              Recharge, cafeteria snacks & courtyard access
            </Text>
          </View>
        </View>

        <View className="bg-card px-3 py-1 rounded-full border border-border">
          <Text className="text-[12px] font-bold text-status-warning">
            {slot.startTime} - {slot.endTime}
          </Text>
        </View>
      </View>
    );
  }

  const theme = THEME_STYLES[slot.colorTheme || "indigo"] || THEME_STYLES.indigo;
  const iconName = (slot.iconName as keyof typeof Feather.glyphMap) || "book-open";

  return (
    <AppCard className={`mb-3.5 ${theme.border} ${className}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1 mr-3">
          {/* Subject Icon Squircle */}
          <View
            className={`w-12 h-12 rounded-2xl ${theme.iconBg} items-center justify-center mr-3.5`}
          >
            <Feather name={iconName} size={22} color={theme.iconColor} />
          </View>

          {/* Subject & Code */}
          <View className="flex-1">
            <View className="flex-row items-center">
              {slotNumber && (
                <Text className="text-[11.5px] font-bold text-light uppercase mr-1.5">
                  Period {slotNumber} •
                </Text>
              )}
              {slot.code && (
                <Text className="text-[11.5px] font-semibold text-light">
                  {slot.code}
                </Text>
              )}
            </View>

            <Text
              numberOfLines={1}
              className="text-[16px] font-bold text-main tracking-tight mt-0.5"
            >
              {slot.subject}
            </Text>

            {/* Teacher Details */}
            {slot.teacher && (
              <View className="flex-row items-center mt-1.5">
                <Feather name="user" size={13} color={THEME.muted} />
                <Text
                  numberOfLines={1}
                  className="text-[12.5px] text-muted ml-1.5 font-medium"
                >
                  {slot.teacher}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Time Badge */}
        <View className="bg-app px-3 py-1.5 rounded-2xl border border-border items-end">
          <View className="flex-row items-center">
            <Feather name="clock" size={12} color={THEME.primary} />
            <Text className="text-[12.5px] font-bold text-primary ml-1.5">
              {slot.startTime}
            </Text>
          </View>
          <Text className="text-[11px] text-light mt-0.5">
            to {slot.endTime}
          </Text>
        </View>
      </View>

      {/* Room & Lecture Type */}
      <View className="mt-3.5 pt-3 border-t border-border flex-row items-center justify-between">
        {slot.room ? (
          <View className="flex-row items-center">
            <Feather name="map-pin" size={13} color={THEME.light} />
            <Text className="text-[12px] font-medium text-muted ml-1.5">
              {slot.room}
            </Text>
          </View>
        ) : (
          <View />
        )}

        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-status-success mr-1.5" />
          <Text className="text-[11.5px] font-semibold text-muted">
            Standard 45m Lecture
          </Text>
        </View>
      </View>
    </AppCard>
  );
};

export default TimetableCard;
