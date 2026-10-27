import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { WeekDay } from "../types/portal";

interface DayPillProps {
  day: WeekDay;
  isSelected: boolean;
  onPress: () => void;
  className?: string;
}

export const DayPill: React.FC<DayPillProps> = ({
  day,
  isSelected,
  onPress,
  className = "",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`px-4 py-2.5 rounded-full items-center justify-center min-w-[50px] border ${
        isSelected
          ? "bg-primary border-primary shadow-sm"
          : "bg-card border-border active:bg-app"
      } ${className}`}
    >
      <Text
        className={`text-[13.5px] font-bold tracking-tight ${
          isSelected ? "text-card" : "text-muted"
        }`}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );
};

export default DayPill;
