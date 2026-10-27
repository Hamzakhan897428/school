import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface DashboardGridItemProps {
  icon: React.ReactNode;
  label: string;
  badgeCount?: number;
  onPress: () => void;
  className?: string;
}

export const DashboardGridItem: React.FC<DashboardGridItemProps> = ({
  icon,
  label,
  badgeCount,
  onPress,
  className = "",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`relative flex-1 min-w-[45%] bg-card rounded-3xl p-4 m-1.5 items-center justify-center border border-border shadow-sm ${className}`}
    >
      {/* Optional Notification Badge */}
      {typeof badgeCount === "number" && badgeCount > 0 && (
        <View className="absolute top-3 right-3 bg-status-danger rounded-full min-w-[20px] h-[20px] px-1.5 items-center justify-center z-10 shadow-xs">
          <Text className="text-card text-[11px] font-bold">
            {badgeCount > 99 ? "99+" : badgeCount}
          </Text>
        </View>
      )}

      {/* Soft Tinted Squircle */}
      <View className="w-14 h-14 rounded-2xl bg-primary-soft items-center justify-center mb-3">
        {icon}
      </View>

      {/* Label */}
      <Text
        numberOfLines={1}
        className="text-[13.5px] font-semibold text-main text-center tracking-tight"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default DashboardGridItem;
